import express from "express"
import ProfileVisitLog from "../models/ProfileVisitLog.js";
import SocialsVisitLog from "../models/SocialsVisitLog.js";
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";

const router = express.Router();

//FOR PROFILE VISIT LOG

//CREAT 
router.post('/', async (req, res) => {
    const newProfileLog = new ProfileVisitLog(req.body)
    try {
        const savedLog = await newProfileLog.save()

        res.status(200).json(savedLog)
    } catch (error) {
        res.status(500).json(error)
    }
})


//GET ALL PROFILE LOG OF A USER

router.get("/:username", async (req, res) => {

    try {
        const allProfileVisitdata = await ProfileVisitLog.find({ username: req.params.username })
        res.status(200).json(allProfileVisitdata)

    } catch (error) {
        res.status(500).json(error)
    }
})
//GET ALL PROFILE

router.get("/", async (req, res) => {

    try {
        const allProfileVisitdata = await ProfileVisitLog.find()
        res.status(200).json(allProfileVisitdata)

    } catch (error) {
        res.status(500).json(error)
    }
})



//FOR SOCIAL VISIT LOG


//CREAT 
router.post('/account/', async (req, res) => {
    const NewAccountVisitLog = new SocialsVisitLog(req.body)
    try {
        const savedLog = await NewAccountVisitLog.save()

        res.status(200).json(savedLog)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET ALL SOCIAL LOG

router.get("/account/:username", async (req, res) => {

    try {
        const allSocialVisitLog = await SocialsVisitLog.find({ username: req.params.username })
        res.status(200).json(allSocialVisitLog)

    } catch (error) {
        res.status(500).json(error)
    }
})


export default router