import express from "express"
import Order from "../models/Order.js";
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";

const router = express.Router();

//CREAT
router.post('/', async (req, res) => {

    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save()
        console.log("Server 2");

        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})

//UPDATE

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }

        );

        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json(error)

    }

})

//DELETE ORDER

router.delete("/:id",  async (req, res) => {

    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")

    } catch (error) {
        res.status(5000).json(error)
    }
})

//GET USER ORDERS BY ID

router.get("/find/:userId", async (req, res) => {

    try {
        const orders = await Order.findOne({ userId: req.params.userId })
        res.status(200).json(orders)

    } catch (error) {
        res.status(500).json(error)
    }
})
//GET USER ORDERS BY EMAIL

router.get("/get/:emailId", async (req, res) => {

    try {
        const orders = await Order.findOne({ emailId: req.params.emailId })
        res.status(200).json(orders)

    } catch (error) {
        res.status(500).json(error)
    }
})

//GET ALL 

router.get("/", async (req, res) => {
    console.log("Get all");
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET ORDER BY ORDERID
router.get("/:orderID", async (req, res) => {
    
    try {
        const order = await Order.findOne({orderID : req.params.orderID});
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GEt MONTHLY INCOME 
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previosMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    try {

        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previosMonth } } },
            {
                $project: {

                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },

            },

        ]);

        res.status(500).json(income)
    } catch (error) {
        res.status(500).json(error)
    }
})


export default router