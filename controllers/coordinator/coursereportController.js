const xlsx = require('xlsx');
const fs = require('fs');
const courseReportModel = require('../../models/coordinator/courseReportModel');

// Handle GET request to generate the report
const getmarksTarget = async (req, res) => {
  const { courseId, deptId, academicYear,sem } = req.query;

  if (req.user.role !== "coordinator") {
            return res.status(403).json({ msg: "Access denied. Only Coordinator can access this." });
        }

  if (!courseId || !deptId || !academicYear ||!sem) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    // Fetch course target data
    const targetData = await courseReportModel.getCourseTarget(courseId, deptId, academicYear);
    if (targetData.length === 0) {
      return res.status(404).send('No target data found');
    }
    const target = targetData[0];
    console.log('Target Data:', target);

    // Fetch marks data
    const marksData = await courseReportModel.getMarksData(courseId, deptId, academicYear,sem);
    if (marksData.length === 0) {
      return res.status(404).send('No marks data found');
    }
    // console.log('Marks Data:', marksData);

    // Prepare response with only target and marks data
    const responseData = {
      target: {
        target1: target.target1,
        sppu1: target.sppu1,
        target2: target.target2,
        sppu2: target.sppu2,
        target3: target.target3,
        sppu3: target.sppu3,
      },
      marks: marksData.map((mark) => ({
        rollNo: mark.roll_no,
        studentName: mark.student_name,
        co1: mark.u1_co1,
        co2: mark.u1_co2,
        co3: mark.u2_co3,
        co4: mark.u2_co4,
        co5: mark.u3_co5,
        co6: mark.u3_co6,
        ico1: mark.i_co1,
        ico2: mark.i_co2,
        endSem: mark.end_sem,
        finalSem: mark.final_sem,
      })),
    };

    // Send the response with target and marks data
    res.status(200).json({
      success: true,
      message: 'Report data fetched successfully',
      data: responseData,
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).send('Error generating report');
  }
};

const downladReport = async (req, res) => {
  const { courseId, deptId, academicYear,sem } = req.query;

  if (!courseId || !deptId || !academicYear || !sem) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    // Fetch course target data
    const targetData = await courseReportModel.getCourseTarget(courseId, deptId, academicYear);
    if (targetData.length === 0) {
      return res.status(404).send('No target data found');
    }
    const target = targetData[0];
    console.log('Target Data:', target);

    // Fetch marks data
    const marksData = await courseReportModel.getMarksData(courseId, deptId, academicYear,sem);
    if (marksData.length === 0) {
      return res.status(404).send('No marks data found');
    }
    console.log('Marks Data:', marksData);

    // Fetch Level Target data
    const levelTargetData = await courseReportModel.getLevelTarget(courseId, deptId, academicYear);
    if (levelTargetData.length === 0) {
      return res.status(404).send('No level target data found');
    }
    console.log('Level Target Data:', levelTargetData);

    // Prepare target data for the Excel sheet
    const targetSheetData = [
      ['Target', 'Unit Test', 'SPPU'],
      ['Level 3', target.target3, target.sppu3],
      ['Level 2', target.target2, target.sppu2],
      ['Level 1', target.target1, target.sppu1],
    ];
    console.log('Target Sheet Data:', targetSheetData);

    // Shift target table by 4 columns to center it
    const shiftAmount = 4;
    const centeredTargetSheetData = targetSheetData.map(row => {
      const shiftedRow = Array(shiftAmount).fill(''); // Create empty cells to shift the data
      return shiftedRow.concat(row); // Concatenate empty cells with the original row
    });

    console.log('Centered Target Sheet Data:', centeredTargetSheetData);

    // Prepare marks data for the Excel sheet
    const marksSheetHeaders = ['Sr. No.', 'Roll No.', 'Name', 'CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6', 'I_CO1', 'I_CO2', 'End Sem', 'Final Sem'];
    const marksSheetData = marksData.map((mark, index) => [
      index + 1,
      mark.roll_no,
      mark.student_name,
      mark.u1_co1,
      mark.u1_co2,
      mark.u2_co3,
      mark.u2_co4,
      mark.u3_co5,
      mark.u3_co6,
      mark.i_co1,
      mark.i_co2,
      mark.end_sem,
      mark.final_sem,
    ]);
    console.log('Marks Sheet Data:', marksSheetData);

    // Ensure marksSheetData is not empty
    if (marksSheetData.length === 0) {
      console.log('Error: Marks sheet data is empty');
      return res.status(500).send('Marks data is empty');
    }

    // Prepare Level Target data for the Excel sheet
    const levelTargetSheetData = [
      ['Metrics', 'u1_co1', 'u1_co2', 'u2_co3', 'u2_co4', 'u3_co5', 'u3_co6', 'i_co1', 'i_co2', 'end_sem', 'final_sem'],
      ['Target no of students for level 1', levelTargetData[0].t_l1, levelTargetData[1].t_l1, levelTargetData[2].t_l1, levelTargetData[3].t_l1, levelTargetData[4].t_l1, levelTargetData[5].t_l1, levelTargetData[6].t_l1, levelTargetData[7].t_l1, levelTargetData[8].t_l1, levelTargetData[9].t_l1],
      ['Target no of students for level 2', levelTargetData[0].t_l2, levelTargetData[1].t_l2, levelTargetData[2].t_l2, levelTargetData[3].t_l2, levelTargetData[4].t_l2, levelTargetData[5].t_l2, levelTargetData[6].t_l2, levelTargetData[7].t_l2, levelTargetData[8].t_l2, levelTargetData[9].t_l2],
      ['Target no of students for level 3', levelTargetData[0].t_l3, levelTargetData[1].t_l3, levelTargetData[2].t_l3, levelTargetData[3].t_l3, levelTargetData[4].t_l3, levelTargetData[5].t_l3, levelTargetData[6].t_l3, levelTargetData[7].t_l3, levelTargetData[8].t_l3, levelTargetData[9].t_l3],
      ['% of students for level 1 (>40%)', levelTargetData[0].p_l1, levelTargetData[1].p_l1, levelTargetData[2].p_l1, levelTargetData[3].p_l1, levelTargetData[4].p_l1, levelTargetData[5].p_l1, levelTargetData[6].p_l1, levelTargetData[7].p_l1, levelTargetData[8].p_l1, levelTargetData[9].p_l1],
      ['% of students for level 2 (>60%)', levelTargetData[0].p_l2, levelTargetData[1].p_l2, levelTargetData[2].p_l2, levelTargetData[3].p_l2, levelTargetData[4].p_l2, levelTargetData[5].p_l2, levelTargetData[6].p_l2, levelTargetData[7].p_l2, levelTargetData[8].p_l2, levelTargetData[9].p_l2],
      ['% of students for level 3 (>66%)', levelTargetData[0].p_l3, levelTargetData[1].p_l3, levelTargetData[2].p_l3, levelTargetData[3].p_l3, levelTargetData[4].p_l3, levelTargetData[5].p_l3, levelTargetData[6].p_l3, levelTargetData[7].p_l3, levelTargetData[8].p_l3, levelTargetData[9].p_l3],
      ['Level 1 Att', levelTargetData[0].l1_a, levelTargetData[1].l1_a, levelTargetData[2].l1_a, levelTargetData[3].l1_a, levelTargetData[4].l1_a, levelTargetData[5].l1_a, levelTargetData[6].l1_a, levelTargetData[7].l1_a, levelTargetData[8].l1_a, levelTargetData[9].l1_a],
      ['Level 2 Att', levelTargetData[0].l2_a, levelTargetData[1].l2_a, levelTargetData[2].l2_a, levelTargetData[3].l2_a, levelTargetData[4].l2_a, levelTargetData[5].l2_a, levelTargetData[6].l2_a, levelTargetData[7].l2_a, levelTargetData[8].l2_a, levelTargetData[9].l2_a],
      ['Level 3 Att', levelTargetData[0].l3_a, levelTargetData[1].l3_a, levelTargetData[2].l3_a, levelTargetData[3].l3_a, levelTargetData[4].l3_a, levelTargetData[5].l3_a, levelTargetData[6].l3_a, levelTargetData[7].l3_a, levelTargetData[8].l3_a, levelTargetData[9].l3_a],
      ['Level 1 Final Att', levelTargetData[0].l1_fa, levelTargetData[1].l1_fa, levelTargetData[2].l1_fa, levelTargetData[3].l1_fa, levelTargetData[4].l1_fa, levelTargetData[5].l1_fa, levelTargetData[6].l1_fa, levelTargetData[7].l1_fa, levelTargetData[8].l1_fa, levelTargetData[9].l1_fa],
      ['Level 2 Final Att', levelTargetData[0].l2_fa, levelTargetData[1].l2_fa, levelTargetData[2].l2_fa, levelTargetData[3].l2_fa, levelTargetData[4].l2_fa, levelTargetData[5].l2_fa, levelTargetData[6].l2_fa, levelTargetData[7].l2_fa, levelTargetData[8].l2_fa, levelTargetData[9].l2_fa],
      ['Level 3 Final Att', levelTargetData[0].l3_fa, levelTargetData[1].l3_fa, levelTargetData[2].l3_fa, levelTargetData[3].l3_fa, levelTargetData[4].l3_fa, levelTargetData[5].l3_fa, levelTargetData[6].l3_fa, levelTargetData[7].l3_fa, levelTargetData[8].l3_fa, levelTargetData[9].l3_fa],
      ['UT/Asgnt attainment', levelTargetData[0].ut_as, levelTargetData[1].ut_as, levelTargetData[2].ut_as, levelTargetData[3].ut_as, levelTargetData[4].ut_as, levelTargetData[5].ut_as, levelTargetData[6].ut_as, levelTargetData[7].ut_as, levelTargetData[8].ut_as, levelTargetData[9].ut_as]
    ];
    

    // Create the workbook
    const wb = xlsx.utils.book_new();

    // Convert centered target data to sheet format
    const targetSheet = xlsx.utils.aoa_to_sheet(centeredTargetSheetData);

    // Add 3-4 empty rows after the target table to separate the tables
    const rowsToAdd = 4;
    const emptyRows = Array(rowsToAdd).fill([]); // Create distinct empty rows

    // Combine data into the correct format: target data, empty rows, headers, marks data, and level target data
    const combinedData = [
      ...centeredTargetSheetData,  // Centered target data
      ...emptyRows,                // Empty rows
      marksSheetHeaders,           // Marks headers
      ...marksSheetData,           // Marks data
      ...emptyRows,                // Empty rows after marks
      ...levelTargetSheetData,     // Level target data
    ];

    // Ensure combinedData is a proper array of arrays
    if (!Array.isArray(combinedData) || !combinedData.every(row => Array.isArray(row))) {
      return res.status(500).send('Combined data is not in the expected format');
    }

    console.log("Combined Data: ", combinedData);

    // Convert combined data to sheet format
    const combinedSheet = xlsx.utils.aoa_to_sheet(combinedData);

    // Add combined data to the workbook
    xlsx.utils.book_append_sheet(wb, combinedSheet, 'Course Report');

    // Save the workbook as a file
    const filePath = `./course_report_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, filePath);
    console.log('File created at:', filePath);

    // Check if the file exists before attempting to send it
    if (fs.existsSync(filePath)) {
      console.log('File exists, sending download');
      res.download(filePath, 'course_report.xlsx', (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        fs.unlinkSync(filePath); // Optional: Delete the file after sending it to the client
      });
    } else {
      console.log('Error: File does not exist at the specified path');
      res.status(500).send('Error: File not created');
    }
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).send('Error generating report');
  }
};

const generateReport = async (req, res) => {
  const { courseId, deptId, academicYear,sem } = req.query;
  
  if (!courseId || !deptId || !academicYear) {
    return res.status(400).send('Missing required parameters');
  }

  let error = null;
  let responseData = { target: null, marks: [], levelTarget: [] };

  try {
    // Fetch course target data
    const targetData = await courseReportModel.getCourseTarget(courseId, deptId, academicYear);
    if (targetData.length === 0) {
      error = 'Some data could not be retrieved';
    } else {
      responseData.target = {
        target1: targetData[0].target1,
        sppu1: targetData[0].sppu1,
        target2: targetData[0].target2,
        sppu2: targetData[0].sppu2,
        target3: targetData[0].target3,
        sppu3: targetData[0].sppu3,
      };
    }
  } catch (err) {
    console.error('Error fetching target data:', err);
    error = 'Some data could not be retrieved';
  }

  try {
    // Fetch marks data
    const marksData = await courseReportModel.getMarksData(courseId, deptId, academicYear,sem);
    if (marksData.length === 0) {
      error = 'Some data could not be retrieved';
    } else {
      responseData.marks = marksData.map((mark) => ({
        rollNo: mark.roll_no,
        studentName: mark.student_name,
        co1: mark.u1_co1,
        co2: mark.u1_co2,
        co3: mark.u2_co3,
        co4: mark.u2_co4,
        co5: mark.u3_co5,
        co6: mark.u3_co6,
        ico1: mark.i_co1,
        ico2: mark.i_co2,
        endSem: mark.end_sem,
        finalSem: mark.final_sem,
      }));
    }
  } catch (err) {
    console.error('Error fetching marks data:', err);
    error = 'Some data could not be retrieved';
  }

  try {
    // Fetch Level Target data
    const levelTargetData = await courseReportModel.getLevelTarget(courseId, deptId, academicYear);
    if (levelTargetData.length === 0) {
      error = 'Some data could not be retrieved';
    } else {
      responseData.levelTarget = levelTargetData;
    }
  } catch (err) {
    console.error('Error fetching level target data:', err);
    error = 'Some data could not be retrieved';
  }

  // Send the response with available data and a single error message if needed
  res.status(200).json({
    success: true,
    message: 'Report data processed',
    data: responseData,
    error,
  });
};

module.exports = generateReport;


module.exports = {
  generateReport,downladReport,getmarksTarget
};