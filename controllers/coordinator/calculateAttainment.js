const db = require('../../db/db');

const Controllers = {
    // Update level targets for all course outcomes
    updateLevelTargets: async (req, res) => {
        try {

            if (req.user.role !== "coordinator") {
            return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
            }

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

        // if (req.user.role !== "coordinator") {
        //     return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
        // } 

        await connection.beginTransaction();

        // if (req.user.role !== "coordinator") {
        //     return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
        // }

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

async function updateCalculateAttainment(course_id, academic_yr, dept_id) {
    const connection = await db.getConnection();
    try {

        // if (req.user.role !== "coordinator") {
        //     return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
        // }

        await connection.beginTransaction();

        // Fetch attainment values from Level_Target
        const [attainmentRows] = await connection.query(
            `SELECT course_outcome, ut_as 
             FROM Level_Target 
             WHERE course_id = ? AND academic_yr = ? AND dept_id = ?`,
            [course_id, academic_yr, dept_id]
        );

        if (attainmentRows.length === 0) {
            throw new Error("No attainment data found for the given course.");
        }

        // Initialize arrays to store UT and InSem attainments
        let ut_attainments = [];
        let insem_attainments = [];
        let endsem_attainment = 0;
        let final_attainment = 0;

        // Categorize attainments
        attainmentRows.forEach(row => {
            if (row.course_outcome.startsWith('u')) {
                ut_attainments.push(parseFloat(row.ut_as)); // Convert to number
            } else if (row.course_outcome.startsWith('i')) {
                insem_attainments.push(parseFloat(row.ut_as)); // Convert to number
            } else if (row.course_outcome === 'end_sem') {
                endsem_attainment = parseFloat(row.ut_as); // Convert to number
            } else if (row.course_outcome === 'final_sem') {
                final_attainment = parseFloat(row.ut_as); // Convert to number
            }
        });

        // Debug: Log the arrays to see their contents
        console.log("UT Attainments:", ut_attainments);
        console.log("InSem Attainments:", insem_attainments);

        // Calculate UT attainment as the average of all UT-related attainments
        const ut_attainment = ut_attainments.length > 0
            ? ut_attainments.reduce((sum, val) => sum + val, 0) / ut_attainments.length
            : 0; // Default to 0 if no UT attainments

        // Calculate InSem attainment as the average of all InSem-related attainments
        const insem_attainment = insem_attainments.length > 0
            ? insem_attainments.reduce((sum, val) => sum + val, 0) / insem_attainments.length
            : 0; // Default to 0 if no InSem attainments

        // Debug: Log the calculated averages
        console.log(`Calculated UT Attainment: ${ut_attainment}`);
        console.log(`Calculated InSem Attainment: ${insem_attainment}`);

        // Calculate total attainment
        const total = ut_attainment * 0.3 + final_attainment * 0.7;

        console.log(`EndSem: ${endsem_attainment}, Final: ${final_attainment}, Total: ${total}`);

        // Replace NaN with NULL or 0
        const sanitizeValue = (value) => isNaN(value) ? null : value;

        // Insert or update the Calculate_Attainment table
        await connection.query(`
            INSERT INTO Calculate_Attainment (course_id, dept_id, academic_yr, ut_attainment, insem_attainment, endsem_attainment, final_attainment, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                ut_attainment = VALUES(ut_attainment), 
                insem_attainment = VALUES(insem_attainment), 
                endsem_attainment = VALUES(endsem_attainment), 
                final_attainment = VALUES(final_attainment), 
                total = VALUES(total)
        `, [
            course_id, dept_id, academic_yr,
            sanitizeValue(ut_attainment),
            sanitizeValue(insem_attainment),
            sanitizeValue(endsem_attainment),
            sanitizeValue(final_attainment),
            sanitizeValue(total)
        ]);

        await connection.commit();
        console.log("Calculate_Attainment table updated successfully.");
    } catch (error) {
        await connection.rollback();
        console.error("Error updating Calculate_Attainment:", error);
    } finally {
        connection.release();
    }
}



async function updateAllCourseOutcomes(course_id, academic_yr, dept_id, modified_by) {
    const connection = await db.getConnection();
    try {

        // if (req.user.role !== "coordinator") {
        //     return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
        // }
        
        // Fetch all columns from the marks table
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'marks' 
            AND TABLE_SCHEMA = DATABASE()
            AND COLUMN_NAME NOT IN ('roll_no', 'course_id', 'sem', 'dept_id','academic_yr')
        `);

        // Use Promise.all to wait for all updateLevelTarget calls to complete
        await Promise.all(columns.map(async (column) => {
            const course_outcome = column.COLUMN_NAME;
            console.log(`Processing course outcome: ${course_outcome}`);
            await updateLevelTarget(course_id, academic_yr, course_outcome, dept_id, modified_by);
        }));

        // Now that all course outcomes have been updated, call updateCalculateAttainment
        await updateCalculateAttainment(course_id, academic_yr, dept_id);
    } catch (error) {
        console.error("Error updating all course outcomes:", error);
    } finally {
        connection.release();
    }
}

module.exports = Controllers;