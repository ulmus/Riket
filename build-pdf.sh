#!/bin/bash
# Build a PDF of the complete rulebook using pandoc + weasyprint
set -e

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
REGLER="$BASEDIR/Regler"
OUTPUT="$BASEDIR/I Rikets Tjänst - Regler.pdf"
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
INPUT_FILES=()
for f in "${FILES[@]}"; do
  if [ -f "$REGLER/$f" ]; then
    INPUT_FILES+=("$REGLER/$f")
  else
    echo "Warning: $f not found, skipping"
  fi
done

echo "Building PDF from ${#INPUT_FILES[@]} files..."

# Convert markdown to HTML with pandoc, then to PDF with weasyprint
pandoc \
  --from=markdown \
  --to=html5 \
  --standalone \
  --metadata title="I Rikets Tjänst – Regler" \
  --css="$BASEDIR/regler.css" \
  --wrap=none \
  "${INPUT_FILES[@]}" \
  -o "$TMPHTML"

# Strip Obsidian wikilinks: [[Target#Heading|Display]] → Display, [[Target]] → Target
sed -i '' -E 's/\[\[([^]|#]+)(#[^]|]*)?\|([^]]+)\]\]/\3/g; s/\[\[([^]|#]+)(#[^]]*)?]]/\1/g' "$TMPHTML"

weasyprint "$TMPHTML" "$OUTPUT"

rm -f "$TMPHTML"
echo "Done: $OUTPUT"
