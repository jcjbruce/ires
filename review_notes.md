# Browser Review Notes

## Initial preview findings

The live preview loads successfully at the project URL and presents the intended **editorial cartography / research atlas** design. The hero section shows the atlas-style background artwork with dark text on a light image, which preserves readable contrast. The header includes a survey overview action and a visible theme toggle.

The page exposes the expected filter controls in the first viewport, including keyword search, continent, country, primary theme, secondary theme, name language group, parent institution, and the environmental/land emphasis checkbox. The results count and continent cards are visible immediately, supporting fast scanning.

The screenshot suggests one layout issue to keep watching: the browser viewport includes a Manus preview overlay message near the lower center, so subsequent checks should focus on whether the site content itself remains readable and whether interactions still update the results correctly.

## Interaction test: continent filter

Selecting the **Africa** continent chip worked as intended. The active filter count changed from 0 to 1, the result summary updated from 193 institutions to 13 institutions, and the continent overview cards collapsed the other continents to zero while preserving Africa at 13. This confirms that the primary continent filtering logic is functioning in the browser preview.

## Interaction test: compact view

Switching from card view to **compact view** worked correctly. The control changed to "Switch to card view," and the Africa results re-rendered into a denser tabular layout with institution, country/parent, themes, and link columns. This confirms that the alternate presentation mode is wired to the same filtered dataset and remains readable in the live preview.

## Interaction test: theme toggle

The light/dark mode control works in the live preview. After toggling to dark mode, the atlas-style layout retained strong contrast: headings remained readable against the darker hero treatment, the continent chips stayed legible, and the filter rail continued to read clearly. The selected Africa filter and compact view state both persisted through the theme change.

## Dense list refinement verification — 2026-04-09

The homepage now opens in **List** mode by default, and the results summary explicitly explains that the directory has shifted to a denser research-list presentation. In-browser inspection confirms that each continent section now uses a columned list-row layout with institution, location and affiliation, thematic profile, and link arranged on fewer lines.

The Africa section shows multiple rows within a single viewport area where the earlier design emphasized larger card blocks, which improves scan-ability while retaining the atlas styling and continent color accents. The filter rail, continent overview cards, and theme toggle all remain visible and readable alongside the denser results layout.
