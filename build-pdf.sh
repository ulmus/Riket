#!/bin/bash
# Bygg PDF:er för I Rikets Tjänst utifrån Manuskript.md (pandoc + weasyprint).
#
# Manuskript.md anger vilka kapitel som ingår i varje bok och i vilken ordning.
# Se den filen för formatet (Markdown med en rubrik per bok och en wikilänk per
# kapitel) — redigera manuskriptet, inte det här skriptet, för att ändra innehåll.
#
# Användning:
#   ./build-pdf.sh            Bygg alla böcker i Manuskript.md
#   ./build-pdf.sh <id>       Bygg bara boken med angivet id (t.ex. regler)
#   ./build-pdf.sh --check    Validera manuskriptet utan att bygga (kräver inte
#                             pandoc/weasyprint): kontrollerar att alla kapitel-
#                             filer finns och att alla bildreferenser kan hittas.
#   ./build-pdf.sh --check <id>   Validera bara en bok.
#
# Rollpersoner byggs separat med build-pdf-karaktärer.sh.
set -euo pipefail

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=build-lib.sh
source "$BASEDIR/build-lib.sh"

MANIFEST="$BASEDIR/Manuskript.md"
PDFDIR="$BASEDIR/pdf"

MODE="build"
WANT=""
for arg in "$@"; do
  case "$arg" in
    --check) MODE="check" ;;
    --help|-h) awk 'NR==1{next} /^#/{sub(/^# ?/,"");print;next} {exit}' "$0"; exit 0 ;;
    -*) irt_die "Okänd flagga: $arg" ;;
    *) WANT="$arg" ;;
  esac
done

[ -f "$MANIFEST" ] || irt_die "Hittar inte Manuskript.md ($MANIFEST)."
[ "$MODE" = "build" ] && irt_require_build_tools

trim() {
  local s="$1"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  printf '%s' "$s"
}

# Lös upp ett wikilänk-mål (texten mellan [[ och ]]) till en repo-relativ
# .md-sökväg och skriv den till stdout. Ett bart filnamn räcker när det är unikt;
# ange så mycket av sökvägen som behövs ([[Mapp/Fil]]) när flera filer delar namn.
# Saknas filen skrivs målet ut oförändrat så att anroparen kan rapportera SAKNAS.
# Returnerar icke-noll vid tvetydighet.
resolve_chapter() {
  local target base matches m rel hits count
  target="$1"
  target="${target%%|*}"      # ta bort | alias
  target="${target%%#*}"      # ta bort #sektion
  target="$(trim "$target")"
  [ -z "$target" ] && return 1
  case "$target" in *.md) ;; *) target="$target.md" ;; esac

  # Direkt repo-relativ sökväg?
  if [ -f "$BASEDIR/$target" ]; then
    printf '%s' "$target"
    return 0
  fi

  # Annars: sök på filnamnet och filtrera på angivet sökvägssuffix.
  base="$(basename "$target")"
  matches="$(find "$BASEDIR" \( -path "$BASEDIR/.git" -o -path "$PDFDIR" \
                 -o -path "$BASEDIR/node_modules" -o -path "$BASEDIR/.quartz" \
                 -o -path "$BASEDIR/public" -o -path "$BASEDIR/quartz" \) -prune \
               -o -type f -name "$base" -print 2>/dev/null)"
  hits=""
  while IFS= read -r m; do
    [ -z "$m" ] && continue
    rel="${m#"$BASEDIR/"}"
    case "/$rel" in */"$target") hits="$hits$rel"$'\n' ;; esac
  done <<< "$matches"

  count="$(printf '%s' "$hits" | grep -c . || true)"
  if [ "$count" -eq 1 ]; then
    printf '%s' "$hits" | head -n1
    return 0
  elif [ "$count" -eq 0 ]; then
    printf '%s' "$target"     # låt anroparen rapportera SAKNAS
    return 0
  else
    echo "  TVETYDIG: \"${target%.md}\" matchar flera filer — ange mer av sökvägen." >&2
    printf '%s' "$target"
    return 1
  fi
}

BUILT=0
ERRORS=0
MATCHED=0

# Bygg eller validera en bok.
process_book() {
  local id="$1" subtitle="$2" css="$3" toc="$4"; shift 4
  local files=("$@")

  if [ -n "$WANT" ] && [ "$WANT" != "$id" ]; then
    return 0
  fi
  MATCHED=$((MATCHED + 1))

  # Kontrollera att alla kapitelfiler finns.
  local missing=0 rel abs
  local searchdirs=()
  for rel in "${files[@]}"; do
    abs="$BASEDIR/$rel"
    if [ ! -f "$abs" ]; then
      echo "  SAKNAS: $rel" >&2
      missing=1
    else
      searchdirs+=("$(dirname "$abs")")
    fi
  done
  if [ "$missing" -ne 0 ]; then
    echo "Bok '$id': en eller flera kapitelfiler saknas." >&2
    ERRORS=$((ERRORS + 1))
    return 0
  fi
  searchdirs+=("$BASEDIR/content/Assets" "$BASEDIR/content/Karaktärer/Bilder" "$BASEDIR/content/Världen/Bilder")

  # Förbehandla en sammanslagen temporär markdownfil.
  local tmpmd="$BASEDIR/.tmp-$id.md"
  : > "$tmpmd"
  for rel in "${files[@]}"; do
    cat "$BASEDIR/$rel" >> "$tmpmd"
    printf '\n\n' >> "$tmpmd"
  done
  irt_obsidian_to_md "$tmpmd"
  irt_resolve_images "$tmpmd" "${searchdirs[@]}"

  if [ "$MODE" = "check" ]; then
    echo "OK: bok '$id' (${#files[@]} kapitel) — alla filer finns."
    rm -f "$tmpmd"
    return 0
  fi

  mkdir -p "$PDFDIR"
  local tmphtml="$BASEDIR/.tmp-$id.html"
  local output="$PDFDIR/I Rikets Tjänst - $subtitle.pdf"
  local pandoc_args=(--from=markdown --to=html5 --standalone)
  [ "$toc" = "yes" ] && pandoc_args+=(--toc --toc-depth=2)
  pandoc_args+=(--metadata title="I Rikets Tjänst – $subtitle" --css="$BASEDIR/$css" --wrap=none)

  echo "Bygger '$id' → $output"
  pandoc "${pandoc_args[@]}" "$tmpmd" -o "$tmphtml"
  irt_strip_wikilinks "$tmphtml"
  irt_title_page "$tmphtml" "$subtitle"
  weasyprint "$tmphtml" "$output"
  rm -f "$tmphtml" "$tmpmd"
  echo "  Klar: $output"
  BUILT=$((BUILT + 1))
}

# Tolka Manuskript.md rad för rad.
#   ## Rubrik              startar en bok; rubriken blir undertiteln
#   ## ~~Rubrik~~          genomstruken rubrik = inaktiverad bok (hoppas över)
#   <!-- bok: id | css: x [| notoc] -->   bokens metadata, direkt under rubriken
#   - [[Fil]]              kapitel i läsordning (wikilänk)
cur_id=""; cur_sub=""; cur_css=""; cur_toc="yes"
files=()
in_comment=0

reset_book() { cur_id=""; cur_sub=""; cur_css=""; cur_toc="yes"; files=(); }

flush() {
  # Bara rubriker med både metadata och minst ett kapitel byggs. En rubrik utan
  # kapitel (prosaavsnitt) eller en genomstruken rubrik (cur_sub tom) hoppas över.
  if [ -z "$cur_sub" ] || [ "${#files[@]}" -eq 0 ]; then
    reset_book
    return 0
  fi
  if [ -z "$cur_id" ] || [ -z "$cur_css" ]; then
    echo "Boken \"$cur_sub\" saknar metadata-kommentar (<!-- bok: id | css: fil -->)." >&2
    ERRORS=$((ERRORS + 1))
    reset_book
    return 0
  fi
  process_book "$cur_id" "$cur_sub" "$cur_css" "$cur_toc" "${files[@]}"
  reset_book
}

while IFS= read -r line || [ -n "$line" ]; do
  # Hoppa över fleradiga HTML-kommentarer.
  if [ "$in_comment" -eq 1 ]; then
    case "$line" in *'-->'*) in_comment=0 ;; esac
    continue
  fi
  line="$(trim "$line")"
  [ -z "$line" ] && continue
  case "$line" in
    '<!--'*'-->')                       # enradig kommentar
      inner="${line#<!--}"; inner="${inner%-->}"; inner="$(trim "$inner")"
      case "$inner" in
        bok:*)
          meta="$(trim "${inner#bok:}")"
          IFS='|' read -ra parts <<< "$meta"
          cur_id="$(trim "${parts[0]:-}")"
          for p in "${parts[@]:1}"; do
            p="$(trim "$p")"
            case "$p" in
              css:*) cur_css="$(trim "${p#css:}")" ;;
              notoc) cur_toc="no" ;;
            esac
          done
          ;;
      esac
      ;;
    '<!--'*) in_comment=1 ;;            # öppnande kommentar utan stängning
    '## '*)                             # ny bok (## ~~...~~ = inaktiverad)
      flush
      sub="$(trim "${line#\#\#}")"
      case "$sub" in
        '~~'*) ;;                       # genomstruken → lämna cur_sub tom (hoppas)
        *) cur_sub="$sub" ;;
      esac
      ;;
    '- '*|'* '*|'+ '*)                  # listpunkt → kapitel (om inne i en bok)
      [ -n "$cur_sub" ] || continue
      case "$line" in
        *'[['*']]'*)
          rest="${line#*\[\[}"; target="${rest%%\]\]*}"
          # Tvetydiga/saknade mål rapporteras av process_book (SAKNAS); här
          # sväljer vi bara returkoden så att "set -e" inte avbryter bygget.
          rel="$(resolve_chapter "$target")" || true
          files+=("$rel")
          ;;
      esac
      ;;
    *) : ;;                             # prosa, andra rubriker m.m. — ignorera
  esac
done < "$MANIFEST"
flush

if [ -n "$WANT" ] && [ "$MATCHED" -eq 0 ]; then
  irt_die "Ingen bok med id '$WANT' i Manuskript.md."
fi

if [ "$ERRORS" -ne 0 ]; then
  irt_die "$ERRORS bok/böcker hade problem (se ovan)."
fi

if [ "$MODE" = "check" ]; then
  echo "Manuskript validerat."
else
  echo "Klart: $BUILT bok/böcker byggda."
fi
