// controllers/CourseAttainmentController.js
const CourseAttainment = require('../../models/admin/attainmentAnalysis');

class CourseAttainmentController {
    static async getAttainment(req, res) {
        try {
            const { courseId } = req.params;
            const data = await CourseAttainment.getAttainmentByCourse(courseId);
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = CourseAttainmentController;