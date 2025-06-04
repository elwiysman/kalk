let calculationHistory = [];

(function loadHistory() {
  try {
    const storedHistory = localStorage.getItem("calculusHistory");
    if (storedHistory) {
      calculationHistory = JSON.parse(storedHistory);
    }
  } catch (e) {
    console.error("Failed to load calculation history from localStorage:", e);
  }
})();

export function addToHistory(expression, operation, result) {
  const historyItem = {
    timestamp: new Date().toLocaleString("id-ID"),
    expression,
    operation,
    result,
    id: Date.now(),
  };

  calculationHistory.unshift(historyItem);

  if (calculationHistory.length > 50) {
    calculationHistory = calculationHistory.slice(0, 50);
  }

  try {
    localStorage.setItem("calculusHistory", JSON.stringify(calculationHistory));
  } catch (e) {
    console.error("Failed to save calculation history to localStorage:", e);
  }
}

export function getHistory() {
  return [...calculationHistory];
}

export function clearHistory() {
  calculationHistory = [];
  try {
    localStorage.removeItem("calculusHistory");
    console.log("Calculation history cleared.");
  } catch (e) {
    console.error("Failed to clear calculation history from localStorage:", e);
  }
}
