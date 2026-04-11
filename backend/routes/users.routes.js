const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

require('dotenv').config();

const pool = require('../db');

const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   GET api/users/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, first_name, last_name, email_id, phone_number, profile_picture, email_notifications FROM users WHERE id = $1', [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/profile
// @desc    Update user profile & avatar
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const userId = req.user.id;

    const {
        first_name,
        last_name,
        phone_number,
        skills,
        hourly_rate,
        availability,
        portfolio_url
    } = req.body;

    try {
        await pool.query(
            "UPDATE users SET first_name=$1, last_name=$2, phone_number=$3, skills=$4, hourly_rate=$5, availability=$6, portfolio_url=$7 WHERE id=$8",
            [
                first_name,
                last_name,
                phone_number,
                skills,
                hourly_rate,
                availability,
                portfolio_url,
                userId
            ]
        );

        res.json({
            message:"Profile updated successfully"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
    const { email_notifications } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET email_notifications = $1 WHERE id = $2 RETURNING email_notifications',
            [email_notifications, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
