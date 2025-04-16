const express = require('express');
const pool = require('../db/db');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT username, profile_pic FROM admins WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const admin = result.rows[0];

        res.status(200).json({
            username: admin.username,
            profilePicture: admin.profile_pic, 
        });
    } catch (err) {
        console.error('Error fetching admin details:', err);
        res.status(500).json({
            error: 'Failed to fetch admin details',
            ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
        });
    }
});

module.exports = router;