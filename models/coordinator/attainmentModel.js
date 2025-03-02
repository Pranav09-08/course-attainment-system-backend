const db = require("../../db/db"); // Import database connection

const AttainmentModel = {
    // Get courses coordinated by a faculty member
    getCoursesByCoordinator: async (faculty_id) => {
        const query = `
            SELECT 
        cc.course_id, 
        c.course_name,   -- Fetch course_name from Course table
        cc.class, 
        cc.sem, 
        d.dept_name,  -- Fetch dept_name from Department table
        cc.attainment_score, 
        cc.academic_yr 
        FROM Course_Coordinator AS cc
        JOIN Course AS c ON cc.course_id = c.course_id
        JOIN Department AS d ON cc.dept_id = d.dept_id  -- Join Department table
        WHERE cc.faculty_id = ?;

        `;

        try {
            const [result] = await db.execute(query, [faculty_id]);
            console.log('Courses by Coordinator Result:', result);  // Log the result to check
            return [result];
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },


    // Get 10 rows from Level_Target
    getLevelTargetByCourse: async (course_id, academic_yr) => {
        const query = `
            SELECT * FROM Level_Target 
            WHERE course_id = ? AND academic_yr = ?;
        `;
        const result = await db.execute(query, [course_id, academic_yr]);
        console.log('Level Target Result:', result);  // Log the result to check
        return result;
    },

    // Get 1 row from Calculate_Attainment
    getCalculateAttainmentByCourse: async (course_id, academic_yr) => {
        const query = `
            SELECT * FROM Calculate_Attainment 
            WHERE course_id = ? AND academic_yr = ?;
        `;
        const result = await db.execute(query, [course_id, academic_yr]);
        console.log('Calculate Attainment Result:', result);  // Log the result to check
        return result;
    },

    getCourseTargetByCourse: async (course_id, academic_yr, dept_id) => {
        const query = `
            SELECT * FROM Course_Target 
            WHERE course_id = ? AND academic_yr = ? AND dept_id = ?;
        `;
        const result = await db.execute(query, [course_id, academic_yr, dept_id]);
        console.log('Course Target Result:', result);  // Log the result to check
        return result;
    }
};

module.exports = AttainmentModel;
