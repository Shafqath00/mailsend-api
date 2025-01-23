import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Gmail SMTP Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// API to Send Email
app.post("/send-email", async (req, res) => {
    try {
        const { name, email, number, location, region, contexts, recipients = [] } = req.body;

        // Default recipients
        const defaultRecipients = ["teabenchfranblr@gmail.com", "100fyn@gmail.com "];
        const allRecipients = [...defaultRecipients, ...recipients].join(",");

        // Email content
        const mailOptions = {
            from: `"Tea-Bench" <${process.env.EMAIL_USER}>`,
            to: allRecipients,
            subject: `New Required From Tea-Bench`,
            text: `
            Name: ${name}
            Email: ${email}
            Number: ${number}
            Location: ${region}
            Region: ${location}
            Message: ${contexts}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        res.json({ success: false, message: "Failed to send email", error: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

