const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const router = express.Router();



router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query('SELECT id, username, password FROM admins WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const admin = result.rows[0];
        
        if (password !== admin.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                id: admin.id, 
                username: admin.username
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: '1h' 
            }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            token,
            admin: {
                id: admin.id, 
                username: admin.username
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ 
            error: 'Authentication failed',
            ...(process.env.NODE_ENV !== 'production' && { details: err.message })
        });
    }
});

module.exports = router;