# Basic Python Programming — Teach & Practice

An animated, concept-by-concept teaching platform for the twelve-topic *Basic Python Programming*
module. Built for two audiences at once:

- **Educators** project it at the front of the room and advance one idea at a time.
- **Students** work through the same material afterwards and practise on questions that run
  real Python in the browser and mark themselves.

## What is in it

| | |
|---|---|
| Topics | 12 — from flowcharts to functions |
| Concepts | 53 — every topic broken into small teachable chunks |
| Teaching slides | 139 |
| Practice questions | 85 — multiple choice, predict-the-output, fill-the-blanks, write-the-code |
| Interactive animations | 19 purpose-built visualisers |

### Topic list

1. How a Python Program Runs
2. Flowcharts
3. My First Python Program — `print()`
4. Comments
5. Literals
6. Assigning Variables
7. Operators
8. Decision Making Statements
9. Data Types: List
10. Iteration: The `for` Loop
11. Iteration: The `while` Loop
12. Functions

## Teaching features

- **Presentation mode** — press `F` for full screen. Type scales up for the back of the room.
- **Keyboard driven** — `←` `→` or `Space` to move, `O` for the outline, `+` / `−` to resize.
- **Execution traces** — step through a program line by line while the variables panel and console
  update. Every step carries a note for the teacher to narrate.
- **Live flowcharts** — a token walks the chart as you explain each symbol, with the active branch
  highlighted.
- **Check-understanding slides** — every concept ends with a question to ask the room, with the
  answer hidden until you reveal it.
- **Teacher guide** at `/teach` — lesson plans, pacing, objectives and controls for every topic.

## Practice features

- Four question types, marked instantly with an explanation either way.
- Write-the-code questions run in a real CPython interpreter (Pyodide/WebAssembly) and are
  checked against the expected output, including `input()` handled from supplied test values.
- Progress is stored in `localStorage` — nothing is uploaded and no account is needed.
- A mixed-quiz mode draws ten unsolved questions from across the module.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build         # production build (.next)
npm run build:static  # static export to out/, for CDN-only hosts
npm run build:pages   # static export configured for GitHub Pages
npm run start         # serve the production build
npm run typecheck     # tsc --noEmit
```

## Deploying to Vercel

The project is a stock Next.js App Router app, so Vercel needs no configuration.

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import `basic-python-programming-repo`. If Vercel cannot see it, click
   **Adjust GitHub App Permissions** and grant access to the repo.
3. Vercel detects **Next.js** and fills in the build settings. Leave them alone:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`
4. No environment variables are required. Optionally add `NEXT_PUBLIC_SITE_URL`
   set to your final domain, so `sitemap.xml` and `robots.txt` carry absolute URLs.
5. Click **Deploy**. The first build takes roughly two minutes.

The repository's default branch is `claude/interactive-teaching-platform-j2oe9d`,
so Vercel will treat it as Production and redeploy on every push to it.

Every page is statically prerendered, so the site is served from the CDN edge and
comfortably fits the Vercel Hobby (free) tier.

### Deploying to GitHub Pages

A workflow is already committed at `.github/workflows/deploy-pages.yml`. To turn it on:

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to the default branch (or run the workflow manually from the **Actions** tab).

The site lands at `https://<your-username>.github.io/basic-python-programming-repo/`.

Three details the workflow handles for you, each of which silently breaks a naive
Next.js deployment to Pages:

- **Subpath.** A project site is served from `/<repo>/`, not `/`, so `basePath` and
  `assetPrefix` must carry that prefix. The workflow reads it from
  `actions/configure-pages`, so nothing hardcodes the repository name — rename the
  repo and it keeps working.
- **Jekyll.** Pages runs Jekyll by default, and Jekyll ignores any directory starting
  with an underscore — which is every JavaScript and CSS file Next emits, under
  `_next/`. A `.nojekyll` file switches that off.
- **Extensionless URLs.** `trailingSlash: true` makes the export write
  `topic/lists/index.html` instead of `topic/lists.html`, so deep links and hard
  reloads resolve on a plain file server.

To preview the exact Pages build locally:

```bash
npm run build:pages    # writes out/ with basePath=/basic-python-programming-repo
```

Then serve `out/` from a directory of that name, so paths line up with the real site.

### Deploying anywhere else

Because nothing runs on a server, the app can also be exported to plain files:

```bash
npm run build:static   # writes out/
```

Point any static host (Render, Netlify, Cloudflare Pages, S3) at the
`out/` directory. On Render, choose **Static Site**, build command `npm run build:static`,
publish directory `out`.

## How the Python runtime works

Python runs entirely in the student's browser via [Pyodide](https://pyodide.org), loaded on demand
from a public CDN. Nothing a student writes is sent anywhere. If the CDN is unreachable the site
degrades gracefully: lessons still display their expected output, and code questions offer the
worked answer instead of live marking.

## Project structure

```
app/                    routes — course map, topic decks, practice, playground, teacher guide
components/
  Stage.tsx             the presentation deck: keyboard nav, outline, full screen, type scaling
  CardView.tsx          renders one slide, whatever kind it is
  anim/                 19 interactive teaching animations
  practice/             question cards and the scoring set
  ui/                   code blocks, console, flowchart renderer, trace player, runnable editor
lib/
  curriculum/           all course content, one file per topic, fully typed
  python-runner.ts      Pyodide loader and output comparison
  highlight.ts          small Python tokenizer for syntax colouring
  progress.ts           localStorage progress store
```

## Editing the content

All teaching material lives in `lib/curriculum/topicNN.ts` and is typed against
`lib/curriculum/types.ts`. A topic is a list of concepts; a concept is a list of cards. Add a card
of kind `idea`, `code`, `anim`, `trace`, `flow`, `table`, `compare` or `checkpoint` and it appears
in the deck immediately — no component changes needed.

To add a question, append to a topic's `practice` array using one of the four question kinds. Code
questions are marked by comparing stdout with `expected`, so keep that string exact.
