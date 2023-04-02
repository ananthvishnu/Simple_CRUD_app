const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Connect to MongoDB database
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database");
});

// Define schema for a sample collection
const sampleSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

const Sample = mongoose.model("Sample", sampleSchema);

app.use(bodyParser.json());

// Define routes for CRUD operations
app.post("/samples", async (req, res) => {
  const { name, age, email } = req.body;
  const sample = new Sample({ name, age, email });
  await sample.save();
  res.send(sample);
});

app.get("/samples", async (req, res) => {
  const samples = await Sample.find();
  res.send(samples);
});

app.get("/samples/:id", async (req, res) => {
  const sample = await Sample.findById(req.params.id);
  res.send(sample);
});

app.put("/samples/:id", async (req, res) => {
  const { name, age, email } = req.body;
  const sample = await Sample.findById(req.params.id);
  sample.name = name;
  sample.age = age;
  sample.email = email;
  await sample.save();
  res.send(sample);
});

app.delete("/samples/:id", async (req, res) => {
  await Sample.findByIdAndDelete(req.params.id);
  res.send({ message: "Sample deleted successfully" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
