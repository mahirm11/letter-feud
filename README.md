# Letter Feud

A daily word game built on Reddit's Devvit platform, made for Reddit's "Games with a Hook" Hackathon.

## What it is

Each day, your subreddit gets 5 categories, each paired with its own letter. Players have 60 seconds to submit one answer per category — but here's the twist: instead of scoring for being clever or unique, you score by **matching what your community usually says**. The more common your answer, the more points you earn — think Family Feud's "survey says" logic, applied to a daily word puzzle.

Every new answer also gets added to that subreddit's living scoreboard, so the game's data organically reflects each community's own culture and inside jokes over time.

## Features

- **Daily puzzle**: 5 categories, 5 letters, one 60-second round per day
- **Community-driven scoring**: answers rank against a per-subreddit board of past submissions
- **Resume support**: close the tab mid-game and pick up right where you left off, timer included
- **Streak tracking**: rewards consecutive days played
- **Animated results reveal**: staggered per-category breakdown of rank and points earned

## How scoring works

1. Your answer is normalized (trimmed, lowercased, articles stripped) and checked against the category's required letter
2. If valid, it's ranked against that category's board of past answers, sorted by frequency
3. Points are awarded by rank — the more popular the answer, the higher the score
4. Brand-new answers earn a small participation credit and get added to the board, seeding future rounds

## Tech stack

- **[Devvit](https://developers.reddit.com/)** — Reddit's developer platform
- **React** + **TypeScript** — client UI
- **Vite** — build tooling
- **Hono** — server-side routing
- **Redis** — game state, scoring boards, streaks, and daily results
- **Tailwind CSS** — styling

## Getting started

npm create devvit@latest --template=react

Then run through the installation wizard to connect your Reddit account.

### Commands

- `npm run dev` — start a local development server, live on Reddit
- `npm run build` — build the client and server
- `npm run deploy` — upload a new version of the app
- `npm run launch` — publish the app for review
- `npm run login` — log the CLI into Reddit
- `npm run type-check` — type check, lint, and format

## Known limitations / roadmap

- No category-fit validation beyond the starting letter — an answer only needs to start with the right letter, not actually relate to the category. This mirrors a real limitation seen in established word-game apps in this genre.
- Daily puzzle content is currently hardcoded rather than dynamically rotated
- No decay-weighting on the board yet — older answers count the same as recent ones
- Planned: community-submitted categories, a visible leaderboard, and a "Trailblazer" bonus for early answers that later catch on

## License

[Add your chosen license here, e.g. MIT]