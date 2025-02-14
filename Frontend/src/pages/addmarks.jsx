import React, { useState, useEffect } from 'react';
import "../styles/addmarks.css"

export default function AddMarks() {
    const [studentname, setStudentName] = useState("");
    const [marks, setMarks] = useState({ sub1: "", sub2: "", sub3: "", sub4: "", sub5: "" });
    const [marksList, setMarksList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentStudent, setCurrentStudent] = useState("");

    const handleChange = (e) => {
        setMarks({ ...marks, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!studentname || Object.values(marks).some(mark => mark === "")) {
            alert("All fields are required!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/${editing ? `update-mark/${currentStudent}` : "add-data"}`, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editing ? marks : { studentname, ...marks })
            });
            if (response.ok) fetchMarks();
        } catch (err) {
            console.error("Error:", err);
        } finally {
            resetForm();
            setLoading(false);
        }
    };

    const fetchMarks = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/fetch-marks");
            if (response.ok) {
                const data = await response.json();
                setMarksList(data.marks || []);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (studentname) => {
        if (!window.confirm(`Are you sure you want to delete marks for ${studentname}?`)) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/delete-mark/${studentname}`, { method: "DELETE" });
            if (response.ok) fetchMarks();
        } catch (err) {
            console.error("Delete Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (mark) => {
        setStudentName(mark.studentname);
        setMarks({ sub1: mark.sub1, sub2: mark.sub2, sub3: mark.sub3, sub4: mark.sub4, sub5: mark.sub5 });
        setEditing(true);
        setCurrentStudent(mark.studentname);
    };

    const resetForm = () => {
        setStudentName("");
        setMarks({ sub1: "", sub2: "", sub3: "", sub4: "", sub5: "" });
        setEditing(false);
        setCurrentStudent("");
    };

    useEffect(() => { fetchMarks(); }, []);

    return (
        <div>
            <h3>{editing ? "Edit Marks" : "Add Marks"}</h3>
            <input type="text" placeholder="Enter Student Name" value={studentname} onChange={(e) => setStudentName(e.target.value)} disabled={editing} />
            {Object.keys(marks).map((subject, index) => (
                <input key={index} type="number" placeholder={`Enter mark ${index + 1}`} name={subject} value={marks[subject]} onChange={handleChange} />
            ))}
            <button onClick={handleSubmit} disabled={loading}>{loading ? "Processing..." : editing ? "Update" : "Submit"}</button>
            {editing && <button onClick={resetForm}>Cancel</button>}
            <h3>Marks Table</h3>
            {loading ? <p>Loading...</p> : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Subject 1</th>
                            <th>Subject 2</th>
                            <th>Subject 3</th>
                            <th>Subject 4</th>
                            <th>Subject 5</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marksList.length > 0 ? marksList.map((mark, index) => (
                            <tr key={index}>
                                <td>{mark.studentname}</td>
                                <td>{mark.sub1}</td>
                                <td>{mark.sub2}</td>
                                <td>{mark.sub3}</td>
                                <td>{mark.sub4}</td>
                                <td>{mark.sub5}</td>
                                <td>
                                    <button onClick={() => handleEdit(mark)}>Edit</button>
                                    <button onClick={() => handleDelete(mark.studentname)}>Delete</button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="7">No marks available</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
    );
}
