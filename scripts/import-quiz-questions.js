#!/usr/bin/env node
/**
 * Import quiz questions from content/quiz/level-{N}/*.json into a SQL migration.
 *
 * Usage:
 *   node scripts/import-quiz-questions.js <level>
 *
 * Example:
 *   node scripts/import-quiz-questions.js 1
 *
 * Output:
 *   supabase/migrations/YYYYMMDDHHMMSS_level{N}_quiz_questions.sql
 *
 * Paste that file into the Supabase SQL Editor and run it.
 * The script DELETES existing questions for the level before inserting,
 * so it is safe to re-run when questions are updated.
 */

const fs = require('fs')
const path = require('path')

// Level UUID map — must match curriculum-taxonomy.ts and the levels table in DB.
const LEVEL_UUIDS = {
  1:  '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
  2:  '68cca497-8e72-4064-9781-f387f05c8492',
  3:  'd348d0b0-a934-42b7-82ed-d95ce318cd15',
  4:  '84f9bd80-690c-4b2e-845f-bac3459e09c7',
  5:  '156004ab-c0e6-4690-9b7e-c695ccf5b16f',
  6:  'ea48ac0c-0480-43dd-92d9-096a11ed3698',
  7:  '1be0566b-703c-41ab-ac96-49b024417378',
  8:  'da8c23e6-04be-44ba-83e1-9bc07adb0bee',
  9:  '878b07fd-c020-4bea-94c2-3a13270a5772',
  10: 'cce5b1f3-b01d-492e-914d-3d3b8e447cce',
  11: '37f39be5-11bd-43e6-b5dc-7366b920c3f4',
}

function esc(str) {
  return String(str).replace(/'/g, "''")
}

function main() {
  const levelArg = parseInt(process.argv[2], 10)
  if (!levelArg || !LEVEL_UUIDS[levelArg]) {
    console.error('Usage: node scripts/import-quiz-questions.js <level 1-11>')
    process.exit(1)
  }

  const levelId = LEVEL_UUIDS[levelArg]
  const contentDir = path.join(__dirname, '..', 'content', 'quiz', `level-${levelArg}`)

  if (!fs.existsSync(contentDir)) {
    console.error(`Directory not found: ${contentDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.json'))
  if (files.length === 0) {
    console.error(`No .json files found in ${contentDir}`)
    process.exit(1)
  }

  const questions = []
  for (const file of files.sort()) {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8')
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch (e) {
      console.error(`Invalid JSON in ${file}: ${e.message}`)
      process.exit(1)
    }
    if (!Array.isArray(parsed)) {
      console.error(`${file} must be a JSON array`)
      process.exit(1)
    }
    questions.push(...parsed)
  }

  // Validate each question has required fields.
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const missing = ['topic_tag', 'question', 'options', 'correct_index'].filter((k) => !(k in q))
    if (missing.length) {
      console.error(`Question ${i} missing fields: ${missing.join(', ')}`)
      process.exit(1)
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      console.error(`Question ${i} must have exactly 4 options`)
      process.exit(1)
    }
    if (typeof q.correct_index !== 'number' || q.correct_index < 0 || q.correct_index > 3) {
      console.error(`Question ${i} correct_index must be 0–3`)
      process.exit(1)
    }
  }

  // Build SQL.
  const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14)
  const outFile = path.join(
    __dirname,
    '..',
    'supabase',
    'migrations',
    `${timestamp}_level${levelArg}_quiz_questions.sql`,
  )

  const lines = []
  lines.push(`-- Level ${levelArg} quiz questions import`)
  lines.push(`-- Generated: ${new Date().toISOString()}`)
  lines.push(`-- Questions: ${questions.length}`)
  lines.push(`-- Files: ${files.join(', ')}`)
  lines.push('')
  lines.push('BEGIN;')
  lines.push('')
  lines.push(`-- Clear existing questions for this level to avoid duplicates.`)
  lines.push(`DELETE FROM public.quiz_questions WHERE level_id = '${levelId}';`)
  lines.push('')
  lines.push('INSERT INTO public.quiz_questions (level_id, topic_tag, question, options, correct_index, explanation)')
  lines.push('VALUES')

  const rows = questions.map((q, i) => {
    const optionsJson = esc(JSON.stringify(q.options))
    const explanation = q.explanation ? esc(q.explanation) : ''
    const comma = i < questions.length - 1 ? ',' : ''
    return (
      `  ('${levelId}', '${esc(q.topic_tag)}', '${esc(q.question)}', ` +
      `'${optionsJson}'::jsonb, ${q.correct_index}, '${explanation}')${comma}`
    )
  })

  lines.push(...rows)
  lines.push(';')
  lines.push('')
  lines.push('COMMIT;')
  lines.push('')

  fs.writeFileSync(outFile, lines.join('\n'), 'utf8')

  console.log(`✓ ${questions.length} questions written to:`)
  console.log(`  ${outFile}`)
  console.log('')
  console.log('Next: paste that file into the Supabase SQL Editor and run it.')
}

main()
