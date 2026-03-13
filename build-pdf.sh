#!/bin/bash
# Build a PDF of the complete rulebook using pandoc + weasyprint
set -e

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
REGLER="$BASEDIR/Regler"
OUTPUT="$BASEDIR/pdf/I Rikets Tjänst - Regler.pdf"
TMPHTML="$BASEDIR/.tmp-regler.html"

# Files in reading order (excluding quick references)
FILES=(
  "Grundregler.md"
  "Skapa och utveckla en rollperson.md"
  "Expertiser.md"
  "Förmågor.md"
  "Krafter.md"
  "Trauma, skräck och stress.md"
  "Aktiviteter.md"
  "Strid och skada.md"
  "Vapen.md"
  "Kritiska träffar.md"
  "Läkning & vård.md"
  "Särskilda situationer.md"
  "Snabbreferens.md"
  "Snabbreferens - Förmågor.md"
)

# Build input list
INPUT_FILES=("$BASEDIR/Introduktion.md")
for f in "${FILES[@]}"; do
  if [ -f "$REGLER/$f" ]; then
    INPUT_FILES+=("$REGLER/$f")
  else
    echo "Warning: $f not found, skipping"
  fi
done
INPUT_FILES+=("$BASEDIR/Terminologi.md")

echo "Building PDF from ${#INPUT_FILES[@]} files..."

# Preprocess: concatenate with blank lines between files, then convert Obsidian image syntax
TMPMD="$BASEDIR/.tmp-regler.md"
: > "$TMPMD"
for f in "${INPUT_FILES[@]}"; do
  cat "$f" >> "$TMPMD"
  printf '\n\n' >> "$TMPMD"
done
# [![[image.png]]](<path>) → ![](path)
sed -i '' -E 's/\[!\[\[([^]]+)\]\]\]\(<([^)]+)>\)/![](\2)/g' "$TMPMD"
# ![[image.png]] or ![[image.png|options]] → ![](image.png)
sed -i '' -E 's/!\[\[([^]|]+)(\|[^]]+)?\]\]/![](\1)/g' "$TMPMD"

# Convert markdown to HTML with pandoc, then to PDF with weasyprint
pandoc \
  --from=markdown \
  --to=html5 \
  --standalone \
  --toc \
  --toc-depth=2 \
  --metadata title="I Rikets Tjänst – Regler" \
  --css="$BASEDIR/regler.css" \
  --wrap=none \
  "$TMPMD" \
  -o "$TMPHTML"

# Strip Obsidian wikilinks: [[Target#Heading|Display]] → Display, [[Target]] → Target
sed -i '' -E 's/\[\[([^]|#]+)(#[^]|]*)?\|([^]]+)\]\]/\3/g; s/\[\[([^]|#]+)(#[^]]*)?]]/\1/g' "$TMPHTML"

# Replace pandoc's auto-generated header with custom title page
sed -i '' '/<header/,/<\/header>/c\
<div class="title-page">\
  <div class="title-rule"></div>\
  <h1 class="title-heading">I Rikets Tjänst</h1>\
  <div class="title-rule"></div>\
  <p class="title-subtitle">Regelbok</p>\
</div>' "$TMPHTML"

weasyprint "$TMPHTML" "$OUTPUT"

rm -f "$TMPHTML" "$TMPMD"
echo "Done: $OUTPUT"
