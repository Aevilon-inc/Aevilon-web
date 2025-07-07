const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const multer = require('multer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Handle contact form submission
router.post('/', multer().none(), async (req, res) => {
    console.log('DEBUG req.body:', req.body); // Debug log
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }
console.log("inside contact form submission route");
        // Create new contact
        const contact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });
        console.log('contact: ', contact);

        await contact.save();

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || 'aevilon.inc@gmail.com',
            subject: `New Contact Form Submission: ${subject}`,
            text: `You have received a new message from your website contact form.\n\n
                Name: ${name}\n
                Email: ${email}\n
                Phone: ${phone}\n
                Subject: ${subject}\n
                Message:\n${message}\n`,
            replyTo: email
        };
  
        // Send email notification
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
            res.json({ success: true, message: 'Message sent successfully.' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Error sending message.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error sending message.' });
    }
});

module.exports = router;
