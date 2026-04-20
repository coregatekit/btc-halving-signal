# ₿TC Halving Signals

A real-time Bitcoin halving countdown and Buy/Sell signal tracker built with SvelteKit.

## What It Does

This app helps you identify optimal **Buy** and **Sell** windows around Bitcoin halving events by:

- Fetching the **current block height** live from [mempool.space](https://mempool.space)
- Estimating the **next halving date** based on average 10-minute block times
- Calculating a **Buy zone** — a configurable number of days *before* the halving to accumulate
- Calculating a **Sell zone** — a configurable number of days *after* the halving to take profit
- Displaying a **real-time countdown** (days, hours, minutes, seconds) for each signal
- Showing a prominent **Active Signal banner** when a Buy or Sell window is currently open

## Features

- 🟢 **BUY Signal** — countdown to the end of the accumulation window (halving)
- 🟠 **HALVING Event** — countdown to the Bitcoin block reward halving
- 🔴 **SELL Signal** — countdown to the end of the take-profit window
- ⚙️ **Adjustable strategy parameters** — set how many days before/after halving via interactive sliders
- 📊 **Cycle timeline** — visual timeline from buy date through halving to sell date
- 📜 **Halving history** — past halvings with block numbers, dates, and block rewards
- 🔮 **Next cycle preview** — estimated buy/sell dates for the following halving cycle
- ⚡ **Live block data** — refresh block height from [mempool.space](https://mempool.space) at any time

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) with Svelte 5 runes
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [mempool.space API](https://mempool.space/docs/api) for live Bitcoin block height (no API key required)
- TypeScript throughout

## Getting Started

```sh
# Install dependencies
npm install

# Start the development server
npm run dev

# Open in browser
npm run dev -- --open
```

## Building

```sh
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

## Notes

> Halving dates are **estimates** based on an average 10-minute block time. Actual dates may differ.  
> This is **not financial advice** — always do your own research (DYOR).
