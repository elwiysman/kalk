import { getOperationName, selectOperation } from "./operation.js";
import { showNotification } from "./ui.js";
import { validateExpression } from "./helper.js";

const calcExpressionInput = document.getElementById("calcExpression");
const graphExpressionInput = document.getElementById("graphExpression");

export function populateExamplesGrid() {
  const examplesGrid = document.getElementById("examplesGrid");
  if (!examplesGrid) return;

  const examples = {
    arithmetic: ["2 + 3 * 4", "10 / 2 - 3", "2^3 + 4^2"],
    equation: ["x^2 - 5*x + 6 = 0", "2*x + 3 = 7", "x^3 - 27 = 0"],
    factorization: ["x^2 - 9", "x^2 - 5*x + 6", "x^3 - 8"],
    substitution: ["x^2 + 2*x + 1", "sin(x) + cos(x)", "log(x)"],
    statistics: ["1, 2, 3, 4, 5", "10, 20, 30, 40, 50", "2, 4, 6, 8, 10"],
    fraction: ["1/2 + 1/3", "3/4 - 1/6", "2/3 * 3/5"],
    arithmetic_sequence: [
      "a₁=2, d=3, n=10",
      "a₁=5, d=2, n=20",
      "a₁=1, d=0.5, n=15",
    ],
    geometric_sequence: [
      "a₁=1, r=2, n=10",
      "a₁=3, r=3, n=5",
      "a₁=10, r=0.5, n=8",
    ],
    limit: ["(x^2 - 1)/(x - 1)", "sin(x)/x", "1/x"],
    trigonometry: ["sin(x)^2 + cos(x)^2", "sin(2*x)", "tan(x) * cos(x)"],
    derivative: ["x^2 + 3*x + 2", "sin(x) * cos(x)", "exp(x^2)"],
    integral: ["x^2 + 2*x", "sin(x)", "1/x"],
    definite_integral: ["x^2", "sin(x)", "exp(-x^2)"],
    logarithm: ["log(x^2)", "log(exp(x))", "log(10)"],
    function: [
      "f(x) = x^2 + 2*x + 1",
      "g(x) = sin(x) + cos(x)",
      "h(x) = exp(x)",
    ],
  };

  for (const [operation, exampleList] of Object.entries(examples)) {
    const card = document.createElement("div");
    card.className = "example-card";

    const title = document.createElement("strong");
    title.textContent = getOperationName(operation);
    card.appendChild(title);

    const list = document.createElement("ul");
    list.style.cssText = "list-style: none; padding: 0; margin-top: 8px;";

    exampleList.forEach((example) => {
      const item = document.createElement("li");
      item.style.cssText =
        "margin-bottom: 5px; cursor: pointer; padding: 5px; border-radius: 4px; transition: all 0.2s;";
      item.textContent = example;

      item.addEventListener("mouseover", function () {
        this.style.background = "#f0f4ff";
      });

      item.addEventListener("mouseout", function () {
        this.style.background = "transparent";
      });

      item.addEventListener("click", function () {
        selectOperation(operation);
        setExample(this.textContent);
      });

      list.appendChild(item);
    });

    card.appendChild(list);
    examplesGrid.appendChild(card);
  }
}

export function setExample(expression) {
  if (calcExpressionInput) {
    calcExpressionInput.value = expression;
    validateExpression(calcExpressionInput);
  }
  if (graphExpressionInput) {
    graphExpressionInput.value = expression;
    validateExpression(graphExpressionInput);
  }

  if (calcExpressionInput) calcExpressionInput.focus();

  setTimeout(() => {
    if (calcExpressionInput) calcExpressionInput.style.borderColor = "#e0e0e0";
    if (graphExpressionInput)
      graphExpressionInput.style.borderColor = "#e0e0e0";
  }, 2000);

  showNotification(`Contoh "${expression}" telah dimasukkan!`);
}
