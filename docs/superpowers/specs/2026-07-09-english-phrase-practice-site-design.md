# English Phrase Practice Site Design

## Goal

Build a clean, focused English-learning website for practicing sentences, phrases, and word groups. The first version should feel like a practical study tool rather than a marketing page. It should work without a paid domain and be suitable for free GitHub Pages deployment.

## Confirmed Decisions

- Site type: static single-page website.
- Main experience: practice-first.
- Content focus: comprehensive, with built-in categories for practical basics, CET phrases, daily speaking, and writing expressions.
- First practice modes: sentence fill-in and phrase matching.
- Content source: built-in default content plus user-created content.
- User content management: add, edit, and delete custom entries.
- Progress persistence: browser `localStorage`.
- AI: not included in the first version.
- Visual style: white, clean, restrained, and focused.
- Deployment: GitHub Pages, no custom domain required.

## Information Architecture

The website is a single-page app with compact top navigation:

- `Practice`: default screen. Users immediately start sentence fill-in or phrase matching.
- `Library`: browse built-in and custom sentences or phrases.
- `Add`: add, edit, or delete custom learning items.
- `Progress`: view local study progress.

The site should open directly into practice. It should not use a landing page, hero marketing section, or promotional copy as the first screen.

## Practice Flow

### Sentence Fill-In

The user sees one English sentence with a blank and several phrase options. After choosing an answer and submitting, the site shows:

- whether the answer is correct,
- the correct phrase,
- the Chinese meaning,
- the full example sentence,
- a concise explanation.

The user can then move to the next item.

### Phrase Matching

The user sees English phrases in one column and Chinese meanings in another column. The user selects pairs. The site marks matched pairs and records correct or incorrect attempts.

The matching interaction should be simple and click-based. Drag-and-drop is not required for the first version because it adds mobile and accessibility complexity.

## Content Model

Each learning item should include:

- `id`
- `phrase`
- `meaningZh`
- `example`
- `exampleZh`
- `category`
- `difficulty`
- `source`

Categories for built-in content:

- `Basic`
- `CET`
- `Speaking`
- `Writing`
- `Daily`

Difficulties:

- `Basic`
- `Intermediate`

The first version should include enough built-in content for immediate use. User-created content is stored separately in `localStorage` and merged with built-in content for Library and Practice views.

## User Content Management

The `Add` screen provides a compact form for:

- English phrase,
- Chinese meaning,
- English example sentence,
- Chinese example meaning,
- category,
- difficulty.

Below the form, the user can see custom entries and edit or delete them. Built-in entries are read-only.

Validation should be simple:

- required fields cannot be empty,
- phrase and example should trim whitespace,
- duplicate custom phrases should be allowed only if the example sentence differs.

## Progress Model

Progress is stored locally in `localStorage`. The first version records:

- total practice attempts,
- correct attempts,
- sentence fill-in attempts,
- phrase matching attempts,
- per-item correct count,
- per-item incorrect count,
- recently practiced item ids,
- custom item count.

The `Progress` screen shows:

- total attempts,
- accuracy,
- practiced items,
- custom content count,
- recent practice list.

If local storage is unavailable or corrupted, the app should fall back to an empty progress state and show a small, non-blocking message.

## Visual Design

The chosen style is white and focused:

- white background,
- black and gray text,
- restrained neutral borders,
- cards with 8px radius or less,
- no large gradients,
- no decorative blobs,
- no busy illustrations,
- no marketing-style hero section.

The interface should prioritize the current exercise. Secondary information such as progress and content metadata should be available but visually quieter.

## Responsive Behavior

Desktop:

- top navigation stays horizontal,
- practice area can use a two-column layout where useful,
- Library and Add screens can use compact panels.

Mobile:

- all main content becomes single-column,
- navigation becomes compact top tabs,
- answer buttons remain large enough to tap comfortably,
- text must wrap cleanly and not overflow buttons or cards.

## Technical Design

Recommended stack:

- Vite
- React
- TypeScript
- Vitest

The app has no backend and no database. Built-in content lives in local TypeScript or JSON data files. User content and progress live in `localStorage`.

Suggested module boundaries:

- content data: built-in phrase and sentence items,
- storage utilities: read/write custom items and progress,
- practice logic: answer checking, matching validation, next-item selection,
- UI components: navigation, practice panels, library, add/edit form, progress summary.

## Error Handling

The first version should handle:

- empty custom form fields,
- invalid localStorage JSON,
- unavailable localStorage,
- no available practice items after filtering.

Errors should be shown as small inline messages. They should not block the whole site unless the current action cannot continue.

## Testing Plan

Automated tests should cover:

- sentence fill-in answer checking,
- phrase matching validation,
- progress updates after correct and incorrect answers,
- localStorage read/write behavior,
- custom item add/edit/delete logic.

Manual checks should cover:

- desktop layout,
- mobile layout,
- GitHub Pages build path,
- first-load experience with empty localStorage,
- behavior after adding custom content.

## Out of Scope for Version 1

- AI generation or AI explanations.
- Login or cloud sync.
- Backend services.
- Import and export.
- Paid domain setup.
- Complex spaced repetition scheduling.
- Drag-and-drop matching.

## Success Criteria

The first version is successful if a user can open the website, immediately practice sentence fill-in and phrase matching, add their own phrases, see local progress, and use the site through a free GitHub Pages URL without needing a backend or paid domain.
