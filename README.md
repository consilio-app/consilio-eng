# Consilio — AI-Powered Prediction Markets

Prediction market trading interface powered by Polymarket API with built-in AI Agent.

## Features

- 📊 **Live Markets** — Real-time data from Polymarket API
- 🤖 **AI Agent** — Built-in AI analyst powered by Claude (analyzes markets, finds value bets, gives strategy tips)
- 💰 **Trading** — Buy Yes/No shares on any market
- 👛 **Wallet Connect** — Solana wallet integration (Phantom / Solflare)
- 🔍 **Search & Filter** — By category, keyword, volume, or newest
- 📱 **Responsive** — Works on desktop and mobile

## Deploy to Vercel (No Terminal Needed)

### Step 1 — Upload to GitHub

1. Go to **github.com** → click **"+"** → **New repository**
2. Name it `consilio` → click **Create repository**
3. Click **"uploading an existing file"**
4. **Unzip** this file on your computer
5. **Drag all files & folders** into the GitHub upload area
6. Click **"Commit changes"**

### Step 2 — Deploy on Vercel

1. Go to **vercel.com** → sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find `consilio` → click **"Import"**
4. Vercel auto-detects Vite — click **"Deploy"**
5. Done! Your site is live 🎉

### Step 3 — Enable AI Agent (Optional)

The AI Agent needs an Anthropic API key to work:

1. Get a key from **console.anthropic.com**
2. In Vercel: **Settings** → **Environment Variables**
3. Add: `ANTHROPIC_API_KEY` = `sk-ant-your-key-here`
4. **Redeploy** (Deployments tab → click "..." → Redeploy)

> Without the API key, everything works except the AI chat.

## Links

- Website: [consilio.vercel.app](https://consilio.vercel.app)
- Twitter: [@Consiliofun](https://x.com/Consiliofun)
- GitHub: [consilio-cli](https://github.com/consilio-cli)
- Buy Coin: [gmgn.ai](https://gmgn.ai)

## Tech Stack

- React 18 + Vite
- Polymarket Gamma API
- Anthropic Claude API (AI Agent)
- Vercel Serverless Functions
- Solana Web3 (Phantom/Solflare)

## License

MIT
