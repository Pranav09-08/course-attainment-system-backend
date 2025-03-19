// models/CourseAttainment.js
const db = require('../../db/db'); // Assuming you have a database configuration

class CourseAttainment {
    static async getAttainmentByCourse(courseId) {
        const query = `
            SELECT * FROM course_attainment
            WHERE course_id = $1
            ORDER BY academic_yr DESC
            LIMIT 4;
        `;
        const values = [courseId];
        const { rows } = await db.query(query, values);
        return rows;
    }
}

module.exports = CourseAttainment;