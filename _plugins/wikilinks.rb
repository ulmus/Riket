# frozen_string_literal: true

# Converts Obsidian-style wikilinks [[Page Name]] and [[Page Name|Display]]
# and [[Page Name#Section]] into standard HTML links during Jekyll build.

module Jekyll
  class WikilinksConverter < Generator
    safe true
    priority :low

    def generate(site)
      # Build a lookup: basename (without extension) -> page URL
      @page_map = {}
      all_pages = site.pages + site.docs_to_write
      all_pages.each do |page|
        basename = File.basename(page.path, File.extname(page.path))
        @page_map[basename] = page.url
      end

      # Process all pages and documents
      all_pages.each do |page|
        next unless page.content
        page.content = convert_wikilinks(page.content, site)
      end
    end

    private

    def convert_wikilinks(content, site)
      content.gsub(/\[\[([^\]]+?)\]\]/) do |match|
        inner = Regexp.last_match(1)

        # Split on | for display text: [[target|display]]
        if inner.include?("|")
          target, display = inner.split("|", 2)
        else
          target = inner
          display = nil
        end

        target = target.strip
        display = display&.strip

        # Split on # for anchor: [[Page#Section]]
        if target.include?("#")
          page_part, anchor_part = target.split("#", 2)
          page_part = page_part.strip
          anchor_part = anchor_part.strip
        else
          page_part = target
          anchor_part = nil
        end

        # Default display text
        display ||= anchor_part ? "#{page_part} - #{anchor_part}" : page_part
        display = page_part.empty? ? anchor_part : display

        # Resolve the page URL
        url = resolve_page(page_part, site)

        if url
          anchor = anchor_part ? "##{slugify_anchor(anchor_part)}" : ""
          "<a href=\"#{url}#{anchor}\">#{display}</a>"
        elsif page_part.empty? && anchor_part
          # Self-referencing anchor like [[#Section]]
          "<a href=\"##{slugify_anchor(anchor_part)}\">#{display}</a>"
        else
          # Can't resolve - leave as text
          display
        end
      end
    end

    def resolve_page(name, site)
      return nil if name.nil? || name.empty?

      # Direct lookup by basename
      return @page_map[name] if @page_map.key?(name)

      # Try case-insensitive match
      @page_map.each do |basename, url|
        return url if basename.downcase == name.downcase
      end

      # Try matching just the last component (for links like
      # "Projekt Nigredo (Nazi-Tyskland)" matching a file in a subdirectory)
      @page_map.each do |basename, url|
        return url if basename.start_with?(name) || name.start_with?(basename)
      end

      nil
    end

    def slugify_anchor(text)
      text
        .downcase
        .gsub(/[^\w\s\-åäöÅÄÖéèêëüû]/, "")
        .gsub(/\s+/, "-")
        .gsub(/-+/, "-")
        .gsub(/\A-|-\z/, "")
    end
  end
end
