import Customer from "../Models/Customer.js";
import jwt from "jsonwebtoken";

const CustomerController = {
  getlist: async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json({ customers });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  getById: async (req, res) => {
    try {
      const { customerId } = req.user.id;
      if (!customerId)
        return res.status(404).json({ message: "Customer not found" });
      res.json(customerId);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  getByEmail: async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ message: "יש להזין כתובת אימייל" });
      }
      const customer = await Customer.findOne({ email }).select("-password");
      if (!customer) {
        return res.status(404).json({ message: "הלקוח לא נמצא" });
      }
      res.json(customer);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
  add: async (req, res) => {
    try {
      const { name, email, address, role, password } = req.body;
      const existingUser = await Customer.findOne({
        $or: [{ name }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "משתמש עם שם או אימייל זה כבר קיים" });
      }
      const newCustomer = await Customer.create({
        name,
        email,
        address,
        role,
        password,
      });
      res.status(201).json(newCustomer);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  update: async (req, res) => {
    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(
        req.user.id,
        req.body,
        { new: true },
      );
      if (!updatedCustomer)
        return res.status(404).json({ message: "Customer not found" });
      res.json(updatedCustomer);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  login: async (req, res) => {
    try {
      const { name, password } = req.body;
      const user = await Customer.findOne({ name });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      const token = jwt.sign(
        { id: user._id, username: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );
      res.json({ token, role: user.role });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  profile: async (req, res) => {
    try {
      const user = await Customer.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (e) {
      console.error("PROFILE ERROR:", e);
      res.status(400).json({ message: e.message });
    }
  },
  joinClub: async (req, res) => {
    try {
      console.log("=== JOIN CLUB START ===");
      console.log("1. User ID from token:", req.user.id);
      console.log("2. Request body:", req.body);
      const { birth_date } = req.body;
      console.log("3. Birth date extracted:", birth_date);
      
      const existingUser = await Customer.findById(req.user.id);
      console.log("4. Existing user found:", { 
        id: existingUser._id, 
        name: existingUser.name,
        is_club_member: existingUser.is_club_member,
        birth_date: existingUser.birth_date 
      });
      
      if (existingUser.is_club_member) {
        console.log("5. User already a member - returning error");
        return res.status(400).json({ message: "כבר רשום למועדון" });
      }
      
      console.log("5. Updating user with:", { is_club_member: true, birth_date });
      const user = await Customer.findByIdAndUpdate(
        req.user.id,
        { is_club_member: true, birth_date },
        { new: true }
      );
      
      console.log("6. User after update:", {
        id: user._id,
        name: user.name,
        is_club_member: user.is_club_member,
        birth_date: user.birth_date
      });
      
      if (!user) {
        console.log("7. User not found after update");
        return res.status(404).json({ message: "משתמש לא נמצא" });
      }
      
      console.log("7. Sending response with updated user");
      console.log("=== JOIN CLUB END ===");
      res.json(user);
    } catch (e) {
      console.error("Join Club Error:", e);
      res.status(400).json({ message: e.message });
    }
  },
};

export default CustomerController;
