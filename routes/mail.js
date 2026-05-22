const express = require("express");

const router = express.Router();

const pool = require("../db");


// SEND MAIL

router.post("/send", async (req, res) => {

  try {

    const {
      sender,
      receiver,
      subject,
      message,
    } = req.body;

    await pool.query(
      `
      INSERT INTO mails
      (sender, receiver, subject, message)
      VALUES($1,$2,$3,$4)
      `,
      [
        sender,
        receiver,
        subject,
        message,
      ]
    );

    res.status(201).json({
      message: "Mail sent successfully",
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      message: "Server Error",
    });

  }
});


// GET RECEIVED MAILS

router.get(
  "/inbox/:email",
  async (req, res) => {

    try {

      const email = req.params.email;

      const mails = await pool.query(
        `
        SELECT * FROM mails
        WHERE receiver=$1
        ORDER BY created_at DESC
        `,
        [email]
      );

      res.json(mails.rows);

    } catch (error) {

      res.status(500).json({
        message: "Server Error",
      });

    }
  }
);


// GET SENT MAILS

router.get(
  "/sent/:email",
  async (req, res) => {

    try {

      const email = req.params.email;

      const mails = await pool.query(
        `
        SELECT * FROM mails
        WHERE sender=$1
        ORDER BY created_at DESC
        `,
        [email]
      );

      res.json(mails.rows);

    } catch (error) {

      res.status(500).json({
        message: "Server Error",
      });

    }
  }
);

module.exports = router;