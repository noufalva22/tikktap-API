import express from "express"
import UserData from "../models/UserData.js";
import { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } from "./verifyToken.js";

const router = express.Router();

//CREAT USERDATA
router.post('/', async (req, res) => {
    const newUser = new UserData(req.body)
    try {
        const savedUser = await newUser.save()

        res.status(200).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE USERDATA

router.put("/:id", async (req, res) => {

    try {
        const updatedUser = await UserData.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }

        );

        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(err)

    }

})
//UPDATE ACCOUNTS
router.put("/:userId/accounts/:accountId", async (req, res) => {
    // console.log("1");

    try {
        const user = await UserData.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const account = user.accounts.id(req.params.accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        account.link = req.body.link || account.link;
        account.status = req.body.status || account.status;

        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }



})

//DELETE USERDATA

router.delete("/:id", async (req, res) => {

    try {
        await UserData.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")

    } catch (error) {
        res.status(500).json(error)
    }
})


//GET ALL 

router.get("/", async (req, res) => {
    try {
        const ALL_USER = await UserData.find();
        res.status(200).json(ALL_USER);
    } catch (err) {
        res.status(500).json(err);
    }
});
//GET USER with email id

router.get("/find/:id", async (req, res) => {

    try {
        const user = await UserData.find({ emailId: req.params.id })
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json(error)
    }
})
//GET USER with username public req

router.get("/get/:id", async (req, res) => {

    try {
        const data = await UserData.findOne({ username: req.params.id })
        res.status(200).json(data)

    } catch (error) {
        res.status(500).json(error)
    }
})

//CHECK EXISTING USERNAME OR NOT
router.get("/check/:username", async (req, res) => {

    try {
        const user = await UserData.find({ username: req.params.username })
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json(error)
    }
})
router.get("/search", async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const users = await UserData.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});


export default router