const db = require('../../db/db'); // Adjust path if needed

class CourseAttainment {
    static async getAttainmentByCourse(courseId) {
        const query = `
            SELECT course_id, dept_id, academic_yr, ut_attainment, 
                   insem_attainment, endsem_attainment, final_attainment, total
            FROM Calculate_Attainment
            WHERE course_id = ?
            ORDER BY academic_yr DESC
            LIMIT 4;
        `;
        const [rows] = await db.query(query, [courseId]);
        return rows;
    }
}

module.exports = CourseAttainment;
