const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

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

// Handle job application submission
// Wrap multer upload with manual error handling
router.post('/', (req, res, next) => {
  upload.single('resume')(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ success: false, message: 'Resume file is required.' });
    }

    const { name, email, phone, position, 'cover-letter': coverLetter } = req.body;
    console.log('Received application:', { name, email, phone, position, coverLetter });
    console.log('Uploaded file:', req.file);

    const application = new Application({
      name,
      email,
      phone,
      position,
      coverLetter,
      resumePath: req.file.path
    });

    await application.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'aevilon.inc@gmail.com',
      subject: `New Application for ${position}`,
      text: `A new application has been submitted:\n\n
        Name: ${name}\n
        Email: ${email}\n
        Phone: ${phone}\n
        Position: ${position}\n
        Cover Letter:\n${coverLetter}\n`,
      attachments: [{
        filename: req.file.originalname,
        path: req.file.path
      }]
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: 'Application submitted successfully.' });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});


module.exports = router;
