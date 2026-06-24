// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/util/path.ts
function pathToRoot(slug) {
  let rootPath = slug.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_2) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}

// src/i18n/locales/en-US.ts
var en_US_default = {
  propertyDefaults: {
    title: "Untitled"
  }
};

// src/i18n/index.ts
var __svSEPatch = {"propertyDefaults":{"title":"Namnlös","description":"Ingen beskrivning angiven"},"components":{"callout":{"note":"Notis","abstract":"Sammanfattning","info":"Info","todo":"Att göra","tip":"Tips","success":"Klart","question":"Fråga","warning":"Varning","failure":"Misslyckat","danger":"Fara","bug":"Bugg","example":"Exempel","quote":"Citat"},"backlinks":{"title":"Bakåtlänkar","noBacklinksFound":"Inga bakåtlänkar hittades"},"themeToggle":{"lightMode":"Ljust läge","darkMode":"Mörkt läge"},"readerMode":{"title":"Läsläge"},"explorer":{"title":"Utforskare"},"footer":{"createdWith":"Skapad med"},"graph":{"title":"Grafvy"},"recentNotes":{"title":"Senaste sidorna","seeRemainingMore":({ remaining }) => `Se ${remaining} till →`},"transcludes":{"transcludeOf":({ targetSlug }) => `Transklusion av ${targetSlug}`,"linkToOriginal":"Länk till originalet"},"search":{"title":"Sök","searchBarPlaceholder":"Sök efter något"},"tableOfContents":{"title":"Innehållsförteckning"},"contentMeta":{"readingTime":({ minutes }) => `${minutes} min läsning`}},"pages":{"rss":{"recentNotes":"Senaste sidorna","lastFewNotes":({ count }) => `Senaste ${count} sidorna`},"error":{"title":"Hittades inte","notFound":"Antingen är sidan privat eller så finns den inte.","home":"Tillbaka till startsidan"},"folderContent":{"folder":"Mapp","itemsUnderFolder":({ count }) =>
        count === 1 ? "1 sida i den här mappen." : `${count} sidor i den här mappen.`},"tagContent":{"tag":"Tagg","tagIndex":"Taggregister","itemsUnderTag":({ count }) =>
        count === 1 ? "1 sida med den här taggen." : `${count} sidor med den här taggen.`,"showingFirst":({ count }) => `Visar de första ${count} taggarna.`,"totalTags":({ count }) => `Hittade totalt ${count} taggar.`}}};
function __svSEMerge(base, over) {
  if (over === null || typeof over !== "object") return over;
  if (base === null || typeof base !== "object") return over;
  var out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
  for (var __k of Object.keys(over)) out[__k] = __svSEMerge(base[__k], over[__k]);
  return out;
}
var locales = {
  "sv-SE": __svSEMerge(en_US_default, __svSEPatch),
  "en-US": en_US_default
};
function i18n(locale) {
  return locales[locale] || en_US_default;
}
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/PageTitle.tsx
var PageTitle = ({ fileData, cfg, displayClass }) => {
  const locale = cfg?.locale ?? "en-US";
  const title = cfg?.pageTitle ?? i18n(locale).propertyDefaults.title;
  const baseDir = pathToRoot(fileData.slug);
  return /* @__PURE__ */ u2("h2", { class: classNames(displayClass, "page-title"), children: /* @__PURE__ */ u2("a", { href: baseDir, children: title }) });
};
PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
`;
var PageTitle_default = (() => PageTitle);

export { PageTitle_default as PageTitle };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map