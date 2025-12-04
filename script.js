// =====================================
// Big Body - Simple Strength Calculator
// =====================================

// This will store the ratios after we fetch them
let strengthAPI = null;

// Load the API (strength.json) when the page opens
fetch("api/strength.json")
  .then(res => res.json())
  .then(data => {
    strengthAPI = data; // save the data
    console.log("API Loaded:", data);
  })
  .catch(err => alert("Could not load API."));

// ===============================
// When user presses Calculate
// ===============================
document.getElementById("strength-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // stop page reload

    // API still loading?
    if (!strengthAPI) {
      alert("Please wait... Loading strength data!");
      return;
    }

    // Get user input
    let gender = document.querySelector("input[name='gender']:checked").value;
    let bodyweight = Number(document.getElementById("bodyweight").value);
    let exercise = document.getElementById("exercise").value;
    let maxLift = Number(document.getElementById("max-lift").value);

    // Basic safety check
    if (bodyweight <= 0 || maxLift <= 0) {
      alert("Please enter a valid bodyweight and 1RM.");
      return;
    }

    // Get ratios from API for this gender + lift
    let ratios = strengthAPI[gender][exercise];
    let userRatio = maxLift / bodyweight;

    // Level names
    let levels = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite"];

    // Find what level user is
    let levelIndex = ratios.findIndex(r => userRatio < r);
    if (levelIndex === -1) levelIndex = 4; // max = elite

    let userLevel = levels[levelIndex];

    // ------------------------------
    // Show result in result box
    // ------------------------------
    document.getElementById("result-card").innerHTML = `
      <h2>Your Result</h2>
      <p>You are <strong>${userLevel}</strong> at the <b>${exercise.replace("_", " ").toUpperCase()}</b>.</p>
      <p>Your lift: <strong>${maxLift} lb</strong></p>
      <p>Bodyweight: <strong>${bodyweight} lb</strong></p>
      <p>Strength Ratio: <strong>${userRatio.toFixed(2)}×</strong></p>
    `;

    // Build the standards table
    buildTable(ratios, bodyweight, levelIndex);
  });

// ===============================
// Build Standards Table
// ===============================
function buildTable(ratios, bodyweight, highlightIndex) {
  let levels = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite"];

  let rows = ratios.map((ratio, i) => {
    let est = Math.round((ratio * bodyweight) / 5) * 5;
    let style = i === highlightIndex ? "style='color:#4ade80; font-weight:bold;'" : "";
    return `<tr ${style}><td>${levels[i]}</td><td>${ratio.toFixed(2)}× BW</td><td>${est} lb</td></tr>`;
  }).join("");

  document.getElementById("standards-table-wrapper").innerHTML = `
    <table class="standards-table">
      <thead><tr><th>Level</th><th>Ratio</th><th>Approx. 1RM</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
