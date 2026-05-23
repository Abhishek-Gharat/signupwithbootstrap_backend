const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

async function checkDatabase() {
  try {
    console.log("Connecting to database...");
    
    // Check if mails table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'mails'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log("❌ 'mails' table does not exist!");
      console.log("\nPlease create the table first with:");
      console.log(`
CREATE TABLE mails (
  id SERIAL PRIMARY KEY,
  sender VARCHAR(255),
  receiver VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);
      `);
      return;
    }
    
    console.log("✅ 'mails' table exists");
    
    // Check columns
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mails'
      ORDER BY ordinal_position;
    `);
    
    console.log("\n📧 Table columns:");
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    // Count emails
    const count = await pool.query("SELECT COUNT(*) FROM mails");
    console.log(`\n📊 Total emails: ${count.rows[0].count}`);
    
    // Check for test11@gmail.com
    const testEmails = await pool.query(
      "SELECT * FROM mails WHERE receiver = $1 OR sender = $1 LIMIT 5",
      ["test11@gmail.com"]
    );
    console.log(`\n📨 Emails for test11@gmail.com: ${testEmails.rows.length}`);
    
  } catch (error) {
    console.error("❌ Database error:", error.message);
    console.log("\n💡 Make sure:");
    console.log("1. PostgreSQL is running");
    console.log("2. Database 'authapp' exists");
    console.log("3. User 'postgres' with password '1234' has access");
  } finally {
    pool.end();
  }
}

checkDatabase();
