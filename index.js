import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const port = 5900;
const app = express();

// app.use(express.static('public'));

mongoose
  .connect(
    "mongodb+srv://Visalikannan1711:qwertyuiop12345678@cluster0.h6jnfag.mongodb.net/webdev"
  )
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => console.error("MongoDB connection error", err));
// const db = mongoose.connection;

// db.once('open', () => {
//     console.log("Mongodb connection successful");
// });
app.use(cors());
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("users", userSchema);
app.get("/", async (req, res) => {
  res.send("Server Found Successfully");
});
app.post("/register", async (req, res) => {
  const { name, age, dob, gender, email, password } = req.body;

  try {
    const user = new UserModel({ name, age, dob, gender, email, password });
    //  const hashedPassword = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200);
  } catch (error) {
    console.log("Error during registration:", error);
    res.json({ success: false });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🚀 ~ app.post ~ password:", password);
  console.log("🚀 ~ app.post ~ email:", email);

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = password == user.password;

    if (passwordMatch) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    // popup('you are not a user');
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
