const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/applications", require("./routes/ApplicationRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});