const db = require('../../db/db');

const Models = {
    // Fetch courses assigned to a faculty
    getCoursesByFaculty: async (faculty_id) => {
        const query = `
            SELECT c.course_id, c.class, c.sem, c.dept_id, c.attainment_score, c.academic_yr,
                   ct.target1, ct.target2, ct.target3, ct.sppu1, ct.sppu2, ct.sppu3, co.course_name
            FROM Course_Coordinator AS c
            LEFT JOIN Course_Target AS ct ON c.course_id = ct.course_id AND c.academic_yr = ct.academic_yr
            LEFT JOIN Course AS co ON c.course_id = co.course_id  -- Join with the Course table to get course_name
            WHERE c.faculty_id = ?;
        `;
        const [courses] = await db.execute(query, [faculty_id]);
        return courses;
    },
    
    // Set or update course targets
    setCourseTargets: async ({ course_id, dept_id, academic_yr, target1, target2, target3, sppu1, sppu2, sppu3 }) => {
        const query = `
            INSERT INTO Course_Target (course_id, dept_id, academic_yr, target1, target2, target3, sppu1, sppu2, sppu3)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                target1 = VALUES(target1), target2 = VALUES(target2), target3 = VALUES(target3),
                sppu1 = VALUES(sppu1), sppu2 = VALUES(sppu2), sppu3 = VALUES(sppu3);
        `;
        await db.execute(query, [course_id, dept_id, academic_yr, target1, target2, target3, sppu1, sppu2, sppu3]);
        return { message: "Targets updated successfully" };
    }
};

module.exports = Models;
