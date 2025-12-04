let strengthAPI = null;

fetch("api/strength.json")
  .then(res => res.json())
  .then(data => {
    strengthAPI = data; 
    console.log("API Loaded:", data);
  })
  .catch(err => alert("Could not load API."));



  document.getElementById("strength-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();


    let gender = document.querySelector("input[name='gender']:checked").value;
    let bodyweight = Number(document.getElementById("bodyweight").value);
    let exercise = document.getElementById("exercise").value;
    let maxLift = Number(document.getElementById("max-lift").value);


    if (bodyweight <= 0 || maxLift <= 0) {
        alert("Please enter a valid bodyweight and 1 Rep Max greater than zero.");
        return;
    }


    let ratios = strengthAPI[gender][exercise];
    let userRatio = maxLift / bodyweight;


    let levels = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite"];

    let levelIndex = 0;

    for (let i = 0; i < ratios.length; i++) {
        if (userRatio >= ratios[i]) {
        levelIndex = i;
        }
    }

    let userLevel = levels[levelIndex];


    document.getElementById("result-card").innerHTML = `
      <h2>Your Result</h2>
      <p>You are <strong>${userLevel}</strong> at the <b>${exercise.replace("_", " ").toUpperCase()}</b>.</p>
      <p>Your lift: <strong>${maxLift} lb</strong></p>
      <p>Bodyweight: <strong>${bodyweight} lb</strong></p>
      <p>Strength Ratio: <strong>${userRatio.toFixed(2)}×</strong></p>
    `;


    buildTable(ratios, bodyweight, levelIndex);
  });


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
