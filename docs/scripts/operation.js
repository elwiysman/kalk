import { setCurrentOperation, currentOperation } from "../main.js";
import { updateDefiniteIntegralInputs } from "./ui.js";

const operationButtons = document.querySelectorAll(".operation-btn");
const calculateBtn = document.getElementById("calculateBtn");

export function getOperationName(operation) {
  const names = {
    aritmatika: "🔢 Aritmatika",
    persamaan: "⚖️ Persamaan",
    faktorisasi: "🔧 Faktorisasi",
    substitusi: "🔄 Substitusi",
    statistika: "📈 Statistika",
    pecahan: "➗ Pecahan",
    deret_aritmatika: "📊 Deret Aritmatika",
    deret_geometri: "📈 Deret Geometri",
    limit: "∞ Limit",
    trigonometri: "📐 Trigonometri",
    turunan: "d/dx Turunan",
    integral: "∫ Integral",
    integral_tentu: "∫₀¹ Integral Tentu",
    logaritma: "log Logaritma",
    fungsi: "📈 Fungsi",
  };
  return names[operation] || operation;
}

export function selectOperation(operation) {
  setCurrentOperation(operation);

  operationButtons.forEach((btn) => {
    btn.classList.remove("active");
  });

  const selectedBtn = document.querySelector(`[data-operation="${operation}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add("active");
    selectedBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      selectedBtn.style.transform = "";
    }, 150);
  }

  updateCalculateButtonText(operation);
  updateDefiniteIntegralInputs();
}

export function updateCalculateButtonText(operation) {
  const operationTexts = {
    arithmatika: "Hitung Aritmatika",
    algebra: "Sederhanakan Aljabar",
    fungsi: "Evaluasi Fungsi",
    limit: "Hitung Limit",
    trigonometri: "Sederhanakan Trigonometri",
    turunan: "Hitung Turunan",
    integral: "Hitung Integral",
    integral_tentu: "Hitung Integral Tentu",
    logaritha: "Hitung Logaritma",
    persamaan: "Selesaikan Persamaan",
    faktorisasi: "Faktorkan",
    substitusi: "Substitusi",
    statistika: "Hitung Statistik",
    pecahan: "Operasi Pecahan",
    deret_aritmatika: "Hitung Deret Aritmatika",
    deret_geometri: "Hitung Deret Geometri",
  };

  const btnText = operationTexts[operation] || "Hitung Sekarang";
  if (calculateBtn) {
    calculateBtn.innerHTML = `<span class="btn-icon">⚡</span> ${btnText}`;
  }
}

export function getAdditionalParams(operation) {
  switch (operation) {
    case "pecahan": {
      const action =
        prompt(
          "Operasi pecahan (simplify, add, subtract, multiply, divide, compare, convert)",
          "simplify"
        ) || "simplify";

      const expr1 = prompt("Pecahan pertama (contoh: 1/2)", "1/2") || "1/2";
      let expr2 = "";

      if (action !== "simplify" && action !== "convert") {
        expr2 = prompt("Pecahan kedua (contoh: 1/3)", "1/3") || "1/3";
      }

      return { action, expr1, expr2 };
    }
    case "integral_tentu": {
      const lower = document.getElementById("lowerBound")?.value || "0";
      const upper = document.getElementById("upperBound")?.value || "1";
      return { lower_bound: lower, upper_bound: upper };
    }
    case "substitusi": {
      const old_var =
        prompt("Variabel yang akan diganti (misal: x)", "x") || "x";
      const new_expr = prompt("Ganti dengan ekspresi (misal: 2)", "2") || "2";
      return { old_var, new_expr };
    }
    case "statistika": {
      const dataStr =
        prompt("Masukkan data statistik (pisahkan dengan koma)", "1,2,3,4,5") ||
        "1,2,3,4,5";
      const data_type =
        prompt(
          "Tipe statistik (mean, median, mode, variance, std_dev)",
          "mean"
        ) || "mean";
      const data = dataStr
        .split(",")
        .map((x) => parseFloat(x.trim()))
        .filter((x) => !isNaN(x));
      return { data, data_type };
    }
    case "deret_aritmatika": {
      const first_term = parseFloat(prompt("Suku pertama (a₁)?", "1")) || 1;
      const common_diff = parseFloat(prompt("Beda (d)?", "2")) || 2;
      const n_term = parseInt(prompt("Suku ke berapa (n)?", "5")) || 5;
      const seq_type =
        prompt(
          "Hitung 'term' (suku ke-n) atau 'sum' (jumlah n suku)?",
          "term"
        ) || "term";
      return { first_term, common_diff, n_term, seq_type };
    }
    case "deret_geometri": {
      const first_term = parseFloat(prompt("Suku pertama (a₁)?", "1")) || 1;
      const common_ratio = parseFloat(prompt("Rasio (r)?", "2")) || 2;
      const n_term = parseInt(prompt("Suku ke berapa (n)?", "5")) || 5;
      const seq_type =
        prompt(
          "Hitung 'term' (suku ke-n) atau 'sum' (jumlah n suku)?",
          "term"
        ) || "term";
      return { first_term, common_ratio, n_term, seq_type };
    }
    case "limit": {
      const point = prompt("Limit menuju titik berapa?", "0") || "0";
      return { point };
    }
    case "logaritma": {
      const base =
        prompt("Basis logaritma (default: e untuk ln, 10 untuk log)", "e") ||
        "e";
      return { base };
    }
    default:
      return {};
  }
}
