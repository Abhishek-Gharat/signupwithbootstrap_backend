const express = require("express");
const router = express.Router();
const pool = require("../db");

// SEND MAIL
router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, subject, message } = req.body;
    
    // Validate required fields
    if (!sender || !receiver || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO mails (sender, receiver, subject, message) VALUES ($1,$2,$3,$4) RETURNING *`,
      [sender, receiver, subject, message]
    );
    res.status(201).json({ message: "Mail sent successfully", mail: result.rows[0] });
  } catch (error) {
    console.error("Error sending mail:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// GET INBOX (non-trashed emails where user is receiver)
router.get("/inbox/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const mails = await pool.query(
      `SELECT * FROM mails WHERE receiver = $1 AND (trashed = false OR trashed IS NULL) ORDER BY created_at DESC`,
      [email]
    );
    res.json(mails.rows);
  } catch (error) {
    console.error("Error fetching inbox:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// GET SENT (non-trashed emails where user is sender)
router.get("/sent/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const mails = await pool.query(
      `SELECT * FROM mails WHERE sender = $1 AND (trashed = false OR trashed IS NULL) ORDER BY created_at DESC`,
      [email]
    );
    res.json(mails.rows);
  } catch (error) {
    console.error("Error fetching sent:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// GET TRASH (emails marked as trashed for a user)
router.get("/trash/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const mails = await pool.query(
      `SELECT * FROM mails WHERE (sender = $1 OR receiver = $1) AND trashed = true ORDER BY trashed_at DESC`,
      [email]
    );
    res.json(mails.rows);
  } catch (error) {
    console.error("Error fetching trash:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// MARK AS READ
router.put("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE mails SET read = true WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mail not found" });
    }
    res.json({ message: "Mail marked as read", mail: result.rows[0] });
  } catch (error) {
    console.error("Error marking mail as read:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// MOVE TO TRASH
router.put("/trash/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE mails SET trashed = true, trashed_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mail not found" });
    }
    res.json({ message: "Mail moved to trash", mail: result.rows[0] });
  } catch (error) {
    console.error("Error moving mail to trash:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// RESTORE FROM TRASH
router.put("/restore/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE mails SET trashed = false, trashed_at = NULL WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mail not found" });
    }
    res.json({ message: "Mail restored", mail: result.rows[0] });
  } catch (error) {
    console.error("Error restoring mail:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// PERMANENT DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM mails WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mail not found" });
    }
    res.json({ message: "Mail deleted successfully", mail: result.rows[0] });
  } catch (error) {
    console.error("Error deleting mail:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// PERMANENT DELETE FROM TRASH
router.delete("/permanent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `DELETE FROM mails WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mail not found" });
    }
    res.json({ message: "Mail permanently deleted", mail: result.rows[0] });
  } catch (error) {
    console.error("Error permanently deleting mail:", error.message);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

module.exports = router;
