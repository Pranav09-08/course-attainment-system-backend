const CourseAttainment = require('../../models/admin/attainmentAnalysis');

class CourseAttainmentController {
    static async getAttainment(req, res) {
        try {
            const { courseId } = req.params;

            if (!courseId) {
                return res.status(400).json({ message: "Course ID is required" });
            }

            const data = await CourseAttainment.getAttainmentByCourse(courseId);

            if (data.length === 0) {
                return res.status(404).json({ message: "No attainment data found for the given course" });
            }

            res.json(data);
        } catch (error) {
            console.error("Error fetching attainment data:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = CourseAttainmentController;
