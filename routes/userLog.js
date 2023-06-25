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

//for data migration
router.post('/migrate', async (req, res) => {
    try {
      const accountLogs = req.body; // Assuming req.body is an array of objects
  
      const savedLogs = await Promise.all(
        accountLogs.map(async (log) => {
          const newLog = new ProfileVisitLog(log);
          return await newLog.save();
        })
      );
  
      res.status(200).json(savedLogs);
    } catch (error) {
      res.status(500).json(error);
    }
  });


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
router.post('/account/migrate', async (req, res) => {
    try {
      const accountLogs = req.body; // Assuming req.body is an array of objects
  
      const savedLogs = await Promise.all(
        accountLogs.map(async (log) => {
          const newLog = new SocialsVisitLog(log);
          return await newLog.save();
        })
      );
  
      res.status(200).json(savedLogs);
    } catch (error) {
      res.status(500).json(error);
    }
  });

//GET ALL SOCIAL LOG

router.get("/account/:username", async (req, res) => {
    try {
        const pipeline = [
            { $match: { username: req.params.username } },
            {
                $group: {
                    _id: "$account",
                    count: { $sum: 1 }
                }
            }
        ];

        const allSocialVisitLog = await SocialsVisitLog.aggregate(pipeline);

        res.status(200).json(allSocialVisitLog);
    } catch (error) {
        res.status(500).json(error);
    }
})
//old code
// router.get("/account/:username", async (req, res) => {

//     try {
//         const allSocialVisitLog = await SocialsVisitLog.find({ username: req.params.username })
//         res.status(200).json(allSocialVisitLog)

//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

//save activity log



//save website traffic




export default router