const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const alterTable = async () => {
  try {
    await pool.query(`
      ALTER TABLE mails 
      ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false
    `);
    console.log("✅ Table updated: 'read' column added");
    
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
    
  } catch (err) {
    console.log("❌ Error:", err.message);
  } finally {
    pool.end();
  }
};

alterTable();
