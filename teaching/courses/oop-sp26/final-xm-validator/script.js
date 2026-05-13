function removeComments(code) {
  return code
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
}

function checkCode() {
  const rawCode = document.getElementById("codeInput").value;
  const code = removeComments(rawCode);
  const normalized = code.replace(/\s+/g, " ");

  const checks = [
    {
      label: "Includes <iostream>",
      points: 1,
      passed: /#include\s*<iostream>/.test(code)
    },
    {
      label: "Includes <string>",
      points: 1,
      passed: /#include\s*<string>/.test(code)
    },
    {
      label: "Defines a class named BankAccount",
      points: 3,
      passed: /class\s+BankAccount\s*{/.test(code)
    },
    {
      label: "Uses private access section",
      points: 2,
      passed: /private\s*:/.test(code)
    },
    {
      label: "Uses public access section",
      points: 2,
      passed: /public\s*:/.test(code)
    },
    {
      label: "Has string ownerName data member",
      points: 2,
      passed: /(string|std::string)\s+ownerName\s*;/.test(code)
    },
    {
      label: "Has int accountNumber data member",
      points: 2,
      passed: /int\s+accountNumber\s*;/.test(code)
    },
    {
      label: "Has double balance data member",
      points: 2,
      passed: /double\s+balance\s*;/.test(code)
    },
    {
      label: "Has a BankAccount constructor with parameters",
      points: 3,
      passed: /BankAccount\s*\([^)]*(string|std::string)[^)]*int[^)]*double[^)]*\)/.test(code)
    },
    {
      label: "Constructor initializes ownerName",
      points: 2,
      passed:
        /ownerName\s*=/.test(code) ||
        /:\s*ownerName\s*\(/.test(normalized) ||
        /,\s*ownerName\s*\(/.test(normalized)
    },
    {
      label: "Constructor initializes accountNumber",
      points: 2,
      passed:
        /accountNumber\s*=/.test(code) ||
        /:\s*accountNumber\s*\(/.test(normalized) ||
        /,\s*accountNumber\s*\(/.test(normalized)
    },
    {
      label: "Constructor initializes balance",
      points: 2,
      passed:
        /balance\s*=/.test(code) ||
        /:\s*balance\s*\(/.test(normalized) ||
        /,\s*balance\s*\(/.test(normalized)
    },
    {
      label: "Defines deposit(double amount)",
      points: 3,
      passed: /void\s+deposit\s*\(\s*double\s+\w+\s*\)/.test(code)
    },
    {
      label: "deposit() adds amount to balance",
      points: 3,
      passed:
        /balance\s*\+=\s*\w+/.test(code) ||
        /balance\s*=\s*balance\s*\+\s*\w+/.test(code)
    },
    {
      label: "Defines withdraw(double amount)",
      points: 3,
      passed: /void\s+withdraw\s*\(\s*double\s+\w+\s*\)/.test(code)
    },
    {
      label: "withdraw() uses an if statement",
      points: 2,
      passed: /void\s+withdraw\s*\([^)]*\)\s*{[\s\S]*?if\s*\(/.test(code)
    },
    {
      label: "withdraw() checks whether withdrawal is allowed",
      points: 3,
      passed: /if\s*\([^)]*(amount|balance)[^)]*(<=|>=|>|<)[^)]*(amount|balance)[^)]*\)/.test(code)
    },
    {
      label: "withdraw() subtracts amount from balance",
      points: 3,
      passed:
        /balance\s*-=\s*\w+/.test(code) ||
        /balance\s*=\s*balance\s*-\s*\w+/.test(code)
    },
    {
      label: "withdraw() handles insufficient balance",
      points: 2,
      passed:
        /void\s+withdraw\s*\([^)]*\)\s*{[\s\S]*?else[\s\S]*?}/.test(code) ||
        /insufficient|not enough|denied/i.test(code)
    },
    {
      label: "Defines displayInfo() method",
      points: 3,
      passed: /void\s+displayInfo\s*\(\s*\)/.test(code)
    },
    {
      label: "displayInfo() prints owner name",
      points: 2,
      passed: /cout\s*<<[\s\S]*ownerName/.test(code)
    },
    {
      label: "displayInfo() prints account number",
      points: 2,
      passed: /cout\s*<<[\s\S]*accountNumber/.test(code)
    },
    {
      label: "displayInfo() prints balance",
      points: 2,
      passed: /cout\s*<<[\s\S]*balance/.test(code)
    },
    {
      label: "Has complete int main() function",
      points: 2,
      passed: /int\s+main\s*\(\s*\)/.test(code) && /return\s+0\s*;/.test(code)
    },
    {
      label: "Creates a BankAccount object in main()",
      points: 3,
      passed: /BankAccount\s+\w+\s*\([^;]*\)\s*;/.test(code)
    },
    {
      label: "Calls deposit() from an object",
      points: 2,
      passed: /\w+\s*\.\s*deposit\s*\(/.test(code)
    },
    {
      label: "Calls withdraw() from an object",
      points: 2,
      passed: /\w+\s*\.\s*withdraw\s*\(/.test(code)
    },
    {
      label: "Calls displayInfo() from an object",
      points: 2,
      passed: /\w+\s*\.\s*displayInfo\s*\(/.test(code)
    },
    {
      label: "Does not require loop for this problem",
      points: 0,
      passed: true
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

    if (check.points === 0) {
      li.textContent = `${check.passed ? "✅" : "❌"} ${check.label}`;
    } else {
      li.textContent =
        `${check.passed ? "✅" : "❌"} ${check.label} (${check.points} pt${check.points > 1 ? "s" : ""})`;
    }

    checklist.appendChild(li);
  });

  const percent = Math.round((earned / total) * 100);

  let message = "";

  if (percent >= 90) {
    message = "Strong OOP structure based on the checklist. Now test whether the code compiles and produces correct output.";
  } else if (percent >= 75) {
    message = "Good start. Review the missing OOP requirements before submitting.";
  } else if (percent >= 50) {
    message = "Partial solution. Several required class or method components may be missing.";
  } else {
    message = "Needs major revision. Start by checking class definition, private data members, constructor, and required methods.";
  }

  document.getElementById("scoreText").innerHTML =
    `<strong>Checklist Score:</strong> ${earned} / ${total} (${percent}%)<br>${message}<br><br>
    <em>Reminder: This checker does not compile C++ code. Final grading depends on compilation, correct logic, and correct output.</em>`;

    // ================================
  // AI-Style / Code Pattern Analysis
  // ================================

  const singleLineComments =
    (rawCode.match(/\/\/.*$/gm) || []).length;

  const multiLineComments =
    (rawCode.match(/\/\*[\s\S]*?\*\//g) || []).length;

  const totalComments = singleLineComments + multiLineComments;

  const totalLines =
    rawCode.split("\n").filter(line => line.trim() !== "").length;

  const commentDensity =
    totalLines > 0
      ? Math.round((totalComments / totalLines) * 100)
      : 0;

  // Advanced syntax indicators
  const advancedPatterns = [];

  if (/:\s*\w+\s*\(/.test(normalized)) {
    advancedPatterns.push("Constructor initializer list");
  }

  if (/static_cast\s*</.test(code)) {
    advancedPatterns.push("static_cast usage");
  }

  if (/::/.test(code)) {
    advancedPatterns.push("Scope resolution operator");
  }

  if (/template\s*</.test(code)) {
    advancedPatterns.push("Template syntax");
  }

  if (/friend\s+/.test(code)) {
    advancedPatterns.push("Friend keyword");
  }

  if (/nullptr/.test(code)) {
    advancedPatterns.push("nullptr usage");
  }

  // Comment density observations
  let styleObservation = "";

  if (commentDensity >= 35) {
    styleObservation =
      "Very high comment density observed. This may indicate tutorial-style or AI-assisted formatting.";
  }
  else if (commentDensity >= 20) {
    styleObservation =
      "Moderate comment density observed.";
  }
  else {
    styleObservation =
      "Comment density appears typical for student-written code.";
  }

  // Create observation section
  const observationDiv = document.createElement("div");

  observationDiv.style.marginTop = "25px";
  observationDiv.style.padding = "15px";
  observationDiv.style.background = "#fff8e6";
  observationDiv.style.borderLeft = "5px solid #f0b429";
  observationDiv.style.borderRadius = "8px";

  let advancedText = "";

  if (advancedPatterns.length > 0) {
    advancedText =
      `<strong>Advanced Syntax Detected:</strong><br>
       ${advancedPatterns.join(", ")}`;
  }
  else {
    advancedText =
      `<strong>Advanced Syntax Detected:</strong><br>
       None`;
  }

  observationDiv.innerHTML = `
    <h3 style="margin-top:0;">Code Style Observations</h3>

    <p><strong>Comment Density:</strong> ${commentDensity}%</p>

    <p>${styleObservation}</p>

    <p>${advancedText}</p>

    <p style="font-size: 13px; color: #666;">
      These observations are informational only and are NOT used for grading.
    </p>
  `;

  document.getElementById("results").appendChild(observationDiv);
  
    
  document.getElementById("results").classList.remove("hidden");
}