const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

async function initializeDatabase() {
  try {
    console.log("🔧 Initializing database...\n");

    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Users table initialized");

    // Create mails table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mails (
        id SERIAL PRIMARY KEY,
        sender VARCHAR(255) NOT NULL,
        receiver VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        read BOOLEAN DEFAULT false,
        trashed BOOLEAN DEFAULT false,
        trashed_at TIMESTAMP DEFAULT NULL
      );
    `);
    console.log("✅ Mails table initialized");

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_mails_receiver ON mails(receiver);
      CREATE INDEX IF NOT EXISTS idx_mails_sender ON mails(sender);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log("✅ Database indexes created");

    // Verify table structure
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mails'
      ORDER BY ordinal_position;
    `);
    console.log("\n📧 Mails table structure:");
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    console.log("\n✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
