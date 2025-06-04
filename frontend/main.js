import {
  initializeEventListeners,
  addInputValidation,
  addKeyboardShortcuts,
} from "./scripts/events.js";
import { populateExamplesGrid } from "./scripts/example.js";
import {
  initializeHelpModal,
  updateDefiniteIntegralInputs,
  initializeDOMElements,
  initScrollToTop,
} from "./scripts/ui.js";

export const API_BASE_URL = "https://kalk-backend.onrender.com";
export let currentOperation = "aritmatika";
export let isCalculating = false;

document.addEventListener("DOMContentLoaded", function () {
  initializeDOMElements();
  initializeEventListeners();
  addInputValidation();
  addKeyboardShortcuts();
  populateExamplesGrid();
  initializeHelpModal();
  initScrollToTop();
  updateDefiniteIntegralInputs();

  document.getElementById("calculate-button").addEventListener("click", () => {
    const expression = document.getElementById("expression-input").value;
    calculateExpression(expression);
  });
});

export function setCurrentOperation(operation) {
  currentOperation = operation;
}

export function setIsCalculating(calculating) {
  isCalculating = calculating;
}

export function getCurrentOperation() {
  return currentOperation;
}

export async function calculateExpression(expression) {
  setIsCalculating(true);
  try {
    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation: currentOperation,
        expression: expression,
        variables: ["x"],
        params: {},
        equations: [],
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    document.getElementById("math-output").innerHTML = `\\[${data.result}\\]`;
    MathJax.typeset();
    await generateGraph(expression);
  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + error.message);
  } finally {
    setIsCalculating(false);
  }
}

export async function generateGraph(expression) {
  try {
    const response = await fetch(`${API_BASE_URL}/graph`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression }),
    });
    if (!response.ok) throw new Error("Failed to generate graph");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    document.getElementById("plot-output").innerHTML = `<img src="${url}" />`;
  } catch (error) {
    console.error("Graph Error:", error);
    alert("Graph Error: " + error.message);
  }
}
