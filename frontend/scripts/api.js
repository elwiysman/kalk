import { API_BASE_URL, currentOperation, setIsCalculating } from "../main.js";
import {
  setLoading,
  showError,
  showCalculationResult,
  showGraphResult,
} from "./ui.js";
import { convertToPythonSyntax, validateExpression } from "./helper.js";
import { getAdditionalParams } from "./operation.js";
import { addToHistory } from "./history.js";

const calcExpressionInput = document.getElementById("calcExpression");
const graphExpressionInput = document.getElementById("graphExpression");

export async function performCalculation() {
  const expression = calcExpressionInput?.value.trim();
  if (!expression) {
    showError("Silakan masukkan ekspresi matematika terlebih dahulu!", "calc");
    calcExpressionInput?.focus();
    return;
  }

  if (calcExpressionInput && !validateExpression(calcExpressionInput)) {
    showError("Ekspresi mengandung karakter yang tidak valid!", "calc");
    return;
  }

  setLoading(true);
  setIsCalculating(true);

  try {
    const pythonExpression = convertToPythonSyntax(expression);
    const params = getAdditionalParams(currentOperation);

    console.log("Sending request:", {
      expression: pythonExpression,
      operation: currentOperation,
      params: params,
      variables: ["x"],
    });

    const response = await fetch(`${API_BASE_URL}/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expression: pythonExpression,
        operation: currentOperation,
        params: params,
        variables: ["x"],
        equations: currentOperation === "equation" ? [pythonExpression] : [],
      }),
    });

    const data = await response.json();
    console.log("Received response:", data);

    if (response.ok) {
      showCalculationResult(data.result, data.steps);
      addToHistory(expression, currentOperation, data.result);
    } else {
      showError(`Error: ${data.error}`, "calc");
    }
  } catch (error) {
    console.error("Calculation error:", error);
    showError(
      "Gagal menghubungi server. Pastikan server Flask berjalan di port 5000.",
      "calc"
    );
  } finally {
    setLoading(false);
    setIsCalculating(false);
  }
}

export async function generateGraph() {
  const expression = graphExpressionInput?.value.trim();

  if (!expression) {
    showError(
      "Silakan masukkan fungsi untuk digambar terlebih dahulu!",
      "graph"
    );
    graphExpressionInput?.focus();
    return;
  }

  if (graphExpressionInput && !validateExpression(graphExpressionInput)) {
    showError("Fungsi mengandung karakter yang tidak valid!", "graph");
    return;
  }

  setLoading(true);
  setIsCalculating(true);

  try {
    const pythonExpression = convertToPythonSyntax(expression);
    console.log("Sending graph request:", { expression: pythonExpression });

    const response = await fetch(`${API_BASE_URL}/graph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: pythonExpression,
        variables: ["x"],
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      showGraphResult(imageUrl, expression);
    } else {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      showError(`Error: ${errorData.error || "Unknown error"}`, "graph");
    }
  } catch (error) {
    console.error("Graph error:", error);
    showError(
      "Gagal menghubungi server. Pastikan server Flask berjalan di port 5000.",
      "graph"
    );
  } finally {
    setLoading(false);
    setIsCalculating(false);
  }
}
