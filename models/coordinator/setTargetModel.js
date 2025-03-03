const db = require('../../db/db');

const Models = {
    // Fetch courses assigned to a faculty
    getCoursesByFaculty: async (faculty_id) => {
        const query = `
            SELECT 
    c.course_id, 
    c.class, 
    c.sem, 
    d.dept_name,  -- Fetch dept_name from Department table
    c.attainment_score, 
    c.academic_yr,
    ct.target1, 
    ct.target2, 
    ct.target3, 
    ct.sppu1, 
    ct.sppu2, 
    ct.sppu3, 
    co.course_name
FROM Course_Coordinator AS c
LEFT JOIN Course_Target AS ct 
    ON c.course_id = ct.course_id AND c.academic_yr = ct.academic_yr
LEFT JOIN Course AS co 
    ON c.course_id = co.course_id  -- Join with the Course table to get course_name
LEFT JOIN Department AS d 
    ON c.dept_id = d.dept_id  -- Join with Department table to get dept_name
WHERE c.faculty_id = ?;
        `;
        const [courses] = await db.execute(query, [faculty_id]);
        return courses;
    },

    // Set or update course targets
    setCourseTargets: async ({ course_id, dept_id, academic_yr, target1, target2, target3, sppu1, sppu2, sppu3 }) => {
        // Fetch current values from the database
        const [existing] = await db.execute(
            `SELECT target1, target2, target3, sppu1, sppu2, sppu3 FROM Course_Target 
             WHERE course_id = ? AND dept_id = ? AND academic_yr = ?`,
            [course_id, dept_id, academic_yr]
        );

        // Extract existing row if found
        const existingRow = existing.length ? existing[0] : {};

        // Use existing values if the new values are undefined
        target1 = target1 !== undefined ? target1 : existingRow.target1;
        target2 = target2 !== undefined ? target2 : existingRow.target2;
        target3 = target3 !== undefined ? target3 : existingRow.target3;
        sppu1 = sppu1 !== undefined ? sppu1 : existingRow.sppu1;
        sppu2 = sppu2 !== undefined ? sppu2 : existingRow.sppu2;
        sppu3 = sppu3 !== undefined ? sppu3 : existingRow.sppu3;

        // Insert or update the record dynamically
        const query = `
            INSERT INTO Course_Target (course_id, dept_id, academic_yr, target1, target2, target3, sppu1, sppu2, sppu3)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                target1 = ?, target2 = ?, target3 = ?, sppu1 = ?, sppu2 = ?, sppu3 = ?;
        `;

        await db.execute(query, [
            course_id, dept_id, academic_yr, target1, target2, target3, sppu1, sppu2, sppu3,
            target1, target2, target3, sppu1, sppu2, sppu3 // Update values
        ]);

        return { message: "Targets updated successfully" };
    }
};

module.exports = Models;
