/**
 * Fetches stroke counts from KanjiVG (via hanzi-writer CDN) for every kanji
 * in the Supabase `kanji` table and writes the value back.
 *
 * Prerequisites:
 *   1. Run the SQL migration first (see scripts/stroke_count_migration.sql)
 *   2. Set SUPABASE_SERVICE_KEY in your environment (service-role key, not anon)
 *
 * Usage:
 *   SUPABASE_SERVICE_KEY=<key> node scripts/add-stroke-counts.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = 'https://dimztabtlovjojlrrkjj.supabase.co';
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY;
const CDN_BASE         = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest';
const CONCURRENCY      = 5;   // parallel fetches at a time
const DELAY_MS         = 120; // ms between batches to be CDN-friendly

if (!SUPABASE_KEY) {
  console.error('❌  Set SUPABASE_SERVICE_KEY env variable first.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── helpers ───────────────────────────────────────────────────────── */

async function fetchStrokeCount(char) {
  const code = char.codePointAt(0).toString(16).padStart(5, '0');
  const res  = await fetch(`${CDN_BASE}/${code}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${char} (U+${code})`);
  const data = await res.json();
  return data.strokes?.length ?? null;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runBatch(items) {
  return Promise.allSettled(
    items.map(async row => {
      try {
        const count = await fetchStrokeCount(row.kanji);
        const { error } = await supabase
          .from('kanji')
          .update({ stroke_count: count })
          .eq('num', row.num);
        if (error) throw error;
        return { kanji: row.kanji, count, ok: true };
      } catch (err) {
        return { kanji: row.kanji, ok: false, err: err.message };
      }
    })
  );
}

/* ── main ──────────────────────────────────────────────────────────── */

async function main() {
  console.log('📥  Fetching kanji list from Supabase…');
  const { data: rows, error } = await supabase
    .from('kanji')
    .select('num, kanji')
    .order('num');

  if (error) { console.error('❌  Supabase error:', error.message); process.exit(1); }
  console.log(`✅  ${rows.length} kanji to process.\n`);

  let ok = 0, fail = 0;

  for (let i = 0; i < rows.length; i += CONCURRENCY) {
    const batch   = rows.slice(i, i + CONCURRENCY);
    const results = await runBatch(batch);

    results.forEach(r => {
      const v = r.value;
      if (v?.ok) {
        console.log(`  ✓ ${v.kanji}  →  ${v.count} strokes`);
        ok++;
      } else {
        const info = r.value ?? r.reason;
        console.warn(`  ✗ ${info?.kanji ?? '?'}  →  ${info?.err ?? r.reason}`);
        fail++;
      }
    });

    if (i + CONCURRENCY < rows.length) await sleep(DELAY_MS);
  }

  console.log(`\n🎉  Done — ${ok} updated, ${fail} failed.`);
}

main().catch(err => { console.error(err); process.exit(1); });
