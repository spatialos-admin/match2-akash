# Match 2 — React memory game

A cozy little memory game powered by React + Vite. Flip two cards at a time, keep track of your moves, and try to beat your personal-best time.

## Features

- Fixed 5x4 grid (20 cards) with 10 matchable pairs — tweak the counts via `MATCHABLE_PAIR_TARGET` & `TOTAL_CARDS`
- Move counter, live timer, and persistent best-time tracking
- Visual win banner with quick restart
- Responsive layout that works on phones, tablets, and desktop

## Getting started

```bash
npm install
npm run dev
```

The dev server defaults to http://localhost:5173.

## Game rules

1. Click any card to reveal it.
2. Flip a second card — if they match, they stay face-up.
3. Non-matching cards flip back over automatically.
4. Clear all 10 pairs with as few moves (and as quickly) as possible.

Ready for a clean slate? Hit “New game” at any time. Your best run is saved locally so you can keep chasing a faster finish. Have fun!*** End Patch
