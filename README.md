# Artist Signal — A&R Intelligence Platform

A signal scoring and discovery platform for music publishers. Built for Universal Music Asia Publishing Division.

## What it does

- **Discovery feed** — ranked artist cards with signal scores, retrospective validation data, and velocity indicators
- **Artist profiles** — full 14-factor breakdown, streaming velocity charts, green lights, risk flags, and validation outcomes
- **Add artist** — type any artist name for an AI-generated signal assessment using publicly available data
- **A&R memo generation** — one-click professional memos generated live by Claude, ready to send to the Head of Publishing

## Tech stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- Anthropic Claude API (server-side, key never exposed to client)

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/artist-signal.git
cd artist-signal
npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace `your_api_key_here` with your key from [console.anthropic.com](https://console.anthropic.com).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npx vercel
```

Follow the prompts. When asked about environment variables, add `ANTHROPIC_API_KEY`.

### Option B — Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy**

Your app will be live at `https://artist-signal.vercel.app` (or your custom domain).

---

## Adding more artists

Edit `lib/artists.ts`. Each artist follows the `Artist` type defined in `lib/types.ts`. Add a new object to the `ARTISTS` array. The feed and routing update automatically.

## Customising the scoring model

Factor weights and thresholds are in `lib/types.ts`. The verdict classification thresholds (75 = Priority Sign, 55 = Development Deal, 35 = Watch & Wait) can be adjusted in `lib/artists.ts` inside `getVerdictColors`.

---

Built with [Claude](https://claude.ai) · [Anthropic](https://anthropic.com)
