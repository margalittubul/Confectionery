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
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      // בדוק אם הסטטוס באמת השתנה
      const statusChanged = order.status !== status;

      order.status = status;
      const updated = await order.save();

      console.log("Order updated successfully, status changed:", statusChanged);

      // שלח מייל רק אם הסטטוס באמת השתנה
      if (statusChanged) {
        const customer = await Customer.findById(updated.customerId);
        console.log("Customer found:", customer?.email);

        if (customer?.email) {
          console.log("Starting to send email in background...");
          sendOrderStatusEmail(customer.email, {
            orderId: updated._id,
            status: updated.status,
            orderDate: updated.orderDate,
            price: updated.price,
          })
            .then(() => {
              console.log("Email sent successfully!");
            })
            .catch((emailErr) => {
              console.error("Failed to send email:", emailErr);
            });
        } else {
          console.log("No customer email found, skipping email");
        }
      } else {
        console.log("Status unchanged, skipping email");
      }

      res.json(updated);
    } catch (err) {
      console.error("Error in updateOrderStatus:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
  advanceStatus: async (req, res) => {
    const { id } = req.params;
    console.log("advanceStatus called for order:", id);
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      console.log("Current status:", order.status);

      let newStatus;
      if (order.status === "אושרה הזמנה") newStatus = "בתהליך...";
      else if (order.status === "בתהליך...") newStatus = "נשלח";
      else if (order.status === "נשלח") newStatus = "הגיע ליעד, בתאבון!!!";
      else return res.status(400).json({ message: "Cannot advance" });

      console.log("New status:", newStatus);

      order.status = newStatus;
      await order.save();

      console.log("Order saved, fetching customer...");

      const customer = await Customer.findById(order.customerId);
      console.log("Customer email:", customer?.email);

      if (customer?.email) {
        console.log("Sending email in background...");
        sendOrderStatusEmail(customer.email, {
          orderId: order._id,
          status: order.status,
          orderDate: order.orderDate,
          price: order.price,
        })
          .then(() => {
            console.log("Email sent successfully!");
          })
          .catch((emailErr) => {
            console.error("Failed to send email:", emailErr);
          });
      } else {
        console.log("No customer email, skipping email");
      }

      res.json(order);
    } catch (err) {
      console.error("Error in advanceStatus:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
  updatePrice: async (req, res) => {
    const { id } = req.params;
    const { price } = req.body;
    try {
      const order = await Order.findByIdAndUpdate(id, { price }, { new: true });
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
};
export default OrderController;
