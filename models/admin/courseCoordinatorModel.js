const db = require("../../db/db");

// 🟢 Function to allot course coordinator
async function allotCourseCoordinator(courseData) {
  const {
    course_id,
    faculty_id,
    class: className,
    sem,
    dept_id,
    attainment_score,
    academic_yr,
  } = courseData;

  try {
    // 🔍 Validate Missing Fields
    if (!course_id) throw new Error("course_id is required");
    if (!faculty_id) throw new Error("faculty_id is required");
    if (!className) throw new Error("class is required");
    if (!sem) throw new Error("sem is required");
    if (!dept_id) throw new Error("dept_id is required");
    if (!academic_yr) throw new Error("academic_yr is required");

    // 🔍 Check if Faculty ID Exists
    const facultyCheckQuery = `SELECT * FROM Faculty WHERE faculty_id = ?`;
    const [faculty] = await db.query(facultyCheckQuery, [faculty_id]);

    if (faculty.length === 0) {
      throw new Error("Faculty ID does not exist");
    }

    // 🔍 Check if Course ID Exists
    const courseCheckQuery = `SELECT * FROM Course WHERE course_id = ?`;
    const [course] = await db.query(courseCheckQuery, [course_id]);

    if (course.length === 0) {
      throw new Error("Course ID does not exist");
    }

    // ❌ **Check if Course ID, Dept ID, and Academic Year Already Exist (Uniqueness Check)**
    const uniqueCheckQuery = `
            SELECT * FROM Course_Coordinator 
            WHERE course_id = ? AND dept_id = ? AND academic_yr = ?
        `;
    const [existing] = await db.query(uniqueCheckQuery, [
      course_id,
      dept_id,
      academic_yr,
    ]);

    if (existing.length > 0) {
      throw new Error(
        "A coordinator is already assigned for this course in the same department and academic year."
      );
    }

    // ✅ Insert new allotment
    const insertQuery = `
            INSERT INTO Course_Coordinator (course_id, faculty_id, class, sem, dept_id, attainment_score, academic_yr) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const [result] = await db.query(insertQuery, [
      course_id,
      faculty_id,
      className,
      sem,
      dept_id,
      attainment_score,
      academic_yr,
    ]);

    return { id: result.insertId, ...courseData };
  } catch (err) {
    throw err;
  }
}

// 🟢 Fetch Course Coordinators by Department
async function getCourseCoordinatorsByDept(dept_id) {
  try {
    if (!dept_id) throw new Error("Department ID is required");

    const query = `
    SELECT cc.course_id, c.course_name, cc.faculty_id, f.name AS faculty_name, 
           cc.class, cc.sem, cc.dept_id, cc.attainment_score, cc.academic_yr
    FROM Course_Coordinator cc
    JOIN Faculty f ON cc.faculty_id = f.faculty_id
    JOIN Course c ON cc.course_id = c.course_id  -- 🔹 Fetch course_name from Course table
    WHERE cc.dept_id = ?
`;

    const [result] = await db.query(query, [dept_id]);

    return result;
  } catch (err) {
    throw err;
  }
}

// 🟢 Function to update faculty_id for a course coordinator
const updateCourseCoordinatorFaculty = async (courseId, academicYr, sem, newFacultyId) => {
  try {
      // Validate input
      if (!courseId || !academicYr || !sem || !newFacultyId) {
          throw new Error("courseId, academicYr, sem, and newFacultyId are required");
      }

      // Check if the new faculty exists
      const [faculty] = await db.query(`SELECT * FROM Faculty WHERE faculty_id = ?`, [newFacultyId]);
      if (faculty.length === 0) {
          throw new Error("New faculty ID does not exist");
      }

      // Check if the course coordinator exists
      const [existing] = await db.query(
          `SELECT * FROM Course_Coordinator WHERE course_id = ? AND academic_yr = ? AND sem = ?`,
          [courseId, academicYr, sem]
      );
      if (existing.length === 0) {
          throw new Error("Course coordinator not found");
      }

      // Update faculty_id
      const [result] = await db.query(
          `UPDATE Course_Coordinator SET faculty_id = ? WHERE course_id = ? AND academic_yr = ? AND sem = ?`,
          [newFacultyId, courseId, academicYr, sem]
      );

      if (result.affectedRows === 0) {
          throw new Error("Failed to update faculty ID");
      }

      return { courseId, academicYr, sem, newFacultyId };
  } catch (err) {
      throw err;
  }
};

// 🟢 Function to delete a course coordinator
const deleteCourseCoordinator = async (courseId, academicYr, sem) => {
  try {
    // Validate input
    if (!courseId || !academicYr || !sem) {
      throw new Error("courseId, academicYr, and sem are required");
    }

    // Check if the course coordinator exists
    const [existing] = await db.query(
      `SELECT * FROM Course_Coordinator WHERE course_id = ? AND academic_yr = ? AND sem = ?`,
      [courseId, academicYr, sem]
    );

    if (existing.length === 0) {
      throw new Error("Course coordinator not found");
    }

    // Delete the course coordinator
    const [result] = await db.query(
      `DELETE FROM Course_Coordinator WHERE course_id = ? AND academic_yr = ? AND sem = ?`,
      [courseId, academicYr, sem]
    );

    if (result.affectedRows === 0) {
      throw new Error("Failed to delete course coordinator");
    }

    return { courseId, academicYr, sem };
  } catch (err) {
    throw err;
  }
};

// ✅ Export functions separately
module.exports = { allotCourseCoordinator, getCourseCoordinatorsByDept, updateCourseCoordinatorFaculty, deleteCourseCoordinator };
