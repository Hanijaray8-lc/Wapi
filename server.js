const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());

// Serve your HTML/CSS/JS from /public
app.use(express.static(path.join(__dirname, "public")));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

/*
|--------------------------------------------------------------------------
| WhatsApp Webhook Verification
|--------------------------------------------------------------------------
|
| Meta calls this URL when you configure the webhook.
|
*/

app.get("/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("WhatsApp webhook verification request");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    console.log("WhatsApp webhook verified successfully");

    return res.status(200).send(challenge);
  }

  console.log("WhatsApp webhook verification failed");

  return res.sendStatus(403);
});

/*
|--------------------------------------------------------------------------
| WhatsApp Webhook Events
|--------------------------------------------------------------------------
|
| Meta sends incoming messages, delivered/read status, etc. here.
|
*/

app.post("/webhook/whatsapp", (req, res) => {
  console.log("WhatsApp webhook received:");

  console.log(JSON.stringify(req.body, null, 2));

  // Always respond quickly to Meta
  res.sendStatus(200);
});

/*
|--------------------------------------------------------------------------
| Send WhatsApp Message
|--------------------------------------------------------------------------
|
| This is the endpoint your frontend can call.
|
*/

app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { recipient, message } = req.body;

    if (!recipient) {
      return res.status(400).json({
        success: false,
        error: "Recipient is required",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const phoneNumberId =
      process.env.WHATSAPP_PHONE_NUMBER_ID;

    const accessToken =
      process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return res.status(500).json({
        success: false,
        error: "WhatsApp environment variables are missing",
      });
    }

    const apiVersion =
      process.env.WHATSAPP_API_VERSION || "v23.0";

    const url =
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        messaging_product: "whatsapp",

        recipient_type: "individual",

        to: recipient,

        type: "text",

        text: {
          preview_url: true,
          body: message,
        },
      }),
    });

    const data = await response.json();

    console.log(
      "Meta API response:",
      JSON.stringify(data, null, 2)
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data,
      });
    }

    return res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("WhatsApp API error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});