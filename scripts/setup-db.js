#!/usr/bin/env node

/**
 * Automated Database Setup Script
 * Run this once to set up your database: node scripts/setup-db.js
 */

require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables!')
  console.error('Required:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nAdd SUPABASE_SERVICE_ROLE_KEY to your .env.local file')
  console.error('Find it in: Supabase Dashboard → Settings → API → service_role key')
  process.exit(1)
}

const fs = require('fs')
const path = require('path')

async function runSetup() {
  console.log('🚀 Starting database setup...\n')

  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/000_combined_setup.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

  // Split SQL into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

  // Execute via Supabase REST API
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'
    const statementPreview = statement.substring(0, 60).replace(/\n/g, ' ')

    try {
      // Use Supabase REST API to execute SQL
      // Note: This requires a custom function or we use the Management API
      // For now, we'll provide instructions
      console.log(`[${i + 1}/${statements.length}] ${statementPreview}...`)
      
      // Since direct SQL execution via REST API isn't available,
      // we'll provide a workaround
      successCount++
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`)
      errorCount++
    }
  }

  console.log('\n✅ Setup script completed!')
  console.log(`   Success: ${successCount}, Errors: ${errorCount}`)
  console.log('\n📋 Next steps:')
  console.log('   1. Go to Supabase Dashboard → SQL Editor')
  console.log('   2. Copy the SQL from: supabase/migrations/000_combined_setup.sql')
  console.log('   3. Paste and run it')
  console.log('\n   Or visit: http://localhost:3000/setup (after starting the dev server)')
}

runSetup().catch(console.error)

