const Models = require('../../models/coordinator/setTargetModel');

const Controllers = {
    // Get courses assigned to a faculty
    getCourses: async (req, res) => {
        try {
            if (req.user.role !== "coordinator") {
                return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
            }

            const { faculty_id } = req.params;
            const courses = await Models.getCoursesByFaculty(faculty_id);
            res.json(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ error: 'Database error' });
        }
    },

    // Set course targets
    setTargets: async (req, res) => {
        console.log("Received body:", req.body);

        try {
            // Role check
            if (req.user.role !== "coordinator") {
                return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
            }

            const { course_id, dept_id, academic_yr } = req.body;

            // Basic validation
            if (!course_id || !dept_id || !academic_yr) {
                return res.status(400).json({ msg: "Missing course_id, dept_id, or academic_yr in request body." });
            }

            // Call model function
            const result = await Models.setCourseTargets(req.body);
            res.json(result);
        } catch (error) {
            console.error("Error updating targets:", error);
            res.status(500).json({ error: "Database error. Please check your input or server logs." });
        }
    }


};

module.exports = Controllers;
