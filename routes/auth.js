const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const pool = require("../db");


// SIGNUP

router.post("/signup", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        message: "All fields are required"
      });

    }

    // check existing user

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    // hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // insert user

    await pool.query(
      "INSERT INTO users(email,password) VALUES($1,$2)",
      [email, hashedPassword]
    );

    console.log(
      "User has successfully signed up"
    );

    res.status(201).json({
      message:
        "User has successfully signed up"
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      message: error.message
    });

  }
});



// LOGIN

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.rows[0].password
      );

    if (!validPassword) {

      return res.status(400).json({
        message: "Invalid credentials"
      });

    }

    // JWT TOKEN

    const token = jwt.sign(
      {
        id: user.rows[0].id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      token,
      message: "Login successful"
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;