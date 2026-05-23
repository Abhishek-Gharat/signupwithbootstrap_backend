const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const insertDummyData = async () => {
  try {
    // Clear existing mails
    await pool.query("DELETE FROM mails");
    console.log("✅ Cleared existing mails");

    // Dummy mails
    const dummyMails = [
      {
        sender: "john@example.com",
        receiver: "user@yahoo.com",
        subject: "Meeting Tomorrow",
        message:
          "<p>Hi there,</p><p>Just a reminder that we have a meeting scheduled for tomorrow at 2 PM.</p><p>Best regards,<br>John</p>",
        read: false,
      },
      {
        sender: "sarah@gmail.com",
        receiver: "user@yahoo.com",
        subject: "Project Update",
        message:
          "<p>Hello,</p><p>The project is progressing well. I've attached the latest updates for your review.</p><p>Thanks,<br>Sarah</p>",
        read: false,
      },
      {
        sender: "boss@company.com",
        receiver: "user@yahoo.com",
        subject: "Monthly Report",
        message:
          "<p>Hi,</p><p>Please submit your monthly report by end of day Friday.</p><p>Regards,<br>Manager</p>",
        read: true,
      },
      {
        sender: "amazon@amazon.com",
        receiver: "user@yahoo.com",
        subject: "Your Order Has Shipped",
        message:
          "<p>Good news!</p><p>Your order #12345 has been shipped and will arrive tomorrow.</p><p>Track your package at amazon.com</p>",
        read: false,
      },
      {
        sender: "linkedin@linkedin.com",
        receiver: "user@yahoo.com",
        subject: "New Connection Request",
        message:
          "<p>You have a new connection request from Jane Doe.</p><p>Click here to view their profile.</p>",
        read: true,
      },
      {
        sender: "github@github.com",
        receiver: "user@yahoo.com",
        subject: "Security Alert",
        message:
          "<p>We noticed a new sign-in to your GitHub account.</p><p>If this was you, you can ignore this email.</p>",
        read: false,
      },
      {
        sender: "netflix@netflix.com",
        receiver: "user@yahoo.com",
        subject: "New Shows This Week",
        message:
          "<p>Check out what's new on Netflix this week!</p><p>New releases include Stranger Things, The Crown, and more.</p>",
        read: true,
      },
      {
        sender: "support@bank.com",
        receiver: "user@yahoo.com",
        subject: "Monthly Statement Available",
        message:
          "<p>Your monthly statement is now available.</p><p>Log in to your account to view it.</p>",
        read: false,
      },
    ];

    for (const mail of dummyMails) {
      await pool.query(
        `
        INSERT INTO mails (sender, receiver, subject, message, read, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '${Math.floor(
          Math.random() * 7
        )} days')
      `,
        [
          mail.sender,
          mail.receiver,
          mail.subject,
          mail.message,
          mail.read,
        ]
      );
    }

    console.log(
      `✅ Inserted ${dummyMails.length} dummy mails`
    );

    // Show summary
    const result = await pool.query(
      `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN read = false THEN 1 END) as unread
      FROM mails
    `
    );

    console.log("\n📧 Mail Summary:");
    console.log(
      `  Total mails: ${result.rows[0].total}`
    );
    console.log(
      `  Unread mails: ${result.rows[0].unread}`
    );
  } catch (err) {
    console.log("❌ Error:", err.message);
  } finally {
    pool.end();
  }
};

insertDummyData();
