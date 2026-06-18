#!/bin/bash
# Bygg PDF:er för I Rikets Tjänst utifrån spine.txt (pandoc + weasyprint).
#
# Användning:
#   ./build-pdf.sh            Bygg alla böcker i spine.txt
#   ./build-pdf.sh <id>       Bygg bara boken med angivet id (t.ex. regler)
#   ./build-pdf.sh --check    Validera spinen utan att bygga (kräver inte
#                             pandoc/weasyprint): kontrollerar att alla kapitel-
#                             filer finns och att alla bildreferenser kan hittas.
#   ./build-pdf.sh --check <id>   Validera bara en bok.
#
# Rollpersoner byggs separat med build-pdf-karaktärer.sh.
set -euo pipefail

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=build-lib.sh
source "$BASEDIR/build-lib.sh"

SPINE="$BASEDIR/spine.txt"
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

[ -f "$SPINE" ] || irt_die "Hittar inte spine.txt ($SPINE)."
[ "$MODE" = "build" ] && irt_require_build_tools

trim() {
  local s="$1"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  printf '%s' "$s"
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
  searchdirs+=("$BASEDIR/Assets" "$BASEDIR/Karaktärer/Bilder" "$BASEDIR/Världen/Bilder")

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

# Tolka spine.txt rad för rad.
cur_id=""; cur_sub=""; cur_css=""; cur_toc="yes"
files=()

flush() {
  [ -z "$cur_id" ] && return 0
  process_book "$cur_id" "$cur_sub" "$cur_css" "$cur_toc" "${files[@]}"
  files=()
}

while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in \#*) continue ;; esac
  line="$(trim "$line")"
  [ -z "$line" ] && continue
  if [ "${line:0:1}" = "=" ]; then
    flush
    IFS='|' read -r h_id h_sub h_css h_flags <<< "${line#=}"
    cur_id="$(trim "$h_id")"
    cur_sub="$(trim "$h_sub")"
    cur_css="$(trim "$h_css")"
    cur_toc="yes"
    [[ "$(trim "${h_flags:-}")" == *notoc* ]] && cur_toc="no"
    [ -n "$cur_id" ] || irt_die "Bokrubrik saknar id: $line"
    [ -n "$cur_sub" ] || irt_die "Bok '$cur_id' saknar undertitel."
    [ -n "$cur_css" ] || irt_die "Bok '$cur_id' saknar css."
  else
    files+=("$line")
  fi
done < "$SPINE"
flush

if [ -n "$WANT" ] && [ "$MATCHED" -eq 0 ]; then
  irt_die "Ingen bok med id '$WANT' i spine.txt."
fi

if [ "$ERRORS" -ne 0 ]; then
  irt_die "$ERRORS bok/böcker hade problem (se ovan)."
fi

if [ "$MODE" = "check" ]; then
  echo "Spine validerad."
else
  echo "Klart: $BUILT bok/böcker byggda."
fi
