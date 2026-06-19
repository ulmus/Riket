# shellcheck shell=bash
# Delat bibliotek för PDF-byggskripten i I Rikets Tjänst.
#
# Innehåller portabla hjälpfunktioner för att förbehandla Obsidian-markdown
# och pandoc-genererad HTML. All textmanipulering sker med perl i stället för
# "sed -i", eftersom "sed -i" har olika syntax på macOS (BSD) och Linux (GNU).
# Perl beter sig identiskt på båda plattformarna.
#
# Källas (source) från build-pdf.sh och build-pdf-karaktärer.sh.

irt_die() {
  echo "Fel: $*" >&2
  exit 1
}

# Kontrollera att nödvändiga verktyg finns innan en riktig byggning startar.
irt_require_build_tools() {
  command -v perl >/dev/null      || irt_die "perl saknas (krävs för förbehandling)."
  command -v pandoc >/dev/null    || irt_die "pandoc saknas (krävs för markdown→HTML)."
  command -v weasyprint >/dev/null || irt_die "weasyprint saknas (krävs för HTML→PDF)."
}

# Konvertera Obsidians bildsyntax till vanlig markdown, på plats.
#   [![[bild.png]]](<sökväg>)      → ![](sökväg)
#   ![[bild.png]] / ![[bild.png|x]] → ![](bild.png)
irt_obsidian_to_md() {
  local file="$1"
  perl -CSD -i -pe '
    s/\[!\[\[([^\]]+)\]\]\]\(<([^)]+)>\)/![]($2)/g;
    s/!\[\[([^\]|]+)(\|[^\]]+)?\]\]/![]($1)/g;
  ' "$file"
}

# Lös upp bildreferenser (![](namn.png)) till absoluta sökvägar genom att leta
# upp varje filnamn i de angivna katalogerna (rekursivt). Varnar för bilder som
# inte hittas i stället för att tyst producera en trasig PDF.
#   irt_resolve_images <markdownfil> <katalog> [katalog ...]
irt_resolve_images() {
  local md="$1"; shift
  local dirs=("$@")
  local content ref base found refs
  content="$(cat "$md")"
  # grep returnerar 1 om boken saknar bilder; det är inte ett fel.
  refs="$(grep -oE '\]\([^)]*\.(png|jpg|jpeg|PNG|JPG|JPEG)\)' "$md" \
            | sed -E 's/^\]\((.*)\)$/\1/' | sort -u || true)"
  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    case "$ref" in /*) continue ;; esac   # redan absolut
    base="$(basename "$ref")"
    found=""
    for d in "${dirs[@]}"; do
      [ -d "$d" ] || continue
      found="$(find "$d" -type f -name "$base" 2>/dev/null | head -n1)"
      [ -n "$found" ] && break
    done
    if [ -n "$found" ]; then
      content="${content//"]($ref)"/"]($found)"}"
    else
      echo "  Varning: hittar inte bild: $ref" >&2
    fi
  done <<< "$refs"
  printf '%s\n' "$content" > "$md"
}

# Ta bort Obsidian-wikilänkar i pandoc-genererad HTML, på plats.
#   [[Mål#Rubrik|Visat]] → Visat
#   [[Mål#Rubrik]]       → Mål
irt_strip_wikilinks() {
  local file="$1"
  perl -CSD -i -pe '
    s/\[\[([^\]|#]+)(#[^\]|]*)?\|([^\]]+)\]\]/$3/g;
    s/\[\[([^\]|#]+)(#[^\]]*)?\]\]/$1/g;
  ' "$file"
}

# Ersätt pandocs autogenererade <header> med en titelsida.
#   irt_strip_title_page <htmlfil> <undertitel>
irt_title_page() {
  local file="$1" subtitle="$2"
  # Ren byte-läge (inte -CSD): UTF-8 i programlitteraler ("Tjänst") och i
  # undertiteln passerar då oförändrade i stället för att feltolkas som Latin-1.
  IRT_SUBTITLE="$subtitle" perl -0777 -i -pe '
    s{<header.*?</header>}{
      "<div class=\"title-page\">\n" .
      "  <div class=\"title-rule\"></div>\n" .
      "  <h1 class=\"title-heading\">I Rikets Tjänst</h1>\n" .
      "  <div class=\"title-rule\"></div>\n" .
      "  <p class=\"title-subtitle\">$ENV{IRT_SUBTITLE}</p>\n" .
      "</div>"
    }se;
  ' "$file"
}

# Ta bort pandocs autogenererade <header> helt (används för rollformulär).
irt_strip_header() {
  local file="$1"
  perl -CSD -0777 -i -pe 's{<header.*?</header>}{}s' "$file"
}

# Linda kryssrutetecken (❏, U+274F) i span för större typsnitt i rollformulär.
irt_wrap_checkboxes() {
  local file="$1"
  perl -CSD -i -pe 's/\x{274F}/<span class="cb">\x{274F}<\/span>/g' "$file"
}
