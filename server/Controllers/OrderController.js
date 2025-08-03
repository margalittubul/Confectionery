import Order from '../Models/Order.js';

  //הצגת כל ההזמנות
  const OrderController = {
    getList: async (req, res) => {
    try {
      const user = req.user; 
      let query = {};
      if (user.role !== 'admin') {
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

    if (user.role !== 'admin' && orderItem.customerId.toString() !== user.id) {
      return res.status(403).json({ message: "Access denied: Not your order" });
    }

    res.json(orderItem);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
},

  //הוספת הזמנה חדשה
  add: async (req, res) => {
    try {
      const customerId = req.user.id; 
      const orderData = req.body;
      const newOrder = await Order.create({
        customerId,
        products: orderData.products,
        orderDate: orderData.orderDate,
        status: "הוזמן",
        price: orderData.price
      });
      res.status(201).json(newOrder);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
    },

    //מחיקת הזמנה
     delete: async (req, res) => {
        try {
             const { customerId } = req.user.id; 
            const deletedOrder = await Order.findByIdAndDelete(customerId);
            if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
            res.json({ message: "Order deleted successfully", deletedOrder });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    },
    //עדכון סטטוס המנה
    updateOrderStatus : async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['הוזמן', 'שולם', 'אושרה הזמנה'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const updated = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
    },
};
export default OrderController;