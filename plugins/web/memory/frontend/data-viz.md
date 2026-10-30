---
kind: knowledge
when-and-why-to-read: When a page, dashboard or app shows charts, figures or tables of data, this knowledge should be read because the default (a chart library's styling, a rainbow palette, a row of gauges and donuts) reads as generated and often misleads, while picking the form from the data and drawing it plainly does neither.
short-form: "Data viz: pick the form from the data (one value is a figure, many categories a table, parts of a whole a stacked bar, never pie/donut/gauge); hand-written SVG with thin bars, 2px lines, 3–5 solid gridlines, one y-axis; one accent series, others a lightness ramp or muted; text never in the data colour; tabular numerals; bars from zero; no invented data; a dashboard is one figure, one chart, one table."
rationale: >-
  Adapted from Hallmark's data-viz reference (github.com/Nutlope/hallmark, MIT). The rule against invented figures and the visible-slot pattern live in [[web/frontend/visual-design]]; accent and contrast rules in [[web/frontend/visual-craft]]; the dark-mode colour derivation in [[web/frontend/dark-mode]]; dashboard and app structure in [[web/frontend/interface-design]]. This document owns choosing a chart's form, drawing it, colouring it, and keeping it honest.
---

# Data visualisation

Data should look typeset, not generated: a table as the backbone, hairline grids, one series that makes the point, and no decorative dashboard (no wall of donuts, row of gauges, or scatter of KPI tiles).

## Pick the form before drawing

| The data is | The form is |
|---|---|
| one value | a large figure with a short worded qualifier ("412 orders this week, up from 380"), never a one-bar chart |
| two to five values compared | a row of figures, or horizontal bars |
| a series over time | a line, or a sparkline when it sits inside another component |
| more than about seven categories | a table; more colours is not an answer |
| parts of a whole | one stacked horizontal bar; never a pie, a donut or a gauge |

The most underused form is emphasis: one series in the accent, everything else neutral. If every series is loud, none is.

## Drawing it

Write the chart as inline SVG for this data rather than reaching for a chart library's default look. If a library is already in the project, restyle it to these rules.

- **Bars:** 24px thick or less, 2–4px apart, the baseline always at zero; rounded only at the data end, 2px radius at most.
- **Lines:** 2px stroke. Point markers (6px or larger) only on points you annotate. A sparkline may fill below its line with a fade to transparent; that is the only gradient allowed near a chart.
- **Gridlines:** 1px solid in the border colour, never dashed, and fewer than you think: three to five horizontal lines. The axis line can be the grid's first line rather than a heavier stroke.
- **One y-axis.** Never two y-axes on one chart; it is the classic way to fake a correlation. Two series in different units get two small charts side by side.
- **No shadows, no 3D, no gradients** on bars, lines or areas (the sparkline fade excepted).
- **Sparklines inside a component:** no axes, no grid, no second colour.

## Colour

A chart follows the page's one-accent colour plan; an eight-hue categorical palette would fight everything else on the page.

- **One series:** the accent.
- **Several series:** steps of lightness on the accent hue (each about 12–15% L apart in OKLCH, chroma held constant), assigned in a fixed order and never cycled. Reference or context series (last year, the target, the average) use the muted text colour.
- **A second hue** only when the page's colour plan already declares a second accent, and only that one; never a colour invented for the chart.
- **Text never takes the data colour.** Labels, values and axis text use the body or muted text colour. Identify a series with a small colour swatch beside its label, not by colouring the words.
- **Tabular numerals** (`font-variant-numeric: tabular-nums`) on every number: values, axes, tables, large figures.

## Honesty

- Use real numbers. Where a figure is missing, show a visible slot as described in [[web/frontend/visual-design]]; an invented series is worse than an empty slot.
- Bars start at zero. A truncated axis that exaggerates a difference is the numeric version of an invented metric. When the data really sits in a narrow band and a zoomed view is needed, say so on the chart ("axis starts at 94%").
- Sample data belongs only inside a built product sample or a code example. It must read as a sample (totals add up, dates run in order, round values) and must never be a figure a visitor could take as a claim about the business.

## Dark mode

Chart colours re-derive like the accent (chroma down, lightness up), as set out in [[web/frontend/dark-mode]]; gridlines use the dark-mode border colour; a sparkline's fade fill drops to half its light-mode opacity.

## Dashboards

A dashboard shows fewer, truer figures: one main figure, one supporting chart, one table. A wall of six gauges and a dozen KPI tiles is the thing to avoid. This applies to app dashboards as much as to marketing pages; for how a dashboard's layout, hierarchy and monitoring views are designed, see [[web/frontend/interface-design]].
