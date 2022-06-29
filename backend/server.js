const app = require("./app");
const DatabaseConnection = require("./database/DatabaseConnection");
const PORT = process.env.PORT || 5000;

DatabaseConnection();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
