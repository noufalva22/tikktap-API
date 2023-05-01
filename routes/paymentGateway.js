import express from "express"

const router = express.Router();

router.post("/", (req, res) => {
    return new Promise((resolve, reject) => {
        var options = {
            key: process.env.API_KEY,
            key_secret: process.env.API_KEY_SECRET,
            //     amount: amount * 100
            // amount: productPrice * 100,
            amount: 100 * 100,
            currency: "INR",
            name: "TIKK TAP",
            description: "test",
            // order_id: "order_9A33XWu170gUtm",
            handler: function (response) {

            },
            prefill: {
                name: "clientName",
                email: "emailid",
                contact: "9999999",
            },
            notes: {
                address: "TIKK TAP COMMUNICATIONS"
            },
            theme: {
                color: "#3399cc"
            },
            notify: {
                "sms": true,
                "email": true
            }
        };
        var pay = new window.Razorpay(options);
        pay.open();
        pay.on('payment.failed', function (response) {
            // alert(response.error.code);
            alert(response.error.description);

        });
    })
})



export default router