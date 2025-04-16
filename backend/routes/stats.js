const express = require('express');
const pool = require('../db/employee_db'); 
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalEmployeesResult = await pool.query('SELECT COUNT(*) AS total_employees FROM employee');
    const totalEmployees = totalEmployeesResult.rows[0].total_employees;

    const totalDepartmentsResult = await pool.query('SELECT COUNT(*) AS total_departments FROM department');
    const totalDepartments = totalDepartmentsResult.rows[0].total_departments;

    const totalSalariesResult = await pool.query('SELECT SUM(amount) AS total_salaries FROM salary');
    const totalSalaries = totalSalariesResult.rows[0].total_salaries;

    const totalManagersResult = await pool.query('SELECT COUNT(*) AS total_managers FROM dept_manager');
    const totalManagers = totalManagersResult.rows[0].total_managers;

    res.status(200).json({
      totalEmployees,
      totalDepartments,
      totalSalaries,
      totalManagers,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;