const { Pool } = require("pg");

// Try to load .env file, but don't fail if dotenv is not available
try {
  require("dotenv").config();
} catch (e) {
  console.log("dotenv not loaded, using environment variables");
}

// Log config for debugging (hide password)
console.log("Database Config:");
console.log("  User:", process.env.DB_USER || "postgres");
console.log("  Password:", process.env.DB_PASSWORD ? "[SET]" : "[NOT SET]");
console.log("  Host:", process.env.DB_HOST || "localhost");
console.log("  Port:", process.env.DB_PORT || "5432");
console.log("  Database:", process.env.DB_NAME || "authapp");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "authapp",
});

pool.connect()
.then(() => {
  console.log("✅ PostgreSQL Connected Successfully");
})
.catch((err) => {
  console.error("❌ PostgreSQL Connection Error:", err.message);
  console.error("\n💡 Troubleshooting:");
  console.error("1. Make sure PostgreSQL is running");
  console.error("2. Check if database 'authapp' exists");
  console.error("3. Verify user 'postgres' with password '1234'");
  console.error("4. Check if port 5432 is available");
});

module.exports = pool;
