/**
 * Seed script — uploads all local study data to Supabase.
 * Run: node scripts/seed.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dimztabtlovjojlrrkjj.supabase.co';
const supabaseKey = 'sb_publishable_nD6uD8zlVcisxX5NmP5Pcw_rg2-vVCm';
const supabase = createClient(supabaseUrl, supabaseKey);

// We need to sign in as admin to insert data (RLS requires auth)
const ADMIN_EMAIL = process.argv[2];
const ADMIN_PASS  = process.argv[3];

if (!ADMIN_EMAIL || !ADMIN_PASS) {
  console.error('Usage: node scripts/seed.mjs <admin-email> <admin-password>');
  process.exit(1);
}

async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASS });
  if (error) { console.error('Login failed:', error.message); process.exit(1); }
  console.log('Signed in as', ADMIN_EMAIL);
}

async function batchInsert(table, rows) {
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from(table).insert(batch);
    if (error) { console.error(`Error inserting into ${table} at batch ${i}:`, error.message); return; }
    inserted += batch.length;
  }
  console.log(`  ✓ ${table}: ${inserted} rows`);
}

// ─── Import local data ───
async function loadData() {
  // Dynamic import of the local data files
  const { D: n5Data } = await import('../src/data/n5Data.js');
  const { n4Data } = await import('../src/data/n4Data.js');
  const { D_NEW } = await import('../src/data/newVocabData.js');
  const { kanjiData } = await import('../src/data/kanjiData.js');
  const { HIRA, KATA } = await import('../src/data/kanaData.js');
  const { GRAMMAR } = await import('../src/data/grammarData.js');
  const { GENKI } = await import('../src/data/genkiData.js');
  const { MNN } = await import('../src/data/mnnData.js');
  return { n5Data, n4Data, D_NEW, kanjiData, HIRA, KATA, GRAMMAR, GENKI, MNN };
}

// ─── Seed Vocabulary ───
async function seedVocabulary(n5Data, n4Data, D_NEW) {
  console.log('\nSeeding vocabulary...');
  const rows = [];

  // N5 vocab
  for (const [section, items] of Object.entries(n5Data)) {
    for (const item of items) {
      rows.push({
        num: String(item.num),
        kanji: item.kanji || '',
        kana: item.kana || '',
        romaji: item.romaji || '',
        english: item.english || '',
        section_name: section,
        level: 'N5',
      });
    }
  }

  // N4 vocab
  for (const [section, items] of Object.entries(n4Data)) {
    for (const item of items) {
      rows.push({
        num: String(item.num),
        kanji: item.kanji || '',
        kana: item.kana || '',
        romaji: item.romaji || '',
        english: item.english || '',
        section_name: section,
        level: 'N4',
      });
    }
  }

  // New/extended vocab
  for (const [section, items] of Object.entries(D_NEW)) {
    const level = section.startsWith('N5') ? 'N5' : section.startsWith('N4') ? 'N4' : 'N3';
    for (const item of items) {
      rows.push({
        num: String(item.num),
        kanji: item.kanji || '',
        kana: item.kana || '',
        romaji: item.romaji || '',
        english: item.english || '',
        section_name: section,
        level,
      });
    }
  }

  await batchInsert('vocabulary', rows);
}

// ─── Seed Kanji ───
async function seedKanji(kanjiData) {
  console.log('\nSeeding kanji...');
  const rows = [];

  for (const [section, items] of Object.entries(kanjiData)) {
    const level = section.startsWith('N5') ? 'N5' : section.startsWith('N4') ? 'N4' : 'N3';
    for (const item of items) {
      rows.push({
        num: String(item.num),
        kanji: item.kanji || '',
        kana: item.kana || '',
        romaji: item.romaji || '',
        english: item.english || '',
        example: item.example || '',
        ex_reading: item.exReading || '',
        ex_english: item.exEnglish || '',
        section_name: section,
        level,
      });
    }
  }

  await batchInsert('kanji_items', rows);
}

// ─── Seed Kana ───
async function seedKana(HIRA, KATA) {
  console.log('\nSeeding kana...');
  const rows = [];

  for (const category of ['basic', 'dakuten', 'combo']) {
    if (HIRA[category]) {
      for (const row of HIRA[category]) {
        rows.push({
          type: 'hiragana',
          category,
          row_name: row.r,
          chars: row.chars,
        });
      }
    }
    if (KATA[category]) {
      for (const row of KATA[category]) {
        rows.push({
          type: 'katakana',
          category,
          row_name: row.r,
          chars: row.chars,
        });
      }
    }
  }

  await batchInsert('kana_data', rows);
}

// ─── Seed Grammar ───
async function seedGrammar(GRAMMAR) {
  console.log('\nSeeding grammar...');
  const rows = GRAMMAR.map(g => ({
    id: g.id,
    level: g.level,
    title: g.title,
    meaning: g.meaning || '',
    structure: g.structure || '',
    examples: g.examples || [],
    tamil: g.tamil || '',
    tags: g.tags || [],
    src: g.src || [],
  }));

  await batchInsert('grammar_patterns', rows);
}

// ─── Seed Textbooks ───
async function seedTextbooks(GENKI, MNN) {
  console.log('\nSeeding textbook lessons...');
  const rows = [];

  for (const lesson of GENKI) {
    rows.push({
      book: 'genki',
      lesson_num: lesson.n,
      title: lesson.title,
      title_en: lesson.en,
      grammar: lesson.grammar,
      vocab: lesson.vocab,
    });
  }

  for (const lesson of MNN) {
    rows.push({
      book: 'mnn',
      lesson_num: lesson.n,
      title: lesson.title,
      title_en: lesson.en,
      grammar: lesson.grammar,
      vocab: lesson.vocab,
    });
  }

  await batchInsert('textbook_lessons', rows);
}

// ─── Main ───
async function main() {
  await signIn();

  console.log('Loading local data files...');
  const { n5Data, n4Data, D_NEW, kanjiData, HIRA, KATA, GRAMMAR, GENKI, MNN } = await loadData();

  await seedVocabulary(n5Data, n4Data, D_NEW);
  await seedKanji(kanjiData);
  await seedKana(HIRA, KATA);
  await seedGrammar(GRAMMAR);
  await seedTextbooks(GENKI, MNN);

  console.log('\n✅ All data seeded successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
