// This function is called when the user clicks "Calculate"
async function calculate() {
  const level = parseInt(document.getElementById("levelInput").value);
  const barn = parseInt(document.getElementById("barnInput").value);

  // Basic validation
  if (!level || !barn) {
    alert("Please enter both level and barn size");
    return;
  }

  try {
    // Call FastAPI backend
    const res = await fetch(
      `https://inventory-recommendation-engine-hayday.onrender.com/calculate?level=${level}&barn_size=${barn}`
    );

    const data = await res.json();

    // Handle backend error
    if (data.error) {
      alert(data.error);
      return;
    }

    // Render results on UI
    renderResults(data);

  } catch (err) {
    alert("Backend not reachable. Is FastAPI running?");
    console.error(err);
  }
}

// This function renders the results on the page
function renderResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  Object.entries(data).forEach(([category, info]) => {
    // 1. Skip the summary key from the main loop
    if (category === "summary") return;

    let html = `
      <div class="result-card">
        <div class="category">${category}</div>
    `;

    // 2. Updated check: Does it have an item count? (Dairy, Sugars, Foods, Animals)
    if (info.count !== undefined) {
      html += `
        <div class="small">
          Items Unlocked: ${info.count}<br/>
          <strong>${info.recommendation}</strong><br/>
          Total space: ${info.total_space}
        </div>
      `;
    } 
    // 3. For Expansion and Land Clearing
    else {
      html += `
        <div class="small">
          <strong>${info.recommendation}</strong><br/>
          Total space: ${info.total_space}
        </div>
      `;
    }

    html += `</div>`;
    resultsDiv.innerHTML += html;
  });

  // 4. Optionally: Display the 5% free space summary at the bottom
  if (data.summary) {
    resultsDiv.innerHTML += `
      <div class="summary-card" style="margin-top: 20px; border-top: 2px solid #ccc;">
        <p><strong>Free Space: ${data.summary.free_space_remaining} slots (${data.summary.percent_free}%)</strong></p>
      </div>
    `;
  }
}