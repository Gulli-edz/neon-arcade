# Neon Arcade — Virtual Coins Gaming Platform

A full-stack browser gaming platform using **only fictional, non-redeemable Coins**.

## Safety / economy rules

- Coins have no monetary or real-world value.
- No deposits, purchases, withdrawals, crypto, wallets, payment providers, prizes, or cash-out to real value.
- New users start with 10,000 Coins.
- Daily bonus is free virtual currency only.
- All game results are generated/validated on the server.
- The UI permanently labels Coins as virtual-only.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + SQLite (`better-sqlite3`)
- Styling: custom responsive CSS
- Charts: Recharts
- Animations: Framer Motion
- Icons: Lucide React

## Local start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open:
- Frontend: http://localhost:5173
- API: http://localhost:4000

For a production build:

```bash
npm run build
npm start
```

The SQLite database is created automatically at `server/data/arcade.sqlite`.

## Demo authentication

This build uses a lightweight username-based session for local/demo use. It is deliberately not an email/password or payment identity system.

## Project structure

```text
virtual-arcade-casino/
  client/
    src/
      components/
      games/
      hooks/
      pages/
      services/
      types/
      App.tsx
      main.tsx
      styles.css
  server/
    src/
      db.ts
      gameEngine.ts
      index.ts
      types.ts
  package.json
```

## Game engine

The server owns:
- current balance
- wager validation
- random outcomes
- payout calculation
- XP
- round history
- streaks
- aggregate statistics
- achievements
- daily bonus claim

The client never directly edits the user's Coin balance.

## Included playable games

Roulette, Blackjack, Slots, Crash, Coin Flip, Dice, Plinko, Wheel, Higher or Lower, Mines, Keno, Hi-Lo, Towers, Memory, Reaction, Lucky Cards, Number Guess, and Color Match.

The games are intentionally presented as arcade simulations rather than real gambling products.
