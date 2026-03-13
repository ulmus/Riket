#!/bin/bash
# Build a PDF of the adventure "Extraktionen" using pandoc + weasyprint
set -e

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
BERLIN="$BASEDIR/Äventyr/Berlin"
OUTPUT="$BASEDIR/pdf/I Rikets Tjänst - Extraktionen.pdf"
TMPHTML="$BASEDIR/.tmp-extraktionen.html"

# Files in reading order
INPUT_FILES=(
  "$BERLIN/Extraktionen.md"
  "$BERLIN/Uppdragsbriefing - Berlin.md"
)

echo "Building PDF from ${#INPUT_FILES[@]} files..."

# Preprocess: convert Obsidian image syntax to standard markdown
TMPMD="$BASEDIR/.tmp-extraktionen.md"
: > "$TMPMD"
for f in "${INPUT_FILES[@]}"; do
  cat "$f" >> "$TMPMD"
  printf '\n\n' >> "$TMPMD"
done
# [![[image.png]]](<path>) → ![](path)
sed -i '' -E 's/\[!\[\[([^]]+)\]\]\]\(<([^)]+)>\)/![](\2)/g' "$TMPMD"
# ![[image.png]] or ![[image.png|options]] → ![](image.png)
sed -i '' -E 's/!\[\[([^]|]+)(\|[^]]+)?\]\]/![](\1)/g' "$TMPMD"

# Fix image paths: map images live in Kartor/, Lars Hedström in Assets/
sed -i '' "s|](Lars Hedström.png)|]($BASEDIR/Assets/Lars Hedström.png)|g" "$TMPMD"
sed -i '' -E '/!\[\]\(SLP\//! s|!\[\]\(([^/)]+\.png)\)|![](Kartor/\1)|g' "$TMPMD"

pandoc \
  --from=markdown \
  --to=html5 \
  --standalone \
  --toc \
  --toc-depth=2 \
  --resource-path="$BERLIN" \
  --metadata title="I Rikets Tjänst – Extraktionen" \
  --css="$BASEDIR/regler.css" \
  --wrap=none \
  "$TMPMD" \
  -o "$TMPHTML"

# Strip Obsidian wikilinks
sed -i '' -E 's/\[\[([^]|#]+)(#[^]|]*)?\|([^]]+)\]\]/\3/g; s/\[\[([^]|#]+)(#[^]]*)?]]/\1/g' "$TMPHTML"

# Replace pandoc's auto-generated header with custom title page
sed -i '' '/<header/,/<\/header>/c\
<div class="title-page">\
  <div class="title-rule"></div>\
  <h1 class="title-heading">I Rikets Tjänst</h1>\
  <div class="title-rule"></div>\
  <p class="title-subtitle">Extraktionen</p>\
</div>' "$TMPHTML"

# Make relative image paths absolute for weasyprint
sed -i '' "s|src=\"\([^/\"]\)|src=\"$BERLIN/\1|g" "$TMPHTML"

weasyprint "$TMPHTML" "$OUTPUT"

rm -f "$TMPHTML" "$TMPMD"
echo "Done: $OUTPUT"
