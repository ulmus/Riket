#!/bin/bash
# Build a PDF of the world book using pandoc + weasyprint
set -e

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
WORLDDIR="$BASEDIR/Världen"
OUTPUT="$BASEDIR/pdf/I Rikets Tjänst - Världen.pdf"
TMPHTML="$BASEDIR/.tmp-varlden.html"

# Files in reading order
INPUT_FILES=(
  "$WORLDDIR/Bakgrund.md"
  "$WORLDDIR/Projekt Nigredo (Nazi-Tyskland).md"
  "$WORLDDIR/Program Frigg (Sverige).md"
  "$WORLDDIR/Projekt Nebelkrone (Östtyskland).md"
  "$WORLDDIR/Sotsializma Pervye Zvezdy (Socialismens Första Stjärnor, Sovjetunionen).md"
  "$WORLDDIR/Project Phoenix (USA).md"
  "$WORLDDIR/Operation Grendel (Storbritannien).md"
  "$WORLDDIR/Projet Chimère (Frankrike).md"
)

echo "Building PDF from ${#INPUT_FILES[@]} files..."

# Preprocess: concatenate with blank lines between files, then convert Obsidian image syntax
TMPMD="$BASEDIR/.tmp-varlden.md"
: > "$TMPMD"
for f in "${INPUT_FILES[@]}"; do
  cat "$f" >> "$TMPMD"
  printf '\n\n' >> "$TMPMD"
done
# [![[image.png]]](<path>) → ![](path)
sed -i '' -E 's/\[!\[\[([^]]+)\]\]\]\(<([^)]+)>\)/![](\2)/g' "$TMPMD"
# ![[image.png]] or ![[image.png|options]] → ![](image.png)
sed -i '' -E 's/!\[\[([^]|]+)(\|[^]]+)?\]\]/![](\1)/g' "$TMPMD"
# Resolve image paths to absolute paths
sed -i '' "s|](\([^/)][^)]*\.png\))|]($BASEDIR/Assets/\1)|g" "$TMPMD"

pandoc \
  --from=markdown \
  --to=html5 \
  --standalone \
  --toc \
  --toc-depth=2 \
  --metadata title="I Rikets Tjänst – Världen" \
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
  <p class="title-subtitle">Världen</p>\
</div>' "$TMPHTML"

weasyprint "$TMPHTML" "$OUTPUT"

rm -f "$TMPHTML" "$TMPMD"
echo "Done: $OUTPUT"
