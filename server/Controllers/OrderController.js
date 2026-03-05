import Order from "../Models/Order.js";
import Customer from "../Models/Customer.js";
import { sendOrderStatusEmail } from "../EmailService.js";
const OrderController = {
  getList: async (req, res) => {
    try {
      const user = req.user;
      let query = {};
      if (user.role !== "admin") {
        query.customerId = user.id;
      }
      const orderList = await Order.find(query);
      res.json({ orderList });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  getById: async (req, res) => {
    try {
      const orderId = req.params.id;
      const user = req.user;
      const orderItem = await Order.findById(orderId);

      if (!orderItem) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (
        user.role !== "admin" &&
        orderItem.customerId.toString() !== user.id
      ) {
        return res
          .status(403)
          .json({ message: "Access denied: Not your order" });
      }

      res.json(orderItem);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  add: async (req, res) => {
    try {
      const customerId = req.user.id;
      const orderData = req.body;
      const newOrder = await Order.create({
        customerId,
        products: orderData.products,
        orderDate: orderData.orderDate,
        status: "הוזמן",
        price: orderData.price,
      });
      res.status(201).json(newOrder);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { customerId } = req.user.id;
      const deletedOrder = await Order.findByIdAndDelete(customerId);
      if (!deletedOrder)
        return res.status(404).json({ message: "Order not found" });
      res.json({ message: "Order deleted successfully", deletedOrder });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  updateOrderStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log("Updating order status:", { id, status });

    if (
      ![
        "הוזמן",
        "שולם",
        "אושרה הזמנה",
        "בתהליך...",
        "נשלח",
        "הגיע ליעד, בתאבון!!!",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const updated = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
      if (!updated) return res.status(404).json({ message: "Order not found" });
      
      console.log("Order updated successfully");
      
      const customer = await Customer.findById(updated.customerId);
      console.log("Customer found:", customer?.email);
      
      if (customer?.email) {
        sendOrderStatusEmail(customer.email, {
          orderId: updated._id,
          status: updated.status,
          orderDate: updated.orderDate,
          price: updated.price,
        }).catch(emailErr => {
          console.error("Failed to send email:", emailErr);
        });
      }
      
      res.json(updated);
    } catch (err) {
      console.error("Error in updateOrderStatus:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
  advanceStatus: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      
      let newStatus;
      if (order.status === "אושרה הזמנה") newStatus = "בתהליך...";
      else if (order.status === "בתהליך...") newStatus = "נשלח";
      else if (order.status === "נשלח") newStatus = "הגיע ליעד, בתאבון!!!";
      else return res.status(400).json({ message: "Cannot advance" });
      
      order.status = newStatus;
      await order.save();
      
      const customer = await Customer.findById(order.customerId);
      if (customer?.email) {
        sendOrderStatusEmail(customer.email, {
          orderId: order._id,
          status: order.status,
          orderDate: order.orderDate,
          price: order.price,
        }).catch(emailErr => {
          console.error("Failed to send email:", emailErr);
        });
      }
      
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
  updatePrice: async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { price },
        { new: true }
      );
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
};
export default OrderController;
