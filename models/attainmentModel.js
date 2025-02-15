const db = require("../db/db"); // Import database connection

const AttainmentModel = {
    // Get courses coordinated by a faculty member
    getCoursesByCoordinator: async (faculty_id) => {
        const query = `
            SELECT course_id, class, sem, dept_id, attainment_score, academic_yr 
            FROM Course_Coordinator WHERE faculty_id = ?;
        `;
        return db.execute(query, [faculty_id]);
    },

    // Get 10 rows from Level_Target
    getLevelTargetByCourse: async (course_id, academic_yr) => {
        const query = `
            SELECT * FROM Level_Target 
            WHERE course_id = ? AND academic_yr = ?;
        `;
        return db.execute(query, [course_id, academic_yr]);
    },

    // Get 1 row from Calculate_Attainment
    getCalculateAttainmentByCourse: async (course_id, academic_yr) => {
        const query = `
            SELECT * FROM Calculate_Attainment 
            WHERE course_id = ? AND academic_yr = ?;
        `;
        return db.execute(query, [course_id, academic_yr]);
    }
};

module.exports = AttainmentModel;
