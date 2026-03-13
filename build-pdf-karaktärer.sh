#!/bin/bash
# Build one PDF per character using pandoc + weasyprint
set -e

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
CHARS="$BASEDIR/Karaktärer"
TMPHTML="$BASEDIR/.tmp-char.html"

for f in "$CHARS"/*.md; do
  NAME="$(basename "$f" .md)"
  OUTPUT="$BASEDIR/pdf/I Rikets Tjänst - $NAME.pdf"

  echo "Building $NAME..."

  # Preprocess: convert Obsidian image syntax to standard markdown
  TMPMD="$BASEDIR/.tmp-char.md"
  cp "$f" "$TMPMD"
  sed -i '' -E 's/\[!\[\[([^]]+)\]\]\]\(<([^)]+)>\)/![](\2)/g' "$TMPMD"
  sed -i '' -E 's/!\[\[([^]|]+)(\|[^]]+)?\]\]/![](\1)/g' "$TMPMD"

  # Make image paths absolute
  sed -i '' "s|](Bilder/|]($CHARS/Bilder/|g" "$TMPMD"

  pandoc \
    --from=markdown \
    --to=html5 \
    --standalone \
    --resource-path="$CHARS" \
    --css="$BASEDIR/karaktär.css" \
    --wrap=none \
    "$TMPMD" \
    -o "$TMPHTML"

  # Strip Obsidian wikilinks
  sed -i '' -E 's/\[\[([^]|#]+)(#[^]|]*)?\|([^]]+)\]\]/\3/g; s/\[\[([^]|#]+)(#[^]]*)?]]/\1/g' "$TMPHTML"

  # Remove pandoc's auto-generated header (no title page for characters)
  sed -i '' '/<header/,/<\/header>/d' "$TMPHTML"

  # Wrap checkbox characters in span for larger font
  sed -i '' 's/❏/<span class="cb">❏<\/span>/g' "$TMPHTML"

  weasyprint "$TMPHTML" "$OUTPUT"
  echo "  Done: $OUTPUT"
done

rm -f "$TMPHTML" "$TMPMD"
echo "All characters built."
