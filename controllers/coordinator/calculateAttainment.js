const db = require('../../db/db');

const Controllers = {
    // Update level targets for all course outcomes
    updateLevelTargets: async (req, res) => {
        try {
        
            // Extract parameters from the request body
            const { course_id, academic_yr, dept_id, modified_by } = req.body;

            // Validate required parameters
            if (!course_id || !academic_yr || !dept_id || !modified_by) {
                return res.status(400).json({ error: "Missing required parameters" });
            }

            // Call the function to update level targets
            await updateAllCourseOutcomes(course_id, academic_yr, dept_id, modified_by);

            // Send success response
            res.status(200).json({ message: "Level targets updated successfully" });
        } catch (error) {
            console.error("Error updating level targets:", error);
            res.status(500).json({ error: "Failed to update level targets", details: error.message });
        }
    }
};

// Your existing functions (updateLevelTarget and updateAllCourseOutcomes) go here
async function updateLevelTarget(course_id, academic_yr, course_outcome, dept_id, modified_by) {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Determine the column name dynamically
        let column_name;
        if (course_outcome.startsWith('u')) {
            column_name = 'ut';
        } else if (course_outcome.startsWith('i')) {
            column_name = 'insem';
        } else if (course_outcome === 'end_sem') {
            column_name = 'endsem';
        } else if (course_outcome === 'final_sem') {
            column_name = 'finalsem';
        } else {
            throw new Error("Invalid course outcome");
        }

        console.log(`Determined column_name: ${column_name}`);

        // Fetch the max marks for the course
        const [maxMarksResult] = await connection.query(`SELECT ?? FROM Course WHERE course_id = ?`, [column_name, course_id]);
        if (maxMarksResult.length === 0) {
            throw new Error("Course not found");
        }
        const max_marks = maxMarksResult[0][column_name];

        console.log(`Max marks for ${course_id}: ${max_marks}`);

        // Calculate thresholds
        let threshold_l1 = max_marks * 0.40;
        let threshold_l2 = max_marks * 0.60;
        let threshold_l3 = max_marks * 0.66;

        if (column_name === 'ut' || column_name === 'insem') {
            threshold_l1 /= 2;
            threshold_l2 /= 2;
            threshold_l3 /= 2;
        }

        console.log(`Thresholds - L1: ${threshold_l1}, L2: ${threshold_l2}, L3: ${threshold_l3}`);

        // Get total students
        const [totalStudentsResult] = await connection.query(`
      SELECT COUNT(*) AS total_students FROM marks 
      WHERE ${course_outcome} != 'AB' AND dept_id = ? AND academic_yr = ? AND course_id = ?`,
            [dept_id, academic_yr, course_id]
        );
        const total_students = totalStudentsResult[0].total_students || 1; // Avoid division by zero

        console.log(`Total students: ${total_students}`);

        // Get counts for levels
        const [levelCounts] = await connection.query(`
      SELECT 
        SUM(CASE WHEN ${course_outcome} >= ? THEN 1 ELSE 0 END) AS t_l1,
        SUM(CASE WHEN ${course_outcome} >= ? THEN 1 ELSE 0 END) AS t_l2,
        SUM(CASE WHEN ${course_outcome} >= ? THEN 1 ELSE 0 END) AS t_l3
      FROM marks
      WHERE ${course_outcome} != 'AB' AND dept_id = ? AND academic_yr = ? AND course_id = ?`,
            [threshold_l1, threshold_l2, threshold_l3, dept_id, academic_yr, course_id]
        );

        const { t_l1, t_l2, t_l3 } = levelCounts[0];

        console.log(`Level counts - t_l1: ${t_l1}, t_l2: ${t_l2}, t_l3: ${t_l3}`);

        // Calculate percentages
        const p_l1 = (t_l1 / total_students) * 100;
        const p_l2 = (t_l2 / total_students) * 100;
        const p_l3 = (t_l3 / total_students) * 100;

        console.log(`Percentages - p_l1: ${p_l1}, p_l2: ${p_l2}, p_l3: ${p_l3}`);

        // Get target levels dynamically based on course_outcome
        let targetColumns;
        if (course_outcome.startsWith('u')) {
            targetColumns = ['target1', 'target2', 'target3'];
        } else {
            targetColumns = ['sppu1', 'sppu2', 'sppu3'];
        }

        const [targets] = await connection.query(
            `SELECT ${targetColumns.join(',')} FROM Course_Target WHERE course_id = ?`,
            [course_id]
        );

        if (targets.length === 0) {
            throw new Error("Course target not found");
        }

        const [target1, target2, target3] = targetColumns.map(col => targets[0][col]);

        console.log(`Target levels - target1: ${target1}, target2: ${target2}, target3: ${target3}`);

        // Compute attainment levels
        const l1_a = (p_l1 / (target1 || 1)) * 1;
        const l2_a = (p_l2 / (target2 || 1)) * 2;
        const l3_a = (p_l3 / (target3 || 1)) * 3;

        console.log(`Attainment levels - l1_a: ${l1_a}, l2_a: ${l2_a}, l3_a: ${l3_a}`);

        // Final attainment levels with capping
        const l1_fa = Math.min(l1_a, 1);
        const l2_fa = Math.min(l2_a, 2);
        const l3_fa = Math.min(l3_a, 3);
        const ut_as = (l1_fa + l2_fa + l3_fa) / 6;

        console.log(`Final attainment levels - l1_fa: ${l1_fa}, l2_fa: ${l2_fa}, l3_fa: ${l3_fa}, ut_as: ${ut_as}`);

        // Insert or Update Level_Target
        await connection.query(`
      INSERT INTO Level_Target (
        course_id, academic_yr, course_outcome, dept_id, 
        t_l1, t_l2, t_l3, p_l1, p_l2, p_l3, 
        l1_a, l2_a, l3_a, l1_fa, l2_fa, l3_fa, ut_as, 
        modified_by, modified_on
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        t_l1 = VALUES(t_l1), t_l2 = VALUES(t_l2), t_l3 = VALUES(t_l3),
        p_l1 = VALUES(p_l1), p_l2 = VALUES(p_l2), p_l3 = VALUES(p_l3),
        l1_a = VALUES(l1_a), l2_a = VALUES(l2_a), l3_a = VALUES(l3_a),
        l1_fa = VALUES(l1_fa), l2_fa = VALUES(l2_fa), l3_fa = VALUES(l3_fa),
        ut_as = VALUES(ut_as), modified_by = VALUES(modified_by), modified_on = NOW()
    `, [
            course_id, academic_yr, course_outcome, dept_id,
            t_l1, t_l2, t_l3, p_l1, p_l2, p_l3,
            l1_a, l2_a, l3_a, l1_fa, l2_fa, l3_fa, ut_as,
            modified_by
        ]);

        await connection.commit();
        console.log("Level target updated successfully.");
    } catch (error) {
        await connection.rollback();
        console.error("Error updating level target:", error);
    } finally {
        connection.release();
    }
}

async function updateAllCourseOutcomes(course_id, academic_yr, dept_id, modified_by) {
    const connection = await db.getConnection();
    try {
        // Fetch all columns from the marks table
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'marks' 
            AND TABLE_SCHEMA = DATABASE()
            AND COLUMN_NAME NOT IN ('roll_no', 'course_id', 'sem', 'dept_id','academic_yr')
        `);

        // Iterate over each column and call updateLevelTarget
        for (const column of columns) {
            const course_outcome = column.COLUMN_NAME;
            console.log(`Processing course outcome: ${course_outcome}`);
            await updateLevelTarget(course_id, academic_yr, course_outcome, dept_id, modified_by);
        }
    } catch (error) {
        console.error("Error updating all course outcomes:", error);
    } finally {
        connection.release();
    }
}

module.exports = Controllers;