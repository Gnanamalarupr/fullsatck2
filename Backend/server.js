const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.post("/add-data", async (req, res) => {
    const { studentname, sub1, sub2, sub3, sub4, sub5 } = req.body;

    try {
        const [result] = await db.execute(
            `INSERT INTO log (studentname, sub1, sub2, sub3, sub4, sub5) VALUES (?, ?, ?, ?, ?, ?)`,
            [studentname, sub1, sub2, sub3, sub4, sub5]
        );

        res.status(201).json({ message: "Marks inserted successfully", result });
    } catch (error) {
        console.error("Insert Error:", error);
        res.status(500).json({ error: "Failed to add marks" });
    }
});


app.get("/fetch-marks", async (req, res) => {
    try {
        const [results] = await db.execute("SELECT * FROM log");
        res.status(200).json({ marks: results });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch marks" });
    }
});


app.delete("/delete-mark/:studentname", async (req, res) => {
    const studentname = req.params.studentname;

    try {
        const [result] = await db.execute("DELETE FROM log WHERE studentname = ?", [studentname]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ message: "Mark deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Failed to delete mark" });
    }
});


app.put("/update-mark/:studentname", async (req, res) => {
    const studentname = req.params.studentname;
    const { sub1, sub2, sub3, sub4, sub5 } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE log SET sub1 = ?, sub2 = ?, sub3 = ?, sub4 = ?, sub5 = ? WHERE studentname = ?`,
            [sub1, sub2, sub3, sub4, sub5, studentname]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ message: "Mark updated successfully" });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: "Failed to update mark" });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
