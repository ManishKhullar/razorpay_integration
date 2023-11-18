const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
require("dotenv").config();
const crypto = require("crypto");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api", (request, response) => {
  response.send("NodeJs API is running");
});

app.post("/order", async (req, res) => {
  try {
    const paymentDetails = req.body;
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

    const order = await instance.orders.create(paymentDetails);
    if (!order) {
      res.status(500).send("Error");
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.post("/order/validate", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    //   generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);
    const signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    signature.update(razorpay_order_id + "|" + razorpay_payment_id);
    const hmac_digest = signature.digest("hex");

    if (razorpay_signature == hmac_digest) {
      res.status(200).json({
        msg: "payment success",
        success: true,
      });
    }

    res.send(400).json({
      msg: "Payment is not Legit!",
      success: true,
    });
  } catch (error) {
    res.send(500).send("Error");
  }
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});

// Create an order API for the client side
