// Swedish (sv-SE) translations injected into community plugins at install time.
//
// Why this file exists:
//   The quartz-community plugins each bundle their OWN copy of the i18n
//   translations, and none of them ship sv-SE. Their lookup is
//   `locales[locale] || en_US_default`, so with `locale: sv-SE` every plugin
//   silently falls back to English. The host repo already has a complete
//   Swedish translation in quartz/i18n/locales/sv-SE.ts, but the plugins do
//   not use it — they only read their own bundle.
//
//   `quartz/cli/patch-plugin-locales.mjs` serializes this object into each
//   plugin's built `locales` map under the "sv-SE" key after every install.
//   Keep this in sync with quartz/i18n/locales/sv-SE.ts.
//
// This must stay plain ESM (no TypeScript): the `quartz plugin install` CLI
// runs under plain Node, not tsx, so it cannot import a .ts file.

export default {
  propertyDefaults: {
    title: "Namnlös",
    description: "Ingen beskrivning angiven",
  },
  components: {
    callout: {
      note: "Notis",
      abstract: "Sammanfattning",
      info: "Info",
      todo: "Att göra",
      tip: "Tips",
      success: "Klart",
      question: "Fråga",
      warning: "Varning",
      failure: "Misslyckat",
      danger: "Fara",
      bug: "Bugg",
      example: "Exempel",
      quote: "Citat",
    },
    backlinks: {
      title: "Bakåtlänkar",
      noBacklinksFound: "Inga bakåtlänkar hittades",
    },
    themeToggle: {
      lightMode: "Ljust läge",
      darkMode: "Mörkt läge",
    },
    readerMode: {
      title: "Läsläge",
    },
    explorer: {
      title: "Utforskare",
    },
    footer: {
      createdWith: "Skapad med",
    },
    graph: {
      title: "Grafvy",
    },
    recentNotes: {
      title: "Senaste sidorna",
      seeRemainingMore: ({ remaining }) => `Se ${remaining} till →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Transklusion av ${targetSlug}`,
      linkToOriginal: "Länk till originalet",
    },
    search: {
      title: "Sök",
      searchBarPlaceholder: "Sök efter något",
    },
    tableOfContents: {
      title: "Innehållsförteckning",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} min läsning`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Senaste sidorna",
      lastFewNotes: ({ count }) => `Senaste ${count} sidorna`,
    },
    error: {
      title: "Hittades inte",
      notFound: "Antingen är sidan privat eller så finns den inte.",
      home: "Tillbaka till startsidan",
    },
    folderContent: {
      folder: "Mapp",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 sida i den här mappen." : `${count} sidor i den här mappen.`,
    },
    tagContent: {
      tag: "Tagg",
      tagIndex: "Taggregister",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 sida med den här taggen." : `${count} sidor med den här taggen.`,
      showingFirst: ({ count }) => `Visar de första ${count} taggarna.`,
      totalTags: ({ count }) => `Hittade totalt ${count} taggar.`,
    },
  },
}
