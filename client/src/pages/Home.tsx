import { useMemo, useState } from "react";
import { ArrowUp, ArrowUpRight, Globe, ListFilter, Search } from "lucide-react";
import { directoryData } from "@/data/institutions";

/* Design philosophy: editorial cartography with calmer continent-led browsing, alphabetized continent lists, and high-density research scanning. */

type Institution = (typeof directoryData.institutions)[number];

const filterImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663407421710/Kg3xCvPfax8moQF6qXU2Wa/atlas-filter-panel-UJj7hTR4t944KCjWwrtQ7K.webp";
const bannerImage =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663407421710/Kg3xCvPfax8moQF6qXU2Wa/atlas-continent-banner-gcabfkrbJJsuXmz7iFdubR.webp";
const institutions = [...directoryData.institutions].sort((a, b) => a.institutionName.localeCompare(b.institutionName));
const continentOrder = directoryData.meta.continents;
const continentMeta = directoryData.continentMeta;

function getUniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function includesNormalized(source: string, target: string) {
  return source.toLowerCase().includes(target.trim().toLowerCase());
}

function buildSearchCorpus(item: Institution) {
  return [
    item.institutionName,
    item.parentInstitution,
    item.country,
    item.continent,
    item.nameLanguageGroup,
    item.primaryTheme,
    item.secondaryThemes,
    item.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getPrimaryThemeLabel(item: Institution) {
  return item.primaryTheme || "Unclassified";
}

function getSecondaryThemePreview(item: Institution) {
  if (item.secondaryThemesList.length === 0) {
    return ["No secondary theme listed"];
  }

  return item.secondaryThemesList.slice(0, 2);
}

function Home() {
  const [query, setQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedPrimaryTheme, setSelectedPrimaryTheme] = useState("All");
  const [selectedSecondaryTheme, setSelectedSecondaryTheme] = useState("All");
  const [selectedLanguageGroup, setSelectedLanguageGroup] = useState("All");
  const [selectedParentInstitution, setSelectedParentInstitution] = useState("All");
  const [showOnlyLandFocused, setShowOnlyLandFocused] = useState(false);

  const countries = useMemo(() => getUniqueValues(institutions.map((item) => item.country)), []);
  const primaryThemes = useMemo(
    () => getUniqueValues(institutions.map((item) => getPrimaryThemeLabel(item))),
    []
  );
  const secondaryThemes = useMemo(
    () => getUniqueValues(institutions.flatMap((item) => item.secondaryThemesList).filter(Boolean)),
    []
  );
  const languageGroups = useMemo(() => getUniqueValues(institutions.map((item) => item.nameLanguageGroup)), []);
  const parentInstitutions = useMemo(
    () => getUniqueValues(institutions.map((item) => item.parentInstitution)),
    []
  );

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((item) => {
      const matchesQuery = !query || includesNormalized(buildSearchCorpus(item), query);
      const matchesContinent = selectedContinent === "All" || item.continent === selectedContinent;
      const matchesCountry = selectedCountry === "All" || item.country === selectedCountry;
      const matchesPrimaryTheme =
        selectedPrimaryTheme === "All" || getPrimaryThemeLabel(item) === selectedPrimaryTheme;
      const matchesSecondaryTheme =
        selectedSecondaryTheme === "All" || item.secondaryThemesList.some((themeName) => themeName === selectedSecondaryTheme);
      const matchesLanguageGroup =
        selectedLanguageGroup === "All" || item.nameLanguageGroup === selectedLanguageGroup;
      const matchesParentInstitution =
        selectedParentInstitution === "All" || item.parentInstitution === selectedParentInstitution;
      const matchesLandFocus =
        !showOnlyLandFocused ||
        /land|environment|territor|ecolog|water|climate|resource|forest|earth|marine|conservation/i.test(
          `${item.primaryTheme} ${item.secondaryThemes} ${item.description}`
        );

      return (
        matchesQuery &&
        matchesContinent &&
        matchesCountry &&
        matchesPrimaryTheme &&
        matchesSecondaryTheme &&
        matchesLanguageGroup &&
        matchesParentInstitution &&
        matchesLandFocus
      );
    });
  }, [
    query,
    selectedContinent,
    selectedCountry,
    selectedPrimaryTheme,
    selectedSecondaryTheme,
    selectedLanguageGroup,
    selectedParentInstitution,
    showOnlyLandFocused,
  ]);

  const groupedResults = useMemo(() => {
    return continentOrder
      .map((continent) => {
        const items = filteredInstitutions
          .filter((item) => item.continent === continent)
          .sort((a, b) => a.institutionName.localeCompare(b.institutionName));

        return {
          continent,
          meta: continentMeta[continent],
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [filteredInstitutions]);

  const resetFilters = () => {
    setQuery("");
    setSelectedContinent("All");
    setSelectedCountry("All");
    setSelectedPrimaryTheme("All");
    setSelectedSecondaryTheme("All");
    setSelectedLanguageGroup("All");
    setSelectedParentInstitution("All");
    setShowOnlyLandFocused(false);
  };

  return (
    <div className="atlas-shell min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="container flex flex-col gap-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="atlas-eyebrow">Global Indigenous Research Directory</div>
            <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl lg:text-[3.2rem] lg:leading-[1.05]">
              A calmer HTML atlas for browsing Indigenous research by continent, then name.
            </h1>
          </div>
        </div>
      </header>

      <main>
        <section className="container py-8 lg:py-10">
          <div
            className="atlas-panel relative overflow-hidden rounded-[2rem] border border-border/60 p-5 sm:p-6 lg:p-7"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(248,245,239,0.92), rgba(248,245,239,0.96)), url(${filterImage})`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-[linear-gradient(180deg,rgba(18,22,20,0.92),rgba(18,22,20,0.96))]" />
            <div className="relative space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="atlas-eyebrow">Browse by continent, then name</div>
                  <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-[2.3rem]">
                    A quieter, more intuitive way to scan the directory.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Search, continent, and a single theme lens still do the primary work, but each continent now resolves
                    into one alphabetized list so institutions are easier to find quickly.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" className="atlas-ghost-button" onClick={resetFilters}>
                    Reset refinements
                  </button>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_22rem]">
                <div className="space-y-5">
                  <label className="block">
                    <span className="atlas-label">Keyword search</span>
                    <div className="atlas-input-shell mt-2">
                      <Search size={16} className="text-muted-foreground" />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search names, themes, continents, countries, or descriptions"
                        className="atlas-input"
                      />
                    </div>
                  </label>

                  <div>
                    <div className="atlas-label">Continent focus</div>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedContinent("All")}
                        className="atlas-chip"
                        style={{
                          borderColor: selectedContinent === "All" ? "#41534d" : "rgba(84,96,90,0.16)",
                          backgroundColor: selectedContinent === "All" ? "#41534d" : "rgba(255,252,247,0.74)",
                          color: selectedContinent === "All" ? "#f8f5ef" : "#1f2724",
                        }}
                      >
                        All continents
                      </button>
                      {continentOrder.map((continent) => (
                        <button
                          key={continent}
                          type="button"
                          onClick={() => setSelectedContinent(continent)}
                          className="atlas-chip"
                          style={{
                            borderColor: continentMeta[continent].color,
                            backgroundColor:
                              selectedContinent === continent
                                ? continentMeta[continent].color
                                : continentMeta[continent].accent,
                            color: selectedContinent === continent ? "#f8f5ef" : "#1f2724",
                          }}
                        >
                          {continentMeta[continent].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <label>
                    <span className="atlas-label">Theme lens</span>
                    <select
                      value={selectedPrimaryTheme}
                      onChange={(event) => setSelectedPrimaryTheme(event.target.value)}
                      className="atlas-select mt-2"
                    >
                      <option value="All">All primary themes</option>
                      {primaryThemes.map((themeName) => (
                        <option key={themeName} value={themeName}>
                          {themeName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex items-start gap-3 rounded-[1.25rem] border border-border/60 bg-background/78 px-4 py-4 dark:bg-card/72">
                    <input
                      type="checkbox"
                      checked={showOnlyLandFocused}
                      onChange={(event) => setShowOnlyLandFocused(event.target.checked)}
                      className="mt-1 h-4 w-4 accent-[var(--atlas-green)]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-foreground">Land and environment emphasis</span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        Surface institutions with ecological, territorial, water, land-based, or environmental signals.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <details className="rounded-[1.5rem] border border-border/60 bg-background/72 p-4 dark:bg-card/72">
                <summary className="atlas-summary-toggle flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ListFilter size={16} />
                    Optional research refinements
                  </div>
                  <div className="atlas-badge">Country, affiliation, language, secondary theme</div>
                </summary>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label>
                    <span className="atlas-label">Country focus</span>
                    <select
                      value={selectedCountry}
                      onChange={(event) => setSelectedCountry(event.target.value)}
                      className="atlas-select mt-2"
                    >
                      <option value="All">No country filter</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="atlas-label">Secondary theme</span>
                    <select
                      value={selectedSecondaryTheme}
                      onChange={(event) => setSelectedSecondaryTheme(event.target.value)}
                      className="atlas-select mt-2"
                    >
                      <option value="All">All secondary themes</option>
                      {secondaryThemes.map((themeName) => (
                        <option key={themeName} value={themeName}>
                          {themeName}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="atlas-label">Name language group</span>
                    <select
                      value={selectedLanguageGroup}
                      onChange={(event) => setSelectedLanguageGroup(event.target.value)}
                      className="atlas-select mt-2"
                    >
                      <option value="All">All language groups</option>
                      {languageGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span className="atlas-label">Parent institution</span>
                    <select
                      value={selectedParentInstitution}
                      onChange={(event) => setSelectedParentInstitution(event.target.value)}
                      className="atlas-select mt-2"
                    >
                      <option value="All">All parent institutions</option>
                      {parentInstitutions.map((institution) => (
                        <option key={institution} value={institution}>
                          {institution}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </details>
            </div>
          </div>
        </section>

        <section className="container pb-14">
          {groupedResults.length === 0 ? (
            <div className="atlas-panel rounded-[2rem] border border-border/60 p-8 text-center sm:p-10">
              <div className="font-display text-3xl tracking-tight">No institutions match the current refinements.</div>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Try widening the continent or theme lens, or clear the optional refinements to return to the full atlas.
              </p>
              <div className="mt-6 flex justify-center">
                <button type="button" className="atlas-solid-button" onClick={resetFilters}>
                  Reset refinements
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedResults.map((group) => (
                <section
                  key={group.continent}
                  className="atlas-panel overflow-hidden rounded-[2rem] border border-border/60"
                >
                  <div className="border-b border-border/60 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                      <div className="max-w-3xl">
                        <span
                          className="atlas-continent-pill"
                          style={{
                            backgroundColor: group.meta.accent,
                            color: group.meta.color,
                          }}
                        >
                          {group.meta.label}
                        </span>
                        <h3 className="mt-3 font-display text-[1.7rem] tracking-tight sm:text-[2rem]">
                          {group.items.length} institutions in {group.continent}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
                          {group.meta.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="atlas-meta-chip">Alphabetized by institution name</span>
                        {selectedPrimaryTheme !== "All" ? (
                          <span className="atlas-meta-chip">Theme lens: {selectedPrimaryTheme}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="hidden gap-3 border-b border-border/60 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground md:grid md:grid-cols-[minmax(0,1.9fr)_minmax(0,1.05fr)_minmax(0,1fr)_auto] sm:px-4">
                      <div>Institution</div>
                      <div>Location and affiliation</div>
                      <div>Themes</div>
                      <div>Link</div>
                    </div>

                    <div className="divide-y divide-border/60">
                      {group.items.map((item) => (
                        <article
                          key={item.id}
                          className="atlas-list-row grid gap-2 px-3 py-2.5 sm:px-4 md:grid-cols-[minmax(0,1.9fr)_minmax(0,1.05fr)_minmax(0,1fr)_auto] md:items-center"
                          style={{ borderLeftColor: group.meta.color }}
                        >
                          <div className="min-w-0">
                            <h4 className="font-display text-[1.02rem] leading-tight tracking-tight text-foreground sm:text-[1.1rem]">
                              {item.institutionName}
                            </h4>
                            <p className="atlas-line-clamp-1 mt-0.5 text-[0.82rem] leading-5 text-muted-foreground">
                              {item.description}
                            </p>
                          </div>

                          <div className="min-w-0 space-y-0.5 text-[0.82rem] leading-5">
                            <div className="font-medium text-foreground">{item.country}</div>
                            <div className="atlas-line-clamp-1 text-muted-foreground">{item.parentInstitution}</div>
                            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              {item.nameLanguageGroup}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            <span className="atlas-theme-chip atlas-theme-chip-primary">{getPrimaryThemeLabel(item)}</span>
                            {getSecondaryThemePreview(item).map((themeName) => (
                              <span key={`${item.id}-${themeName}`} className="atlas-meta-chip">
                                {themeName}
                              </span>
                            ))}
                          </div>

                          <div className="flex md:justify-end">
                            {item.website ? (
                              <a
                                href={item.website}
                                target="_blank"
                                rel="noreferrer"
                                className="atlas-link-button"
                              >
                                <Globe size={14} />
                                Open
                                <ArrowUpRight size={14} />
                              </a>
                            ) : (
                              <span className="atlas-badge">No link</span>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>

      <button
        type="button"
        aria-label="Return to top"
        title="Return to top"
        className="atlas-icon-button fixed bottom-5 right-5 z-50 h-11 w-11 rounded-full border border-border/70 bg-background/92 text-foreground shadow-[0_18px_35px_rgba(36,48,43,0.16)] backdrop-blur-xl sm:bottom-6 sm:right-6"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-4 w-4" />
        <span className="sr-only">Return to top</span>
      </button>
    </div>
  );
}

export default Home;
