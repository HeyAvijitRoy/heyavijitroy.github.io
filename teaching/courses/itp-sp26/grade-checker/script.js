function checkCode() {
  const rawCode = document.getElementById("codeInput").value;

  // Remove comments to reduce false positives
  const code = rawCode
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  const normalized = code.replace(/\s+/g, " ");

  const checks = [
    {
      label: "Includes <iostream>",
      points: 1,
      passed: /#include\s*<iostream>/.test(code)
    },
    {
      label: "Includes <vector>",
      points: 1,
      passed: /#include\s*<vector>/.test(code)
    },
    {
      label: "Uses vector<int> to store scores",
      points: 2,
      passed: /vector\s*<\s*int\s*>\s+\w+/.test(code)
    },
    {
      label: "Asks user for number of scores",
      points: 1,
      passed: /cin\s*>>\s*\w+/.test(code) && /how many|number of|scores will be entered/i.test(code)
    },
    {
      label: "Uses loop to enter multiple scores",
      points: 2,
      passed: /(for|while)\s*\(/.test(code) && /cin\s*>>/.test(code)
    },
    {
      label: "Uses push_back() to store each score",
      points: 2,
      passed: /\.\s*push_back\s*\(/.test(code)
    },
    {
      label: "Displays all entered scores using a loop",
      points: 2,
      passed: /(for|while)\s*\(/.test(code) && /cout\s*<</.test(code)
    },
    {
      label: "Calculates total/sum of scores",
      points: 2,
      passed: /(total|sum)\s*(\+=|=\s*(total|sum)\s*\+)/i.test(normalized)
    },
    {
      label: "Calculates average using division",
      points: 3,
      passed: /(average|avg)/i.test(code) && /\/\s*(\w+\.size\s*\(\)|count|\w+)/.test(code)
    },
    {
      label: "Uses double or type casting for average",
      points: 2,
      passed: /\bdouble\b/.test(code) || /\(double\)|static_cast\s*<\s*double\s*>/.test(code)
    },
    {
      label: "Tracks highest score with comparison",
      points: 3,
      passed: /(highest|max)/i.test(code) && />/.test(code)
    },
    {
      label: "Tracks lowest score with comparison",
      points: 3,
      passed: /(lowest|min)/i.test(code) && /</.test(code)
    },
    {
      label: "Uses if/else for performance message",
      points: 2,
      passed: /if\s*\(/.test(code) && /else/.test(code)
    },
    {
      label: "Checks average >= 85",
      points: 2,
      passed: /(average|avg)\s*>=\s*85/i.test(code)
    },
    {
      label: "Prints both required performance messages",
      points: 2,
      passed:
        /Excellent class performance/i.test(code) &&
        /Needs improvement/i.test(code)
    },
    {
      label: "Has complete main() function",
      points: 1,
      passed: /int\s+main\s*\(\s*\)/.test(code) && /return\s+0\s*;/.test(code)
    }
  ];

  const checklist = document.getElementById("checklist");
  checklist.innerHTML = "";

  let earned = 0;
  let total = 0;

  checks.forEach(check => {
    total += check.points;

    if (check.passed) {
      earned += check.points;
    }

    const li = document.createElement("li");
    li.className = check.passed ? "pass" : "fail";
    li.textContent = `${check.passed ? "✅" : "❌"} ${check.label} (${check.points} pt${check.points > 1 ? "s" : ""})`;
    checklist.appendChild(li);
  });

  const percent = Math.round((earned / total) * 100);

  let message = "";

  if (percent >= 90) {
    message = "Strong submission based on checklist. Now test it with sample input.";
  } else if (percent >= 75) {
    message = "Good start, but review the missing checklist items.";
  } else if (percent >= 50) {
    message = "Partial solution. Several required parts may be missing.";
  } else {
    message = "Needs major revision. Start by checking vector, loop, input, and calculations.";
  }

  document.getElementById("scoreText").innerHTML =
    `<strong>Checklist Score:</strong> ${earned} / ${total} (${percent}%)<br>${message}<br><br>
    <em>Reminder: This checker does not compile your code. Final grading depends on correct logic, compilation, and output.</em>`;

  document.getElementById("results").classList.remove("hidden");
}