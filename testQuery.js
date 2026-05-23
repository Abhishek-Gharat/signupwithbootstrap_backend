const pool = require("./db");

async function testQuery() {
  try {
    console.log("Testing database query...");
    const result = await pool.query("SELECT * FROM mails WHERE receiver = $1 LIMIT 5", ["test11@gmail.com"]);
    console.log("Query successful!");
    console.log("Rows:", result.rows);
  } catch (error) {
    console.error("Query failed:", error.message);
    console.error("Full error:", error);
  } finally {
    pool.end();
  }
}

testQuery();
