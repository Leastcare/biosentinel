# BioSentinel

BioSentinel is an evidence-linked ecosystem monitoring dashboard for protected areas. It presents environmental signals in a clear, decision-oriented interface, including vegetation health, climate stress, wildlife activity, and disturbance risk.

## Live Demo

[Open the BioSentinel dashboard](https://biosentinel-bice.vercel.app/)

## Source Code

[View the BioSentinel GitHub repository](https://github.com/Leastcare/biosentinel)

## Features

- Protected-area selection.
- Ecosystem health overview.
- Vegetation-health comparison against a baseline.
- Climate-stress status.
- Wildlife-activity proxy.
- Disturbance-risk monitoring.
- NASA FIRMS satellite thermal-alert integration.
- Evidence links for environmental signals.
- Responsive dark dashboard interface.
- Offline fallback when live FIRMS data is unavailable.

## Technology

- React
- TypeScript
- Vite
- CSS
- NASA FIRMS API
- GitHub
- Vercel

## Requirements

- Node.js 18 or newer.
- npm.
- A NASA FIRMS MAP_KEY for live satellite disturbance data.

## Installation

Clone the repository and enter the project folder:

```bash
git clone https://github.com/Leastcare/biosentinel.git
cd biosentinel
```

Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a file named `.env.local` in the project root:

```env
VITE_FIRMS_MAP_KEY=your_firms_map_key
```

Replace `your_firms_map_key` with your NASA FIRMS key.

Never commit `.env.local` or expose the API key publicly.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Production Build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

BioSentinel is deployed on Vercel through the GitHub repository.

1. Import the repository into Vercel.
2. Select the Vite framework preset.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Add `VITE_FIRMS_MAP_KEY` under Vercel Environment Variables.
6. Enable the variable for Production and Preview.
7. Deploy the project.

Future pushes to the connected `main` branch can trigger new Vercel deployments.

## Project Structure

```text
biosentinel/
├── public/
│   └── favicon.svg
├── src/
├── index.html
├── package.json
├── README.md
└── .gitignore
```

## Data Note

BioSentinel displays environmental indicators and satellite-derived signals as monitoring proxies. These signals support situational awareness and should not replace field surveys, official assessments, or expert ecological judgment.

## Security

Never commit secrets or credentials.

Keep these files out of Git:

```text
.env
.env.local
.env.*.local
```

## License

Add a license appropriate for your project if you plan to distribute the code publicly.