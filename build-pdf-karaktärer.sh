#!/bin/bash
# Bygg en PDF per rollperson (pandoc + weasyprint).
#
# Rollpersoner har egen layout (karaktär.css, ingen titelsida, ingen
# innehållsförteckning) och byggs därför separat från de linjära böckerna i
# Manuskript.md. Se build-pdf.sh för regelbok, värld och äventyr.
set -euo pipefail

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=build-lib.sh
source "$BASEDIR/build-lib.sh"

irt_require_build_tools

CHARS="$BASEDIR/Karaktärer"
PDFDIR="$BASEDIR/pdf"
mkdir -p "$PDFDIR"

shopt -s nullglob
for f in "$CHARS"/*.md; do
  NAME="$(basename "$f" .md)"
  OUTPUT="$PDFDIR/I Rikets Tjänst - $NAME.pdf"
  TMPMD="$BASEDIR/.tmp-char.md"
  TMPHTML="$BASEDIR/.tmp-char.html"

  echo "Bygger $NAME..."
  cp "$f" "$TMPMD"
  irt_obsidian_to_md "$TMPMD"
  irt_resolve_images "$TMPMD" "$CHARS/Bilder" "$CHARS" "$BASEDIR/Assets"

  pandoc \
    --from=markdown \
    --to=html5 \
    --standalone \
    --css="$BASEDIR/karaktär.css" \
    --wrap=none \
    "$TMPMD" \
    -o "$TMPHTML"

  irt_strip_wikilinks "$TMPHTML"
  irt_strip_header "$TMPHTML"
  irt_wrap_checkboxes "$TMPHTML"

  weasyprint "$TMPHTML" "$OUTPUT"
  rm -f "$TMPHTML" "$TMPMD"
  echo "  Klar: $OUTPUT"
done

echo "Alla rollpersoner byggda."
