const express = require("express");

const cors = require("cors");

require("dotenv").config();

const authRoutes =
  require("./routes/auth");

const mailRoutes =
  require("./routes/mail");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/mail", mailRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(process.env.PORT, () => {

  console.log(
    `Server running on port ${process.env.PORT}`
  );

});