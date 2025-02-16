const Models = require('../../models/coordinator/setTargetModel');

const Controllers = {
    // Get courses assigned to a faculty
    getCourses: async (req, res) => {
        try {
            if(req.user.role !== "coordinator") {
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
        try {
            if(req.user.role !== "coordinator") {
                return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
            }
            const result = await Models.setCourseTargets(req.body);
            res.json(result);
        } catch (error) {
            console.error("Error updating targets:", error);
            res.status(500).json({ error: 'Database error' });
        }
    }
};

module.exports = Controllers;
