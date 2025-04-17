const express = require("express");
const router = express.Router();
const pool = require("../db/employee_db");

router.post("/create", async (req, res) => {
  const { birth_date, first_name, last_name, gender, hire_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO employee (birth_date, first_name, last_name, gender, hire_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [birth_date, first_name, last_name, gender, hire_date]
    );
    res.status(201).json({ message: "Employee created successfully", employee: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get All Employees
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employee");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Employee by ID
router.get("/:emp_no", async (req, res) => {
  const { emp_no } = req.params;
  try {
    const result = await pool.query("SELECT * FROM employee WHERE emp_no = $1", [emp_no]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:emp_no", async (req, res) => {
  const { emp_no } = req.params;
  const { first_name, last_name, birth_date, gender, hire_date } = req.body;
  try {
    const result = await pool.query(
      "UPDATE employee SET first_name = $1, last_name = $2, birth_date = $3, gender = $4, hire_date = $5 WHERE emp_no = $6 RETURNING *",
      [first_name, last_name, birth_date, gender, hire_date, emp_no]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee updated successfully", employee: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:emp_no", async (req, res) => {
  const { emp_no } = req.params;
  try {
    const result = await pool.query("DELETE FROM employee WHERE emp_no = $1", [emp_no]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/search", async (req, res) => {
    const { employeeId, firstName, lastName } = req.body;
  
    try {
      let query = "SELECT * FROM employee WHERE 1=1";
      const params = [];
  
      if (employeeId) {
        query += " AND emp_no = $1";
        params.push(employeeId);
      }
      if (firstName) {
        query += " AND first_name ILIKE $2";
        params.push(`%${firstName}%`);
      }
      if (lastName) {
        query += " AND last_name ILIKE $3";
        params.push(`%${lastName}%`);
      }
  
      const result = await pool.query(query, params);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error searching for employees:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router;