import express from "express"
import Product from "../models/Product.js";
import { verifyTokenAndAdmin } from "./verifyToken.js";

const router = express.Router();

//ADD
router.post('/',  async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save()

        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(err)
    }
})

//DELETE PRODUCT

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")

    } catch (error) {
        res.status(5000).json(error)
    }
})

//GET PRODUCT

router.get("/find/:id", async (req, res) => {

    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)

    } catch (error) {
        res.status(500).json(error)
    }
})

//GET ALL PRODUCT

router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.categories;
    console.log("Inside Product");
    try {
        let products;
        products = await Product.find();
        res.status(200).json(products);
        console.log("Products :", products);
    } catch (error) {
        res.status(5000).json(error)
    }
})



export default router