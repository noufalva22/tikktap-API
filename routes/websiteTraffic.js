import express from "express"
import WebsiteTrafficSchema from "../models/WebsiteTraffic.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const siteTraffic = new WebsiteTrafficSchema(req.body)

    try {
        const savedLog = await siteTraffic.save()
        res.status(200).json(savedLog)
    } catch (error) {
        res.status(500).json(error)
    }

})

router.get('/', async (req, res) => {
    

    try {
        const allLog = await WebsiteTrafficSchema.find()
        res.status(200).json(allLog)
    } catch (error) {
        res.status(500).json(error)
    }

})
export default router