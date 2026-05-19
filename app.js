const examples = [
  {
    id: "valid-pipeline",
    group: "Valid Programs",
    label: "Pipeline Demo",
    source: `int x;
float y = 10.5;
int list[10];

x = 5 + 3 * 2;

if (x > 10) {
    print(x);
} else {
    print(y);
}

while (x < 20) {
    x = x + 1;
}
`,
  },
  {
    id: "valid-arithmetic",
    group: "Valid Programs",
    label: "Arithmetic Precedence",
    source: `int a;
int b;
int result;

a = 8;
b = 3;
result = a + b * 4 - 2;
print(result);
`,
  },
  {
    id: "valid-while",
    group: "Valid Programs",
    label: "While Sum",
    source: `int i;
int sum;

i = 1;
sum = 0;

while (i <= 5) {
    sum = sum + i;
    i = i + 1;
}

print(sum);
`,
  },
  {
    id: "valid-array",
    group: "Valid Programs",
    label: "Array Access",
    source: `int values[4];
int i;

i = 0;
while (i < 4) {
    values[i] = i * 2;
    i = i + 1;
}

print(values[3]);
`,
  },
  {
    id: "valid-float",
    group: "Valid Programs",
    label: "Float Branch",
    source: `float marks;
int bonus;

marks = 82.5;
bonus = 5;
marks = marks + bonus;

if (marks >= 85.0) {
    print(marks);
} else {
    print(0);
}
`,
  },
  {
    id: "error-semantic",
    group: "Error Programs",
    label: "Type + Undeclared",
    source: `int x;
float y;

x = 2.5;
z = x + 1;
print(y);
`,
  },
  {
    id: "error-syntax",
    group: "Error Programs",
    label: "Missing Semicolon",
    source: `int x
x = 5;
print(x);
`,
  },
  {
    id: "error-lexical",
    group: "Error Programs",
    label: "Invalid Character",
    source: `int x;
x = 10 @ 2;
`,
  },
  {
    id: "error-array-index",
    group: "Error Programs",
    label: "Float Array Index",
    source: `int list[5];
float i;

i = 2.5;
list[i] = 10;
`,
  },
  {
    id: "error-array-name",
    group: "Error Programs",
    label: "Assign Array Name",
    source: `int list[3];

list = 10;
`,
  },
  {
    id: "error-duplicate",
    group: "Error Programs",
    label: "Duplicate Declaration",
    source: `int score;
float score;

score = 10;
`,
  },
  {
    id: "error-runtime",
    group: "Error Programs",
    label: "Runtime Bounds",
    source: `int values[2];

values[0] = 7;
values[2] = 9;
print(values[0]);
`,
  },
];

const source = document.querySelector("#source");
const output = document.querySelector("#output");
const statusBox = document.querySelector("#status");
const runButton = document.querySelector("#run");
const clearOutput = document.querySelector("#clearOutput");
const themeToggle = document.querySelector("#themeToggle");
const exampleSelect = document.querySelector("#exampleSelect");
const lineNumbers = document.querySelector("#lineNumbers");
const stages = Array.from(document.querySelectorAll(".stage"));

let selectedStage = "all";
let cache = {};
let lastSource = "";

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light" : "Dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("theme", theme);
}

function setStatus(text, isError = false) {
  statusBox.textContent = text;
  statusBox.classList.toggle("error", isError);
}

function resetRunState() {
  cache = {};
  lastSource = "";
  setStatus("Ready");
  output.textContent = "Click Run to compile the current Mini-C program.";
}

function updateLineNumbers() {
  const lineCount = source.value.split("\n").length;
  lineNumbers.textContent = Array.from({ length: lineCount }, (_, index) => index + 1).join("\n");
}

function loadExample(exampleId) {
  const example = examples.find((item) => item.id === exampleId) || examples[0];
  source.value = example.source;
  exampleSelect.value = example.id;
  source.scrollTop = 0;
  lineNumbers.scrollTop = 0;
  updateLineNumbers();
  resetRunState();
}

function populateExamples() {
  const groups = [];
  for (const example of examples) {
    let group = groups.find((item) => item.label === example.group);
    if (!group) {
      group = document.createElement("optgroup");
      group.label = example.group;
      groups.push(group);
      exampleSelect.appendChild(group);
    }

    const option = document.createElement("option");
    option.value = example.id;
    option.textContent = example.label;
    group.appendChild(option);
  }
}

function showCachedStage() {
  const content = cache[selectedStage];
  if (content !== undefined) {
    output.textContent = content;
  } else if (lastSource === source.value) {
    runCompiler();
  } else {
    output.textContent = "Click Run to compile the current Mini-C program.";
  }
}

function setStage(stage) {
  selectedStage = stage;
  stages.forEach((button) => {
    button.classList.toggle("active", button.dataset.stage === stage);
  });
  showCachedStage();
}

async function runCompiler() {
  const stage = selectedStage;
  setStatus("Running…");
  output.textContent = "Compiling…";
  lastSource = source.value;

  try {
    const response = await fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: source.value, stage }),
    });
    const result = await response.json();

    if (!result.ok) {
      cache[stage] = "✖  " + (result.output || "Compilation failed.");
      setStatus("Error", true);
    } else {
      cache[stage] = result.output || "";
      setStatus("Success");
    }

    showCachedStage();
  } catch (error) {
    output.textContent = `Frontend error: ${error.message}`;
    setStatus("Error", true);
  }
}

stages.forEach((button) => {
  button.addEventListener("click", () => setStage(button.dataset.stage));
});

exampleSelect.addEventListener("change", () => loadExample(exampleSelect.value));

runButton.addEventListener("click", runCompiler);

clearOutput.addEventListener("click", () => {
  output.textContent = "";
  cache = {};
  lastSource = "";
  setStatus("Ready");
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(nextTheme);
});

source.addEventListener("input", () => {
  cache = {};
  lastSource = "";
  updateLineNumbers();
  setStatus("Ready");
});

source.addEventListener("scroll", () => {
  lineNumbers.scrollTop = source.scrollTop;
});

populateExamples();
setTheme(localStorage.getItem("theme") || "dark");
loadExample(examples[0].id);
