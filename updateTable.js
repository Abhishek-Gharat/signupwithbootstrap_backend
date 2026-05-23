const pool = require("./db");

async function updateTable() {
  try {
    await pool.query(`
      ALTER TABLE mails 
      ADD COLUMN IF NOT EXISTS trashed BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS trashed_at TIMESTAMP DEFAULT NULL;
    `);
    console.log("✅ Mails table updated with trash columns");
    
    // Verify table structure
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mails'
    `);
    console.log("\n📧 Table structure:");
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
  } catch (error) {
    console.error("❌ Error updating table:", error.message);
  } finally {
    pool.end();
  }
}

updateTable();
