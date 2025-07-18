
const db = require('../../db/db');

// Function to check if table exists or create it
const checkOrCreateTable = async (sem, academic_yr) => {
  const tableName = `Student_${sem.toLowerCase()}_${academic_yr.replace(/\//g, '_')}`;
  
  const checkTableQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = DATABASE() 
    AND table_name = ?;
  `;
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ?? (
      roll_no VARCHAR(20) PRIMARY KEY,
      seat_no VARCHAR(20),
      name VARCHAR(100) NOT NULL,
      dept_id INT NOT NULL,
      class VARCHAR(10) NOT NULL,
      sem VARCHAR(10) NOT NULL,
      academic_yr VARCHAR(20) NOT NULL,
      el1 VARCHAR(100),
      el2 VARCHAR(100),
      FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
    );
  `;

  try {
    const [result] = await db.query(checkTableQuery, [tableName]);
    if (result.length === 0) {
      await db.query(createTableQuery, [tableName]);
      console.log(`Created table ${tableName}`);
    }
    return tableName;
  } catch (err) {
    console.error(`Error creating table ${tableName}:`, err);
    throw err;
  }
};

const insertStudents = async (students, sem, academic_yr) => {
  const tableName = await checkOrCreateTable(sem, academic_yr);
  
  // First get existing roll numbers to filter out duplicates
  const existingRollNos = await getExistingRollNos(tableName);
  
  // Filter out duplicates
  const newStudents = students.filter(student => 
    !existingRollNos.includes(student.roll_no)
  );

  if (newStudents.length === 0) {
    return {
      success: true,
      insertedCount: 0,
      duplicateCount: students.length,
      duplicateRollNos: students.map(s => s.roll_no),
      tableName,
      warning: `All ${students.length} students already exist in database`
    };
  }

  const query = `
    INSERT INTO ?? 
    (roll_no, seat_no, name, dept_id, class, sem, academic_yr, el1, el2)
    VALUES ?
  `;

  const values = newStudents.map(student => [
    student.roll_no,
    student.seat_no || null,
    student.name,
    student.dept_id,
    student.class,
    sem,
    academic_yr,
    student.el1 || null,
    student.el2 || null
  ]);

  try {
    const [result] = await db.query(query, [tableName, values]);
    return { 
      success: true,
      insertedCount: result.affectedRows,
      duplicateCount: students.length - result.affectedRows,
      duplicateRollNos: students
        .filter(student => !newStudents.includes(student))
        .map(s => s.roll_no),
      tableName,
      warning: (students.length - result.affectedRows) > 0 ? 
        `${students.length - result.affectedRows} duplicate entries skipped` : 
        null
    };
  } catch (err) {
    console.error('Bulk insert error:', err);
    // Fallback to individual inserts if bulk insert fails
    return handleIndividualInserts(students, tableName, sem, academic_yr);
  }
};

// Helper function to get existing roll numbers
const getExistingRollNos = async (tableName) => {
  const query = `SELECT roll_no FROM ??`;
  try {
    const [rows] = await db.query(query, [tableName]);
    return rows.map(row => row.roll_no);
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return []; // Return empty array if table doesn't exist
    }
    throw err;
  }
};

// Handle individual student inserts
const handleIndividualInserts = async (students, tableName, sem, academic_yr) => {
  const existingRollNos = await getExistingRollNos(tableName);
  let insertedCount = 0;
  let duplicateCount = 0;
  const duplicateRollNos = [];
  
  for (const student of students) {
    try {
      // Skip if already exists
      if (existingRollNos.includes(student.roll_no)) {
        duplicateCount++;
        duplicateRollNos.push(student.roll_no);
        continue;
      }

      const [result] = await db.query(
        `INSERT INTO ?? 
         (roll_no, seat_no, name, dept_id, class, sem, academic_yr, el1, el2)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tableName,
          student.roll_no,
          student.seat_no || null,
          student.name,
          student.dept_id,
          student.class,
          sem,
          academic_yr,
          student.el1 || null,
          student.el2 || null
        ]
      );
      insertedCount += result.affectedRows;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        duplicateCount++;
        duplicateRollNos.push(student.roll_no);
      } else {
        throw err; // Re-throw other errors
      }
    }
  }

  return {
    success: true,
    insertedCount,
    duplicateCount,
    duplicateRollNos,
    tableName,
    warning: duplicateCount > 0 ? 
      `${duplicateCount} duplicate entries skipped (Roll Nos: ${duplicateRollNos.join(', ')})` : 
      null
  };
};

// Function to fetch students by department and academic year
const fetchStudentsByDepartment = async (dept_id, sem, academic_yr) => {
  const tableName = `Student_${sem.toLowerCase()}_${academic_yr}`;
  
  const query = `
    SELECT 
      roll_no, 
      seat_no,
      name, 
      class,
      sem,
      academic_yr,
      el1,
      el2
    FROM ??
    WHERE dept_id = ?;
  `;

  try {
    const [students] = await db.query(query, [tableName, dept_id]);
    return students;
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return []; // Return empty array if table doesn't exist
    }
    throw err;
  }
};

// Function to update a student
const updateStudent = async (roll_no, updatedData, sem, academic_yr) => {
  const tableName = `Student_${sem.toLowerCase()}_${academic_yr}`;
  
  const query = `
    UPDATE ??
    SET ?
    WHERE roll_no = ?;
  `;

  const values = {
    name: updatedData.name,
    seat_no: updatedData.seat_no || null,
    ...(updatedData.el1 && { el1: updatedData.el1 }),
    ...(updatedData.el2 && { el2: updatedData.el2 })
  };

  try {
    const [result] = await db.query(query, [tableName, values, roll_no]);
    return result;
  } catch (err) {
    throw err;
  }
};

// Function to delete a student
const deleteStudent = async (roll_no, sem, academic_yr) => {
  const tableName = `Student_${sem.toLowerCase()}_${academic_yr}`;
  
  const query = `
    DELETE FROM ??
    WHERE roll_no = ?;
  `;

  try {
    const [result] = await db.query(query, [tableName, roll_no]);
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = { 
  insertStudents, 
  fetchStudentsByDepartment, 
  updateStudent, 
  deleteStudent 
};