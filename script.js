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
      `http://127.0.0.1:8000/calculate?level=${level}&barn_size=${barn}`
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
    let html = `
      <div class="result-card">
        <div class="category">${category}</div>
    `;

    if (info.type === "per_item") {
      html += `
        <div class="small">
          Unlocked: ${info.unlocked_items}<br/>
          Keep: <strong>${info.recommended_each} each</strong><br/>
          Total used: ${info.total_used_space}
        </div>
      `;
    } else {
      html += `
        <div class="small">
          Total allowed: <strong>${info.recommended_total}</strong>
        </div>
      `;
    }

    html += `</div>`;
    resultsDiv.innerHTML += html;
  });
}
