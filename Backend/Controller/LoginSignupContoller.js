const User = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_secret_key"; //👉 production la env file la podanum

exports.signup = async (req, res) => {
  console.log(req.body)
  try {
    const { name, email, password,role} = req.body;
    console.log(name + " " + email + " " + password)
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    user = new User({ name, email, password: hashedPassword, role });
    // console.log(user)
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id },JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token as HTTP-only cookie
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: true, // change to true when using https
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
