const xlsx = require('xlsx');
const fs = require('fs');
const courseReportModel = require('../../models/coordinator/courseReportModel');

// Handle GET request to generate the report
const generateReport = async (req, res) => {
  const { courseId, deptId, academicYear } = req.query;

  if (!courseId || !deptId || !academicYear) {
    return res.status(400).send('Missing required parameters');
  }

  try {
    // Fetch course target data
    const targetData = await courseReportModel.getCourseTarget(courseId, deptId, academicYear);
    if (targetData.length === 0) {
      return res.status(404).send('No target data found');
    }
    const target = targetData[0];
    console.log('Target Data:', target);  // Log the target data

    // Fetch marks data
    const marksData = await courseReportModel.getMarksData(courseId, deptId, academicYear);
    if (marksData.length === 0) {
      return res.status(404).send('No marks data found');
    }
    console.log('Marks Data:', marksData);  // Log the marks data

    // Prepare data for Excel (Target data)
    const targetSheetData = [
      { 'Target': 'Level 3', 'Unit Test': target.target1, 'SPPU': target.sppu1 },
      { 'Target': 'Level 2', 'Unit Test': target.target2, 'SPPU': target.sppu2 },
      { 'Target': 'Level 1', 'Unit Test': target.target3, 'SPPU': target.sppu3 },
    ];
    console.log('Target Sheet Data:', targetSheetData);  // Log the target sheet data

    // Prepare data for Excel (Marks data)
    const marksSheetData = marksData.map((mark, index) => ({
      'Sr. No.': index + 1,
      'Roll_No': mark.roll_no,
      'Name': mark.student_name,  // Now using student_name from the fetched data
      'CO1': mark.u1_co1,
      'CO2': mark.u1_co2,
      'CO3': mark.u2_co3,
      'CO4': mark.u2_co4,
      'CO5': mark.u3_co5,
      'CO6': mark.u3_co6,
      'I_CO1': mark.i_co1,
      'I_CO2': mark.i_co2,
      'endsem': mark.end_sem,
      'final': mark.final_sem,
    }));
    console.log('Marks Sheet Data:', marksSheetData);  // Log the marks sheet data

    // Ensure marksSheetData is not empty
    if (marksSheetData.length === 0) {
      console.log('Error: Marks sheet data is empty');
      return res.status(500).send('Marks data is empty');
    }

    // Manually check the sheet creation
    const marksSheet = xlsx.utils.json_to_sheet(marksSheetData);
    console.log('Marks Sheet Created:', marksSheet);  // Log sheet creation to ensure it worked

    // Create Excel sheets
    const targetSheet = xlsx.utils.json_to_sheet(targetSheetData);
    console.log('Target Sheet Created:', targetSheet);  // Log target sheet creation to ensure it worked

    // Create a new workbook
    const wb = xlsx.utils.book_new();

    // Add both sheets to the workbook
    xlsx.utils.book_append_sheet(wb, targetSheet, 'Target');
    xlsx.utils.book_append_sheet(wb, marksSheet, 'Marks');

    // Check if the workbook has the expected sheets
    console.log('Workbook sheets:', wb.SheetNames);  // Log the sheet names in the workbook

    // Define the file path for saving
    const filePath = "./course_report_${Date.now()}.xlsx";

    // Write the workbook to the file
    xlsx.writeFile(wb, filePath);
    console.log('File created at:', filePath);

    // Check if the file exists before attempting to send it
    if (fs.existsSync(filePath)) {
      console.log('File exists, sending download');
      // Send the file to the client for download
      res.download(filePath, 'course_report.xlsx', (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Optional: Delete the file after sending it to the client
        fs.unlinkSync(filePath);
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

module.exports = {
  generateReport
};