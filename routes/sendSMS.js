import express from "express"
import axios from 'axios';
const router = express.Router();

router.get("/", async (req, res) => {
    let apikey = "K2bDhI15LkKEELSOoxgOOQ";
    let senderid = "TIKTAP";
    let mobile = "919947672066";
    let message = `Hello NAK! Welcome to TIKK TAP. Your account has been created. Please log in to configure your account. https://tikktap.com/login Team- TIKK TAP`;
    let channel = "2";
    let DCS = "0";
    let flashsms = "0";
    console.log(req.body.mobile);
    try {
        const response = await axios.get(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${apikey}&Senderid=${senderid}&channel=2&DCS=0&flashsms=0&number=${mobile}&text=${message}&route=1&EntityId=1301164723923117507&dlttemplateid=1307165069951714955`)
        res.status(response.status).json(response.data)
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }
})



export default router