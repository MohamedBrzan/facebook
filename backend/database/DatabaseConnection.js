const mongoose = require("mongoose");

module.exports = (_) =>
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected 🌱🌱🌱🌱🌱"))
    .catch((err) => console.log(err.message + "🩸🩸🩸🩸🩸🩸"));
