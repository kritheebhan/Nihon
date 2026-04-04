/**
 * Generates SQL INSERT statements from local data files.
 * Usage: node scripts/gen-sql.mjs vocab > vocab.sql
 *        node scripts/gen-sql.mjs kanji > kanji.sql
 *        node scripts/gen-sql.mjs kana > kana.sql
 *        node scripts/gen-sql.mjs grammar > grammar.sql
 *        node scripts/gen-sql.mjs textbooks > textbooks.sql
 */
const type = process.argv[2];

function esc(s) {
  if (s == null) return '';
  return String(s).replace(/'/g, "''");
}

function jsonEsc(obj) {
  return esc(JSON.stringify(obj));
}

async function main() {
  if (type === 'vocab') {
    const { D } = await import('../src/data/n5Data.js');
    const { n4Data } = await import('../src/data/n4Data.js');
    const { D_NEW } = await import('../src/data/newVocabData.js');
    const allData = { ...D, ...n4Data, ...D_NEW };

    const rows = [];
    for (const [section, items] of Object.entries(allData)) {
      const level = section.startsWith('N5') ? 'N5' : section.startsWith('N4') ? 'N4' : 'N3';
      for (const item of items) {
        rows.push(`('${esc(item.num)}','${esc(item.kanji)}','${esc(item.kana)}','${esc(item.romaji)}','${esc(item.english)}','${esc(section)}','${level}')`);
      }
    }

    // Batch into groups of 200
    for (let i = 0; i < rows.length; i += 200) {
      const batch = rows.slice(i, i + 200);
      console.log(`INSERT INTO public.vocabulary (num,kanji,kana,romaji,english,section_name,level) VALUES`);
      console.log(batch.join(',\n') + ';');
      console.log('---BATCH---');
    }
  }

  else if (type === 'kanji') {
    const { kanjiData } = await import('../src/data/kanjiData.js');
    const rows = [];
    for (const [section, items] of Object.entries(kanjiData)) {
      const level = section.startsWith('N5') ? 'N5' : section.startsWith('N4') ? 'N4' : 'N3';
      for (const item of items) {
        rows.push(`('${esc(item.num)}','${esc(item.kanji)}','${esc(item.kana)}','${esc(item.romaji)}','${esc(item.english)}','${esc(item.example)}','${esc(item.exReading)}','${esc(item.exEnglish)}','${esc(section)}','${level}')`);
      }
    }
    for (let i = 0; i < rows.length; i += 200) {
      const batch = rows.slice(i, i + 200);
      console.log(`INSERT INTO public.kanji_items (num,kanji,kana,romaji,english,example,ex_reading,ex_english,section_name,level) VALUES`);
      console.log(batch.join(',\n') + ';');
      console.log('---BATCH---');
    }
  }

  else if (type === 'kana') {
    const { HIRA, KATA } = await import('../src/data/kanaData.js');
    const rows = [];
    for (const category of ['basic', 'dakuten', 'combo']) {
      if (HIRA[category]) {
        for (const row of HIRA[category]) {
          rows.push(`('hiragana','${category}','${esc(row.r)}','${jsonEsc(row.chars)}')`);
        }
      }
      if (KATA[category]) {
        for (const row of KATA[category]) {
          rows.push(`('katakana','${category}','${esc(row.r)}','${jsonEsc(row.chars)}')`);
        }
      }
    }
    console.log(`INSERT INTO public.kana_data (type,category,row_name,chars) VALUES`);
    console.log(rows.join(',\n') + ';');
  }

  else if (type === 'grammar') {
    const { GRAMMAR } = await import('../src/data/grammarData.js');
    const rows = GRAMMAR.map(g =>
      `('${esc(g.id)}','${esc(g.level)}','${esc(g.title)}','${esc(g.meaning)}','${esc(g.structure)}','${jsonEsc(g.examples)}','${esc(g.tamil)}','${jsonEsc(g.tags)}','${jsonEsc(g.src || [])}')`
    );
    console.log(`INSERT INTO public.grammar_patterns (id,level,title,meaning,structure,examples,tamil,tags,src) VALUES`);
    console.log(rows.join(',\n') + ';');
  }

  else if (type === 'textbooks') {
    const { GENKI } = await import('../src/data/genkiData.js');
    const { MNN } = await import('../src/data/mnnData.js');
    const rows = [];
    for (const l of GENKI) {
      rows.push(`('genki',${l.n},'${esc(l.title)}','${esc(l.en)}','${jsonEsc(l.grammar)}','${jsonEsc(l.vocab)}')`);
    }
    for (const l of MNN) {
      rows.push(`('mnn',${l.n},'${esc(l.title)}','${esc(l.en)}','${jsonEsc(l.grammar)}','${jsonEsc(l.vocab)}')`);
    }
    console.log(`INSERT INTO public.textbook_lessons (book,lesson_num,title,title_en,grammar,vocab) VALUES`);
    console.log(rows.join(',\n') + ';');
  }
}

main().catch(console.error);
