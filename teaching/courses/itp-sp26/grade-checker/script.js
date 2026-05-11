function checkCode() {
  const code = document.getElementById("codeInput").value;

  const checks = [
    {
      label: "Uses #include <vector>",
      passed: code.includes("#include <vector>")
    },
    {
      label: "Uses vector<int>",
      passed: code.includes("vector<int>")
    },
    {
      label: "Uses push_back() to store scores",
      passed: code.includes(".push_back")
    },
    {
      label: "Uses a loop",
      passed: code.includes("for") || code.includes("while")
    },
    {
      label: "Tracks or calculates highest score",
      passed: /highest|max/i.test(code)
    },
    {
      label: "Tracks or calculates lowest score",
      passed: /lowest|min/i.test(code)
    },
    {
      label: "Calculates average",
      passed: /average|avg/i.test(code)
    },
    {
      label: "Uses conditional statement for performance message",
      passed: code.includes("if")
    },
    {
      label: "Includes Excellent class performance message",
      passed: code.includes("Excellent class performance")
    },
    {
      label: "Includes Needs improvement message",
      passed: code.includes("Needs improvement")
    }
  ];

  const checklist = document.getElementById("checklist");
  checklist.innerHTML = "";

  let score = 0;

  checks.forEach(check => {
    const li = document.createElement("li");
    li.textContent = `${check.passed ? "✅" : "❌"} ${check.label}`;
    li.className = check.passed ? "pass" : "fail";
    checklist.appendChild(li);

    if (check.passed) score++;
  });

  document.getElementById("scoreText").textContent =
    `Checklist Score: ${score} / ${checks.length}`;

  document.getElementById("results").classList.remove("hidden");
}