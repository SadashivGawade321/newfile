// Retrieve attendance data from localStorage
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];

// Display the attendance record on page load
window.onload = function() {
  displayAttendance();
  setupQRScanner();
};



// Function to add attendance manually (with password protection)
function markAttendance() {
  const password = prompt('Enter the admin password to mark attendance:');
  
  if (password !== '1234') {
    alert('Incorrect password! Only the teacher can mark attendance.');
    return;
  }

  const studentName = document.getElementById('studentName').value.trim();

  if (studentName === '') {
    alert('Please enter a student name');
    return;
  }

  addAttendanceRecord(studentName);
  document.getElementById('studentName').value = '';
}



// Function to add attendance record
function addAttendanceRecord(studentName) {
  const date = new Date().toLocaleDateString();

  const attendanceRecord = {
    name: studentName,
    date: date,
    status: 'Present'
  };

  attendanceData.push(attendanceRecord);
  localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
  displayAttendance();
}



// Function to display attendance records
function displayAttendance() {
  const attendanceBody = document.getElementById('attendanceBody');
  attendanceBody.innerHTML = '';

  attendanceData.forEach(record => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.innerText = record.name;

    const dateCell = document.createElement('td');
    dateCell.innerText = record.date;

    const statusCell = document.createElement('td');
    statusCell.innerText = record.status;

    row.appendChild(nameCell);
    row.appendChild(dateCell);
    row.appendChild(statusCell);

    attendanceBody.appendChild(row);
  });
}




// Function to clear all attendance records
function clearAttendance() {
  if (confirm('Are you sure you want to clear all attendance records?')) {
    attendanceData = [];
    localStorage.removeItem('attendanceData');
    displayAttendance();
  }
}




// Function to export attendance data to Excel
function exportToExcel() {
  if (attendanceData.length === 0) {
    alert("No attendance records to export.");
    return;
  }

  const worksheetData = [["Student Name", "Date", "Status"]];
  attendanceData.forEach(record => {
    worksheetData.push([record.name, record.date, record.status]);
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  XLSX.writeFile(workbook, "Attendance_Record.xlsx");
}




// QR Scanner setup
function setupQRScanner() {
  const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', function(content) {
    // Assume the QR code contains the student's name or ID
    const studentName = content.trim();
    alert(`QR Code Scanned! Marking attendance for: ${studentName}`);
    addAttendanceRecord(studentName);
  });

  // Start the scanner and choose the rear camera if available
  Instascan.Camera.getCameras().then(function(cameras) {
    if (cameras.length > 0.5) {
      scanner.start(cameras[0]);
    } else {
      alert('No cameras found.');
    }
  }).catch(function(e) {
    console.error(e);
  });
}
