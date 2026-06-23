import { Translation } from "./definition"

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
} as const satisfies Translation
