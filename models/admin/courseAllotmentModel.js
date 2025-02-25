const db = require("../../db/db");

const allotCourse = async (courseData) => {
    const { course_id, faculty_id, class: className, sem, dept_id, academic_yr } = courseData;

    try {
        // 🔍 Validate Missing Fields
        if (!course_id) throw new Error("course_id is required");
        if (!faculty_id) throw new Error("faculty_id is required");
        if (!className) throw new Error("class is required");
        if (!sem) throw new Error("sem is required");
        if (!dept_id) throw new Error("dept_id is required");
        if (!academic_yr) throw new Error("academic_yr is required");

        // 🔍 Validate Data Types
        if (typeof course_id !== "string") throw new Error("course_id must be a string");
        if (typeof faculty_id !== "number") throw new Error("faculty_id must be a number");
        if (typeof className !== "string") throw new Error("class must be a string");
        if (typeof sem !== "string") throw new Error("sem must be a string");
        if (typeof dept_id !== "number") throw new Error("dept_id must be a number");
        if (typeof academic_yr !== "number") throw new Error("academic_yr must be a number");

        // 🔍 Check if Faculty ID Exists
        const facultyCheckQuery = `SELECT * FROM Faculty WHERE faculty_id = ?`;
        const [faculty] = await db.query(facultyCheckQuery, [faculty_id]);

        if (faculty.length === 0) {
            throw new Error("Faculty ID does not exist");
        }

        // 🔍 Check if the course is already allotted
        const checkQuery = `SELECT * FROM Course_Allotment WHERE course_id = ? AND faculty_id = ? AND academic_yr = ?`;
        const [existing] = await db.query(checkQuery, [course_id, faculty_id, academic_yr]);

        if (existing.length > 0) {
            throw new Error("Course already allotted to faculty for this academic year");
        }

        // ✅ Insert new allotment
        const insertQuery = `INSERT INTO Course_Allotment (course_id, faculty_id, class, sem, dept_id, academic_yr) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(insertQuery, [course_id, faculty_id, className, sem, dept_id, academic_yr]);

        return { id: result.insertId, ...courseData };
    } catch (err) {
        throw err;
    }
};

//function to get all alloted courses
const getAllottedCourses = async () => {
    try {
        const query = `
            SELECT 
                ca.course_id, 
                c.course_name, 
                ca.faculty_id, 
                f.name AS faculty_name, 
                ca.class, 
                ca.sem, 
                ca.academic_yr
            FROM Course_Allotment ca
            JOIN Course c ON ca.course_id = c.course_id
            JOIN Faculty f ON ca.faculty_id = f.faculty_id;
        `;

        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
};


// Function to update course allotment details
const updateCourseAllotment = async (course_id, courseData) => {
    const { faculty_id, class: className, sem, academic_yr } = courseData;

    try {
        // Check if course_id is provided
        if (!course_id) {
            throw new Error("Course ID is required.");
        }

        // Check if required fields are present
        if (!faculty_id || !className || !sem || !academic_yr) {
            throw new Error("All fields (faculty_id, class, sem, academic_yr) are required.");
        }

        // Check if sem is a string
        if (typeof sem !== "string") {
            throw new Error("Semester (sem) should be a string (e.g., 'even' or 'odd').");
        }

        // Check if academic year is a valid number (e.g., 2024, 2025)
        if (typeof academic_yr !== "number" || academic_yr < 2000 || academic_yr > 2100) {
            throw new Error("Invalid academic year. Please enter a valid year (e.g., 2024, 2025).");
        }

        // Check if course_id exists
        const [existingCourse] = await db.query(`SELECT * FROM Course_Allotment WHERE course_id = ?`, [course_id]);
        if (existingCourse.length === 0) {
            throw new Error("Course ID does not exist. Please enter a valid course_id.");
        }

        // Check if faculty_id exists in Faculty table
        const [existingFaculty] = await db.query(`SELECT * FROM Faculty WHERE faculty_id = ?`, [faculty_id]);
        if (existingFaculty.length === 0) {
            throw new Error("Invalid faculty_id. Please enter a valid faculty_id.");
        }

        // Check if the updated details already exist (Duplicate Check)
        const [duplicateCheck] = await db.query(
            `SELECT * FROM Course_Allotment WHERE course_id = ? AND faculty_id = ? AND class = ? AND sem = ? AND academic_yr = ?`,
            [course_id, faculty_id, className, sem, academic_yr]
        );
        if (duplicateCheck.length > 0) {
            throw new Error("This course allotment already exists with the given details.");
        }

        // Update the course allotment details
        const updateQuery = `
            UPDATE Course_Allotment 
            SET faculty_id = ?, class = ?, sem = ?, academic_yr = ? 
            WHERE course_id = ?
        `;
        await db.query(updateQuery, [faculty_id, className, sem, academic_yr, course_id]);

        return { message: "Course allotment updated successfully." };
    } catch (err) {
        throw err;
    }
};



module.exports = { allotCourse,getAllottedCourses,updateCourseAllotment };
