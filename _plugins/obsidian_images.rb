# frozen_string_literal: true

# Converts Obsidian-style image embeds into standard HTML <img> tags.
#
# Supported patterns:
#   ![[image.png]]                  → <img src="resolved/path/image.png" alt="image">
#   ![[image.png|200]]              → <img src="..." alt="image" width="200">
#   ![[image.png|inline|200]]       → <img src="..." alt="image" width="200">
#   [![[image.png]]](<image.png>)   → <img src="resolved/path/image.png" alt="image">
#
# Images are resolved by filename across the entire site, mimicking
# Obsidian's "shortest path when possible" setting.

module Jekyll
  class ObsidianImages < Generator
    safe true
    priority :low

    IMAGE_EXTENSIONS = %w[.png .jpg .jpeg .gif .svg .webp .bmp].freeze

    def generate(site)
      build_image_map(site)

      site.pages.each do |page|
        next unless page.content
        page.content = convert_image_embeds(page.content, page, site)
      end

      site.docs_to_write.each do |doc|
        next unless doc.content
        doc.content = convert_image_embeds(doc.content, doc, site)
      end
    end

    private

    def build_image_map(site)
      @image_map = {}

      site.static_files.each do |sf|
        ext = File.extname(sf.path).downcase
        next unless IMAGE_EXTENSIONS.include?(ext)

        basename = File.basename(sf.relative_path)
        # Store by basename; if duplicates, keep all with their paths
        @image_map[basename] ||= []
        @image_map[basename] << sf.relative_path
      end
    end

    def convert_image_embeds(content, page, site)
      # First, handle the hybrid pattern: [![[image.png]]](<image.png>)
      content = content.gsub(
        /\[!\[\[([^\]]+?)\]\]\]\([^)]*\)/
      ) do
        process_image_embed(Regexp.last_match(1), page, site)
      end

      # Then handle standard Obsidian embeds: ![[image.png]] or ![[image.png|params]]
      content.gsub(/!\[\[([^\]]+?)\]\]/) do
        process_image_embed(Regexp.last_match(1), page, site)
      end
    end

    def process_image_embed(inner, page, site)
      # Split on | to get filename and optional parameters
      parts = inner.split("|").map(&:strip)
      filename = parts[0]

      # Extract width from parameters (a bare number)
      width = nil
      parts[1..].each do |param|
        width = param if param.match?(/\A\d+\z/)
      end

      # Only handle image files
      ext = File.extname(filename).downcase
      return "![[#{inner}]]" unless IMAGE_EXTENSIONS.include?(ext)

      # Resolve the image path
      resolved = resolve_image(filename, page)
      return "![[#{inner}]]" unless resolved

      # Build the URL with baseurl
      url = "#{site.config["baseurl"]}/#{resolved}".gsub(%r{/+}, "/")

      alt = File.basename(filename, ext)
      width_attr = width ? " width=\"#{width}\"" : ""

      "<a href=\"#{url}\"><img src=\"#{url}\" alt=\"#{alt}\"#{width_attr}></a>"
    end

    def resolve_image(filename, page)
      basename = File.basename(filename)

      # Direct match by basename
      if @image_map.key?(basename)
        candidates = @image_map[basename]
        return candidates[0] if candidates.length == 1

        # Multiple matches: prefer one closest to the referring page
        page_dir = File.dirname(page.relative_path)
        best = candidates.min_by do |path|
          # Count how many path components differ
          common_prefix_length(page_dir, File.dirname(path))
        end
        return best
      end

      # Try matching with the relative path included (e.g., "Bilder/Prisma.png")
      @image_map.each_value do |paths|
        paths.each do |path|
          return path if path.end_with?(filename)
        end
      end

      nil
    end

    def common_prefix_length(path_a, path_b)
      parts_a = path_a.split("/")
      parts_b = path_b.split("/")
      shared = parts_a.zip(parts_b).take_while { |a, b| a == b }.length
      # Return inverse so min_by picks the closest
      -shared
    end
  end
end
