import express from "express"
import Product from "../models/Product.js";
import { verifyTokenAndAdmin } from "./verifyToken.js";

const router = express.Router();

//ADD
router.post('/', async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save()

        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE

router.put("/:id", async (req, res) => {
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

//UPDATE FIREBASE IMAGE LINK IN TO PRODUCT COLLECTION

router.put("/:id/update-image/:type", async (req, res) => {
    try {
        const { id, type } = req.params;
        const { link } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            console.log("no product");
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log("link", link);

        if (type == "Normal") {

            product.image.push({ src: link });
        }
        if (type == "Small") {

            product.imageSmall.push({ src: link });
        }
        if (type == "Thumbnail") {

            product.imageThumbnail.push({ src: link });
        }
        await product.save();



        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//delete selected image

router.put("/:productID/delete-image", async (req, res) => {
    try {
        const { productID } = req.params;
        const { selectedIndex } = req.body;

        const product = await Product.findById(productID);
        if (!product) {
            console.log("no product");
            return res.status(404).json({ message: 'Product not found' });
        }
        // Remove the selected image from the array
        product.image.splice(selectedIndex, 1);

        await product.save();



        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//DELETE PRODUCT

router.delete("/:id", async (req, res) => {

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
        const product = await Product.findOne({ productID: req.params.id })
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