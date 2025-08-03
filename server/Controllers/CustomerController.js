import Customer from '../Models/Customer.js'; 
import jwt from 'jsonwebtoken'; 

const CustomerController = {
    // הצגת כל הלקוחות למנהל
    getlist: async (req, res) => {
        try {
            const customers = await Customer.find();
            res.json({ customers }); 
        } catch (e) {
            res.status(400).json({ message: e.message }); 
        }
    },
    // הצגת לקוח לפי קוד לקוח / גם למנהל וגם לקונה
    getById: async (req, res) => {
        try {
            const { customerId } = req.user.id; 
            if (!customerId) return res.status(404).json({ message: "Customer not found" });
            res.json(customerId); 
        } catch (e) {
            res.status(400).json({ message: e.message }); 
        }
    },
    // הצגת לקוח לפי כתובת אימייל
    getByEmail: async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "יש להזין כתובת אימייל" });
        }
        //מסתיר את הסיסמא
        const customer = await Customer.findOne({ email }).select("-password");
        if (!customer) {
            return res.status(404).json({ message: "הלקוח לא נמצא" });
        }

        res.json(customer);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
    },
    // הוספת לקוח חדש
    add: async (req, res) => {
        try {
            const { name, email, address, role, password } = req.body;
            const existingUser = await Customer.findOne({
                $or: [{ name }, { email }]
            });
            if (existingUser) {
                return res.status(400).json({ message: 'משתמש עם שם או אימייל זה כבר קיים' });
            }
            const newCustomer = await Customer.create({ name, email, address, role, password });
            res.status(201).json(newCustomer);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
    ,
    // עדכון פרטי לקוח לפי קוד לקוח
    update: async (req, res) => {
        try {
            const updatedCustomer = await Customer.findByIdAndUpdate(
                req.user.id, 
                req.body,
                { new: true } 
            );
            if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" }); 
            res.json(updatedCustomer); 
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    //התחברות
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
            { expiresIn: '1h' }
        );
        res.json({ token });
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
};

export default CustomerController;


