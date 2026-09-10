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
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
```

## Deploying to Vercel

The project is a stock Next.js App Router app, so Vercel needs no configuration:

1. Push this branch to GitHub.
2. In Vercel, **Add New… → Project** and import the repository.
3. Leave the framework preset as **Next.js**; build command `npm run build`, output `.next`.
4. Deploy.

Optionally set `NEXT_PUBLIC_SITE_URL` to your final domain so `sitemap.xml` and `robots.txt`
carry absolute URLs.

Every page is statically prerendered, so the site is served from the CDN edge and costs nothing
to keep online.

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
