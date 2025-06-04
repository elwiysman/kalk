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

export const API_BASE_URL = "http://localhost:5000";
//export const API_BASE_URL =
//  window.location.hostname === "localhost"
//    ? "http://localhost:5000"
//    : "https://6810-103-18-34-184.ngrok-free.app";
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
