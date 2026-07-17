import express from "express";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// @ts-ignore
import Razorpay from "razorpay";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Create Razorpay Order
  app.post("/api/create-order", async (req, res) => {
    try {
      const { amount, currency, receipt } = req.body;

      if (!amount || typeof amount !== "number" || amount < 100) {
        return res.status(400).json({ error: "Amount must be a number and at least 100 paise (Rs 1)" });
      }

      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keyId || !keySecret) {
        return res.status(500).json({ error: "Razorpay keys are not configured in environment variables" });
      }

      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: Math.round(amount), // in paise
        currency: currency || "INR",
        receipt: receipt || `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({ error: error.message || "Failed to create order with Razorpay" });
    }
  });

  // API Route: Verify Razorpay Payment Signature
  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing required signature verification parameters" });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return res.status(500).json({ error: "Razorpay Key Secret is not configured" });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        res.json({ status: "success", verified: true });
      } else {
        res.status(400).json({ status: "failure", verified: false, error: "Signature verification failed" });
      }
    } catch (error: any) {
      console.error("Razorpay signature verification error:", error);
      res.status(500).json({ error: error.message || "Failed to verify signature" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} with Node Env: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
