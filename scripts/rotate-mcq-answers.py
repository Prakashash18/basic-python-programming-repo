"""Rotate each MCQ's choices so the correct answer is not always option A.

Run from the repository root:  python3 scripts/rotate-mcq-answers.py

Questions are easiest to write and review with the correct option first, which
left all 27 of them answerable by guessing A. This rewrites the content files
in place, spreading the answers evenly across the four slots.

It asserts every MCQ still has `answer: 0`, so running it twice fails loudly
rather than silently re-rotating already-shuffled questions. Author new
questions answer-first, then re-run it against a clean checkout.

Choice text is moved as RAW SOURCE, never parsed and re-serialised, so quotes,
apostrophes and escapes survive byte-for-byte. Rotation preserves the relative
order of the distractors and moves the correct option to a new slot.
"""
import glob, random, re

def scan_block(src, start):
    """(open_idx, close_idx) of the [...] beginning at/after start, quote-aware."""
    i = src.index('[', start)
    depth, j, quote = 0, i, None
    while j < len(src):
        ch = src[j]
        if quote:
            if ch == '\\':
                j += 2; continue
            if ch == quote:
                quote = None
        elif ch in '"\'`':
            quote = ch
        elif ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return i, j
        j += 1
    raise ValueError('unbalanced brackets')

def split_items(inner):
    """Top-level comma-separated items, returned as raw stripped source."""
    items, depth, quote, buf = [], 0, None, []
    k = 0
    while k < len(inner):
        ch = inner[k]
        if quote:
            buf.append(ch)
            if ch == '\\':
                buf.append(inner[k + 1]); k += 2; continue
            if ch == quote:
                quote = None
            k += 1; continue
        if ch in '"\'`':
            quote = ch; buf.append(ch); k += 1; continue
        if ch in '[({':
            depth += 1
        elif ch in '])}':
            depth -= 1
        if ch == ',' and depth == 0:
            items.append(''.join(buf)); buf = []; k += 1; continue
        buf.append(ch); k += 1
    tail = ''.join(buf).strip()
    if tail:
        items.append(tail)
    return [it.strip() for it in items if it.strip()]

files = sorted(glob.glob('lib/curriculum/topic*.ts'))

def mcq_ids(src):
    """Ids whose OWN question object declares kind: "mcq".

    The window must stop at the next `id:` or a short predict question would
    match the following question's kind and be mistaken for an MCQ.
    """
    ms = list(re.finditer(r'id:\s*"([^"]+)"', src))
    out = []
    for i, m in enumerate(ms):
        end = ms[i + 1].start() if i + 1 < len(ms) else len(src)
        if re.search(r'kind:\s*"mcq"', src[m.end():end]):
            out.append(m.group(1))
    return out

ids = []
for f in files:
    ids.extend(mcq_ids(open(f).read()))

rots = [i % 4 for i in range(len(ids))]
random.Random(20260911).shuffle(rots)
plan = dict(zip(ids, rots))

changed = 0
for f in files:
    src = open(f).read()
    # Work backwards so earlier offsets stay valid as we splice.
    ms = list(re.finditer(r'id:\s*"([^"]+)"', src))
    for i, m in reversed(list(enumerate(ms))):
        qid = m.group(1)
        if qid not in plan:
            continue
        bound = ms[i + 1].start() if i + 1 < len(ms) else len(src)
        k = plan[qid]
        ci = src.index('choices:', m.end())
        assert ci < bound, f'{qid}: choices outside question body'
        o, c = scan_block(src, ci)
        items = split_items(src[o + 1:c])
        assert len(items) == 4, f'{qid}: expected 4 choices, got {len(items)}'
        am = re.search(r'answer:\s*(\d+)', src[c:])
        assert am and am.group(1) == '0', f'{qid}: answer was not 0'
        if k:
            items = items[-k:] + items[:-k]
        src = src[:c + am.start()] + f'answer: {k}' + src[c + am.end():]
        src = src[:o] + '[\n' + ',\n'.join('        ' + it for it in items) + ',\n      ]' + src[c + 1:]
        changed += 1
    open(f, 'w').write(src)

print(f'rotated {changed} MCQs')
