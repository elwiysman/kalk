import { performCalculation, generateGraph } from "./api.js";
import { selectOperation } from "./operation.js";
import { validateExpression } from "./helper.js";
import { clearResults, updateDefiniteIntegralInputs } from "./ui.js";
import { isCalculating } from "../main.js";

const calcExpressionInput = document.getElementById("calcExpression");
const graphExpressionInput = document.getElementById("graphExpression");
const operationButtons = document.querySelectorAll(".operation-btn");
const calculateBtn = document.getElementById("calculateBtn");
const graphBtn = document.getElementById("graphBtn");

export function initializeEventListeners() {
  operationButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      selectOperation(this.dataset.operation);
    });
  });

  if (calculateBtn) calculateBtn.addEventListener("click", performCalculation);
  if (graphBtn) graphBtn.addEventListener("click", generateGraph);

  if (calcExpressionInput) {
    calcExpressionInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && !isCalculating) {
        performCalculation();
      }
    });

    calcExpressionInput.addEventListener("input", function () {
      if (graphExpressionInput && graphExpressionInput.value === "") {
        graphExpressionInput.value = this.value;
      }
    });
  }

  if (graphExpressionInput) {
    graphExpressionInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && !isCalculating) {
        generateGraph();
      }
    });
  }

  const lowerBound = document.getElementById("lowerBound");
  const upperBound = document.getElementById("upperBound");

  if (lowerBound && upperBound) {
    lowerBound.addEventListener("input", updateDefiniteIntegralInputs);
    upperBound.addEventListener("input", updateDefiniteIntegralInputs);
  }
}

export function addInputValidation() {
  const inputs = [calcExpressionInput, graphExpressionInput];

  inputs.forEach((input) => {
    if (input) {
      input.addEventListener("input", function () {
        validateExpression(this);
      });

      input.addEventListener("blur", function () {
        if (this.value.trim() === "") {
          this.style.borderColor = "#e0e0e0";
        }
      });
    }
  });
}

export function addKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      if (!isCalculating) {
        performCalculation();
      }
    }

    if (e.altKey && e.key === "Enter") {
      e.preventDefault();
      if (!isCalculating) {
        generateGraph();
      }
    }

    if (e.key === "Escape") {
      clearResults();
    }
  });
}
