// let uploadedFile = null;
// let reportData = null;
// let jsonData;
// var trainerName;
// var batchName;
// var fileName;
// let reportSummary = null;

// // File upload handling
// function handleFileSelect(event) {
//     const file = event.target.files[0];
//     if (file) {
//         uploadedFile = file;
//         displayFileInfo(file);
//         showMessage('File uploaded successfully!', 'success');
//         document.getElementById('generateBtn').disabled = false;
//     }
// }

// function displayFileInfo(file) {
//     const fileInfo = document.getElementById('fileInfo');
//     const fileName = document.getElementById('fileName');
//     const fileSize = document.getElementById('fileSize');

//     fileName.textContent = file.name;
//     fileSize.textContent = `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
//     fileInfo.classList.add('show');
// }

// function showMessage(text, type) {
//     const message = document.getElementById('message');
//     message.textContent = text;
//     message.className = `message ${type} show`;

//     setTimeout(() => {
//         message.classList.remove('show');
//     }, 5000);
// }

// // Drag and drop functionality
// const uploadSection = document.getElementById('uploadSection');

// uploadSection.addEventListener('dragover', (e) => {
//     e.preventDefault();
//     uploadSection.classList.add('dragover');
// });

// uploadSection.addEventListener('dragleave', () => {
//     uploadSection.classList.remove('dragover');
// });

// uploadSection.addEventListener('drop', (e) => {
//     e.preventDefault();
//     uploadSection.classList.remove('dragover');

//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//         const file = files[0];
//         if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
//             uploadedFile = file;
//             displayFileInfo(file);
//             showMessage('File uploaded successfully!', 'success');
//             document.getElementById('generateBtn').disabled = false;
//         } else {
//             showMessage('Please upload a valid Excel file (.xlsx or .xls)', 'error');
//         }
//     }
// });

// // Save summary locally
// function saveSummary(summary) {
//     try {
//         console.log("Attempting to save to localStorage:", summary);
//         const summaryString = JSON.stringify(summary);
//         localStorage.setItem('reportSummary', summaryString);
//         console.log("Successfully saved to localStorage");
        
//         // Verify the save worked
//         const verifyData = localStorage.getItem('reportSummary');
//         console.log("Verification - Data in localStorage:", verifyData);
//     } catch (error) {
//         console.error("Error saving to localStorage:", error);
//         alert("Failed to save report summary to localStorage");
//     }
// }

// // Process Excel file
// function processExcelFile(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();

//         reader.onload = (e) => {
//             try {
//                 const data = new Uint8Array(e.target.result);
//                 const workbook = XLSX.read(data, { type: 'array' });

//                 // Get the first sheet
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];

//                 // Convert sheet to JSON
//                 jsonData = XLSX.utils.sheet_to_json(sheet);
//                 console.log("Excel data loaded:", jsonData);

//                 // Process the data
//                 const processedData = analyzeExcelData(file);
//                 resolve(processedData);
//             } catch (error) {
//                 reject(error);
//             }
//         };

//         reader.onerror = () => reject(new Error('Failed to read file'));
//         reader.readAsArrayBuffer(file);
//     });
// }

// function analyzeExcelData(file) {
//     // Global counters
//     const globalCounts = { Excellent: 0, VeryGood: 0, Good: 0, Average: 0, Poor: 0 };
//     let totalRating = 0;
//     let totalResponses = 0; // Track valid responses

//     // Add combined count for each person
//     jsonData.forEach(entry => {
//         const personalCount = { Excellent: 0, VeryGood: 0, Good: 0, Average: 0, Poor: 0 };
//         Object.values(entry).forEach(val => {
//             if (val === "Excellent") {
//                 personalCount.Excellent++;
//                 globalCounts.Excellent++;
//             } else if (val === "Very Good") {
//                 personalCount.VeryGood++;
//                 globalCounts.VeryGood++;
//             } else if (val === "Good") {
//                 personalCount.Good++;
//                 globalCounts.Good++;
//             } else if (val === "Average") {
//                 personalCount.Average++;
//                 globalCounts.Average++;
//             } else if (val === "Poor") {
//                 personalCount.Poor++;
//                 globalCounts.Poor++;
//             }
//         });
        
//         // Attach to each person
//         entry["CombinedCounts"] = personalCount;
        
//         // Add rating - handle potential undefined/null values
//         const overallRating = entry["Overall program rating"];
//         if (overallRating && !isNaN(overallRating)) {
//             totalRating += parseFloat(overallRating);
//             totalResponses++;
//         }
//     });

//     // Calculate overall avg rating (avoid division by zero)
//     const averageRating = totalResponses > 0 ? totalRating / totalResponses : 0;
//     console.log("Average Overall Rating:", averageRating.toFixed(2));

//     // Ratings we care about
//     const ratingOptions = ["Excellent", "Very Good", "Good", "Average", "Poor"];

//     // Object to hold results
//     const questionStats = {};

//     // Iterate through each row (response)
//     jsonData.forEach(entry => {
//         Object.entries(entry).forEach(([question, answer]) => {
//             if (ratingOptions.includes(answer)) {
//                 // Initialize stats for this question if not already present
//                 if (!questionStats[question]) {
//                     questionStats[question] = {
//                         Excellent: 0,
//                         "Very Good": 0,
//                         Good: 0,
//                         Average: 0,
//                         Poor: 0
//                     };
//                 }
//                 // Increment the correct bucket
//                 questionStats[question][answer]++;
//             }
//         });
//     });

//     // Get trainer name
//     const trainerInput = document.getElementById('trainerName');
//     trainerName = trainerInput ? trainerInput.value.trim() : "";

//     fileName = file.name;

//     // Extract course name
//     const angularMatch = fileName.match(/_(.*?)_/);
//     const courseName = angularMatch ? angularMatch[1] : "Not found";

//     // Extract batch info
//     const batchMatch = fileName.match(/(ILP).*?Batch\s\d+.*?_(\d{4}-\d{2})/);
//     const batchInfo = batchMatch ? `${batchMatch[1]} ${batchMatch[2]} Batch 5` : "Not found";

//     console.log("courseName:", courseName);
//     console.log("Batch Info:", batchInfo);

//     // Create the report summary - ensure all values are serializable
//     reportSummary = {
//         questionAnalysis: questionStats,
//         totalRatingOfTrainer: parseFloat(averageRating.toFixed(2)),
//         noOfResposes: jsonData.length,
//         trainerName: trainerName || "",
//         batchName: batchInfo || "",
//         courseName: courseName || "",
//         timestamp: new Date().toISOString(),
//         globalCounts: globalCounts
//     };

//     console.log("Final Report Summary before saving:", reportSummary);

//     // Save to localStorage
//     saveSummary(reportSummary);

//     return reportSummary;
// }


// // Report generation
// async function generateReport() {
//     if (!uploadedFile) {
//         showMessage('Please upload a file first!', 'error');
//         return;
//     }

//     trainerName = document.getElementById('trainerName').value.trim();
//     if (!trainerName) {
//         showMessage('Please enter the trainer name before generating report.', 'error');
//         return;
//     }

//     // Show loading
//     document.getElementById('loading').style.display = 'block';
//     document.getElementById('generateBtn').disabled = true;

//     try {
//         // Process the Excel file
//         reportData = await processExcelFile(uploadedFile);

//         // Show the report preview
//         showReportPreview();
//         showMessage('Report generated successfully!', 'success');

//         // Show download button
//         document.getElementById('downloadBtn').style.display = 'inline-block';

//         // Now you can access reportSummary here
//         console.log("Report Summary is now available:", reportSummary);

//     } catch (error) {
//         console.error('Error generating report:', error);
//         showMessage('Error generating report. Please try again.', 'error');
//     } finally {
//         // Hide loading
//         document.getElementById('loading').style.display = 'none';
//         document.getElementById('generateBtn').disabled = false;
//     }
// }

// function showReportPreview() {
//     const reportPreview = document.getElementById('reportPreview');
//     const reportDate = document.getElementById('reportDate');
//     const reportPlaceholder = document.getElementById('reportPlaceholder');
//     const reportFrame = document.getElementById('reportFrame');

//     // Set report date
//     reportDate.textContent = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;

//     // Hide placeholder
//     if (reportPlaceholder) {
//         reportPlaceholder.style.display = 'none';
//     }

//     // Show iframe with feedbackReport.html
//     reportFrame.src = "feedbackReport.html";
//     reportFrame.style.display = "block";

//     // Make sure the preview section is visible
//     reportPreview.classList.add('show');
// }

// // Download functionality
// function downloadReport() {
//     if (!reportData) {
//         showMessage('No report data available to download!', 'error');
//         return;
//     }

//     // TODO: Add your download logic here
//     showMessage('Download functionality will be implemented here!', 'success');
//     console.log('Download report:', reportData);
// }

// // Set up the file input event listener
// document.getElementById('fileInput').addEventListener('change', (event) => {
//     handleFileSelect(event);
// });


// async function initGemini() {
//   const API_KEY = "AIzaSyCdXfS6CzvUzoq1Jo_x5HMdvtp_ykImrQM"; // 🔑 Replace with your actual key
//   const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + API_KEY;

//   const requestBody = {
//     contents: [
//       { parts: [{ text: "Explain how AI works in a few words" }] }
//     ]
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(requestBody)
//     });

//     const data = await response.json();
//     console.log("Gemini response:", data);

//     // Extract actual text
//     const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     console.log("AI says:", aiText);
//   } catch (err) {
//     console.error("Error calling Gemini API:", err);
//   }
// }

// // Run it on page load
// initGemini();


  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBDSAfT6Njuq7uzuFNGW1xUXpOZPRPc87o",
    authDomain: "experion-app-7c329.firebaseapp.com",
    databaseURL: "https://experion-app-7c329-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "experion-app-7c329",
    storageBucket: "experion-app-7c329.firebasestorage.app",
    messagingSenderId: "304649603841",
    appId: "1:304649603841:web:31ef46db1f879551062900",
    measurementId: "G-Z1T3MSS6RG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);