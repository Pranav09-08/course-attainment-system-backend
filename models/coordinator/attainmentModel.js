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
        d.dept_id,
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
            SELECT d.dept_name,ca.course_id, 
    ca.academic_yr, 
    ca.ut_attainment, 
    ca.insem_attainment, 
    ca.endsem_attainment, 
    ca.final_attainment, 
    ca.total  -- Select all columns from Calculate_Attainment and add dept_name
FROM Calculate_Attainment AS ca
LEFT JOIN Department AS d ON ca.dept_id = d.dept_id  -- Join with Department table
WHERE ca.course_id = ? AND ca.academic_yr = ?;

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
    },

    // Get faculty information by course_id, dept_id, and academic_yr
    getFacultyInfoByCourse: async (course_id, dept_id, academic_yr) => {
        const query = `
            SELECT 
                f.faculty_id, 
                f.name, 
                f.email, 
                f.mobile_no, 
                f.dept_id, 
                f.password, 
                ca.course_id, 
                ca.class, 
                ca.sem, 
                ca.academic_yr
            FROM Faculty AS f
            JOIN Course_Allotment AS ca ON f.faculty_id = ca.faculty_id
            WHERE ca.course_id = ? AND ca.dept_id = ? AND ca.academic_yr = ?;
        `;
        
        try {
            const [result] = await db.execute(query, [course_id, dept_id, academic_yr]);
            console.log('Faculty Info Result:', result);  // Log the result to check
            return result;  // Return the result
        } catch (error) {
            console.error('Error fetching faculty info:', error);
            throw error;  // Throw the error if any
        }
    }
};

module.exports = AttainmentModel;
