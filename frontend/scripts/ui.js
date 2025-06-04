import { currentOperation } from "../main.js";
import { downloadGraph } from "./helper.js";

let calcExpressionInput;
let graphExpressionInput;
let calcResult;
let graphResult;
let loadingOverlay;
let imageSolutionDisplay;
let mainResultDisplay;
let stepsContentDisplay;
let calcErrorElement;
let graphErrorElement;
let imageErrorElement;

export function initializeDOMElements() {
  console.log("Initializing DOM elements...");
  calcExpressionInput = document.getElementById("calcExpression");
  graphExpressionInput = document.getElementById("graphExpression");
  calcResult = document.getElementById("calcResult");
  graphResult = document.getElementById("graphResult");
  loadingOverlay = document.getElementById("loadingOverlay");
  imageSolutionDisplay = document.getElementById("imageSolutionDisplay");
  calcErrorElement = document.getElementById("calcError");
  graphErrorElement = document.getElementById("graphError");
  imageErrorElement = document.getElementById("imageError");
  if (calcResult) {
    mainResultDisplay = calcResult.querySelector(".main-result");
    stepsContentDisplay = calcResult.querySelector(".steps-content");
    console.log("calcResult and its children initialized.");
  } else {
    console.error(
      "Element with ID 'calcResult' not found in the DOM. Check main.html."
    );
  }
}

export function setLoading(isLoading) {
  const calculateBtn = document.getElementById("calculateBtn");
  const graphBtn = document.getElementById("graphBtn");
  const processImageBtn = document.getElementById("processImageBtn");

  const overlay = loadingOverlay;

  if (isLoading) {
    overlay.style.display = "flex";
    if (calculateBtn) calculateBtn.disabled = true;
    if (graphBtn) graphBtn.disabled = true;
    if (processImageBtn) processImageBtn.disabled = true;
    if (calculateBtn) calculateBtn.style.opacity = "0.6";
    if (graphBtn) graphBtn.style.opacity = "0.6";
    if (processImageBtn) processImageBtn.style.opacity = "0.6";
  } else {
    overlay.style.display = "none";
    if (calculateBtn) calculateBtn.disabled = false;
    if (graphBtn) graphBtn.disabled = false;
    if (processImageBtn) processImageBtn.disabled = false;
    if (calculateBtn) calculateBtn.style.opacity = "1";
    if (graphBtn) graphBtn.style.opacity = "1";
    if (processImageBtn) processImageBtn.style.opacity = "1";
  }
}

export function showNotification(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
}

export function showError(message, type = "calc") {
  let errorElement;
  if (type === "calc") {
    errorElement = document.getElementById("calcError");
  } else if (type === "graph") {
    errorElement = document.getElementById("graphError");
  } else if (type === "image") {
    errorElement = document.getElementById("imageError");
  }

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    requestAnimationFrame(() => {
      errorElement.classList.add("show");
    });
  }

  setTimeout(() => {
    if (errorElement) {
      errorElement.classList.remove("show");
      setTimeout(() => {
        errorElement.style.display = "none";
      }, 300);
    }
  }, 5000);
}

export function ensureMathJaxReady(callback) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    callback();
  } else {
    let attempts = 0;
    const maxAttempts = 50;
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.MathJax && window.MathJax.typesetPromise) {
        clearInterval(checkInterval);
        callback();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.error("MathJax failed to load within timeout");
      }
    }, 100);
  }
}

export function formatMathExpression(text) {
  if (!text) return text;

  let formattedText = text
    .replace(/d\/dx\[([^\]]+)\]/g, "\\frac{d}{dx}[$1]")
    .replace(/\*x\^?\(([^)]+)\)/g, " \\cdot x^{$1}")
    .replace(/x\^([a-zA-Z0-9]+)/g, "x^{$1}")
    .replace(/\*/g, " \\cdot ")
    .replace(/\^?\(([^)]+)\)/g, "^{$1}");

  if (!formattedText.includes("$$") && !formattedText.includes("\\(")) {
    formattedText = `$$${formattedText}$$`;
  }

  return formattedText;
}

export function processAllMathContent() {
  const mathElements = document.querySelectorAll(
    ".result-latex, .step-math, .latex"
  );

  mathElements.forEach((element) => {
    let content = element.innerHTML;

    if (
      !content.includes("$$") &&
      !content.includes("\\(") &&
      (content.includes("d/dx") ||
        content.includes("^") ||
        content.includes("*"))
    ) {
      const formattedContent = formatMathExpression(content);
      element.innerHTML = formattedContent;
    }
  });

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise()
      .then(() => {
        console.log("All math content reprocessed");
      })
      .catch((err) => {
        console.error("MathJax reprocessing failed:", err);
      });
  }
}

export function showCalculationResult(result, steps) {
  calcResult.querySelector(".result-placeholder").style.display = "none";
  calcResult.querySelector(".result-content").style.display = "block";

  if (calcResult) {
    const resultPlaceholder = calcResult.querySelector(".result-placeholder");
    const resultContent = calcResult.querySelector(".result-content");
    if (resultPlaceholder) resultPlaceholder.style.display = "none";
    if (resultContent) resultContent.style.display = "block";
  }

  if (mainResultDisplay) {
    let resultHtml = '<h4>Hasil:</h4><div class="result-latex">';

    if (typeof result === "object" && result !== null) {
      for (const key in result) {
        if (Object.hasOwnProperty.call(result, key)) {
          resultHtml += `<p><strong>${key.replace(/_/g, " ")}:</strong> $$${
            result[key]
          }$$</p>`;
        }
      }
    } else if (result) {
      resultHtml += `$$${result}$$`;
    } else {
      resultHtml += `<p>Tidak ada hasil yang tersedia.</p>`;
    }
    resultHtml += "</div>";
    mainResultDisplay.innerHTML = resultHtml;
  }

  if (steps && steps.length > 0) {
    let stepsHtml =
      '<h4 class="steps-title">Langkah-langkah Penyelesaian:</h4><ol class="math-steps-list">';
    steps.forEach((step, index) => {
      const description = step.description || "";
      const latex = step.latex || "";

      let formattedLatex = latex;

      if (
        currentOperation === "integral" ||
        currentOperation === "integral_tentu"
      ) {
        formattedLatex = latex
          .replace(/\\int/g, "\\displaystyle\\int")
          .replace(/\\frac/g, "\\displaystyle\\frac")
          .replace(/\\sum/g, "\\displaystyle\\sum");
      }

      formattedLatex = formattedLatex
        .replace(/\\frac{([^}]+)}{([^}]+)}/g, "\\displaystyle\\frac{$1}{$2}")
        .replace(/\\sqrt{([^}]+)}/g, "\\sqrt{$1}");

      if (
        !formattedLatex.includes("\\displaystyle") &&
        formattedLatex.length > 0
      ) {
        formattedLatex = `\\displaystyle ${formattedLatex}`;
      }

      stepsHtml += `
      <li class="math-step-item" data-step="${index + 1}">
        <div class="step-description">${description}</div>
        <div class="step-math">$$${formattedLatex}$$</div>
      </li>`;
    });
    stepsHtml += "</ol>";

    if (stepsContentDisplay) {
      stepsContentDisplay.innerHTML = stepsHtml;
      stepsContentDisplay.style.display = "block";

      const stepItems = stepsContentDisplay.querySelectorAll(".math-step-item");
      stepItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      });
    }
  }

  ensureMathJaxReady(() => {
    setTimeout(() => {
      window.MathJax.typesetPromise([calcResult])
        .then(() => {
          console.log("MathJax typeset for calcResult completed.");
        })
        .catch((err) => {
          console.error("MathJax typesetting failed:", err);
          setTimeout(() => {
            if (window.MathJax && window.MathJax.typesetPromise) {
              window.MathJax.typesetPromise([calcResult]);
            }
          }, 1000);
        });
    }, 100);
  });
}

export function initMathProcessing() {
  document.addEventListener("DOMContentLoaded", processAllMathContent);

  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const hasMatElements =
              node.querySelectorAll &&
              node.querySelectorAll(".result-latex, .step-math, .latex")
                .length > 0;
            if (hasMatElements) {
              shouldProcess = true;
            }
          }
        });
      }
    });

    if (shouldProcess) {
      setTimeout(processAllMathContent, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function showGraphResult(imgSrc) {
  if (!graphResult) {
    console.error("graphResult element not found");
    return;
  }
  graphResult.innerHTML = `
        <img src="${imgSrc}" alt="Grafik Fungsi" style="max-width: 100%; height: auto; border-radius: var(--radius-small);">
        <button id="downloadGraphBtn" class="action-btn secondary-btn download-btn">
            <span class="btn-icon">💾</span> Unduh Grafik
        </button>
    `;

  const graphPlaceholder = graphResult.querySelector(".graph-placeholder");
  if (graphPlaceholder) {
    graphPlaceholder.style.display = "none";
  }
  const imgElement = graphResult.querySelector("img");
  if (imgElement) {
    imgElement.style.display = "block";
  }
  const downloadBtn = document.getElementById("downloadGraphBtn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const expression = graphExpressionInput?.value || "default";
      downloadGraph(imgSrc, expression);
    });
  }
}

export function clearResults() {
  calcResult.querySelector(".result-placeholder").style.display = "flex";
  calcResult.querySelector(".result-content").style.display = "none";
  mainResultDisplay.innerHTML = "";
  stepsContentDisplay.innerHTML = "";

  graphResult.innerHTML = `
    <div class="graph-placeholder">
        <div class="placeholder-icon">📊</div>
        <p>Grafik akan muncul di sini</p>
    </div>
    `;

  imageSolutionDisplay.innerHTML = "";
  const selectedImageName = document.getElementById("selectedImageName");
  if (selectedImageName) {
    selectedImageName.textContent = "Belum ada gambar dipilih";
  }
  const imageInput = document.getElementById("imageInput");
  if (imageInput) {
    imageInput.value = "";
  }

  document.getElementById("calcError").style.display = "none";
  document.getElementById("graphError").style.display = "none";
  document.getElementById("imageError").style.display = "none";
}

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = Array.from({ length: 200 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  dx: Math.random() - 0.5,
  dy: Math.random() - 0.5,
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(drawParticles);
}

drawParticles();

export function updateInputPlaceholder(operation) {
  const calcExpressionInput = document.getElementById("calcExpression");
  const additionalParamsDiv = document.getElementById("additionalParams");
  const calculateBtn = document.getElementById("calculateBtn");

  if (calcExpressionInput) {
    calcExpressionInput.value = "";
    calcExpressionInput.style.display = "block";
    calcExpressionInput.previousElementSibling.style.display = "block";
  }
  if (additionalParamsDiv) {
    additionalParamsDiv.innerHTML = "";
    additionalParamsDiv.style.display = "none";
  }
  if (calculateBtn) {
    calculateBtn.innerHTML = '<span class="btn-icon">🚀</span> Hitung Sekarang';
  }

  let placeholderText = "Masukkan ekspresi matematika...";
  let labelText = "Masukkan Ekspresi Matematika:";

  switch (operation) {
    case "aritmatika":
      placeholderText = "Contoh: 5 * (3 + 2) - 10 / 2";
      labelText = "Ekspresi Aritmatika:";
      break;
    case "persamaan":
      placeholderText = "Contoh: x^2 - 4 = 0 atau [x+y=5, x-y=1]";
      labelText = "Persamaan (gunakan koma untuk banyak persamaan):";
      break;
    case "faktorisasi":
      placeholderText = "Contoh: x^2 - 4 atau 6x^2 + 11x - 10";
      labelText = "Ekspresi yang akan difaktorisasi:";
      break;
    case "substitusi":
      placeholderText = "Contoh: x^2 + y^2";
      labelText = "Ekspresi untuk disubstitusi:";
      const subsInput = document.createElement("input");
      subsInput.type = "text";
      subsInput.id = "subsValues";
      subsInput.placeholder = "Contoh: x=5, y=3";
      subsInput.className = "dynamic-param-input";
      const subsLabel = document.createElement("label");
      subsLabel.htmlFor = "subsValues";
      subsLabel.textContent = "Nilai Substitusi (contoh: x=5, y=3):";
      additionalParamsDiv.appendChild(subsLabel);
      additionalParamsDiv.appendChild(subsInput);
      additionalParamsDiv.style.display = "block";
      break;
    case "statistika":
      placeholderText = "Contoh: 1, 2, 3, 4, 5";
      labelText = "Data (pisahkan dengan koma):";
      const statsTypeSelect = document.createElement("select");
      statsTypeSelect.id = "statsType";
      statsTypeSelect.className = "dynamic-param-select";
      statsTypeSelect.innerHTML = `
                <option value="mean">Rata-rata (Mean)</option>
                <option value="median">Median</option>
                <option value="mode">Modus (Mode)</option>
                <option value="stdev">Deviasi Standar (StDev)</option>
                <option value="variance">Variansi (Variance)</option>
            `;
      const statsTypeLabel = document.createElement("label");
      statsTypeLabel.htmlFor = "statsType";
      statsTypeLabel.textContent = "Jenis Statistik:";
      additionalParamsDiv.appendChild(statsTypeLabel);
      additionalParamsDiv.appendChild(statsTypeSelect);
      additionalParamsDiv.style.display = "block";
      break;
    case "pecahan":
      placeholderText = "Contoh: 1/2 atau 2/3 (untuk expr1)";
      labelText = "Ekspresi Pecahan 1:";
      const fractionActionSelect = document.createElement("select");
      fractionActionSelect.id = "fractionAction";
      fractionActionSelect.className = "dynamic-param-select";
      fractionActionSelect.innerHTML = `
                <option value="simplify">Sederhanakan</option>
                <option value="add">Tambah</option>
                <option value="subtract">Kurang</option>
                <option value="multiply">Kali</option>
                <option value="divide">Bagi</option>
                <option value="compare">Bandingkan</option>
            `;
      const fractionActionLabel = document.createElement("label");
      fractionActionLabel.htmlFor = "fractionAction";
      fractionActionLabel.textContent = "Aksi:";
      additionalParamsDiv.appendChild(fractionActionLabel);
      additionalParamsDiv.appendChild(fractionActionSelect);

      const fractionExpr2Input = document.createElement("input");
      fractionExpr2Input.type = "text";
      fractionExpr2Input.id = "expr2";
      fractionExpr2Input.placeholder =
        "Contoh: 1/4 (hanya untuk operasi 2 pecahan)";
      fractionExpr2Input.className = "dynamic-param-input";
      const fractionExpr2Label = document.createElement("label");
      fractionExpr2Label.htmlFor = "expr2";
      fractionExpr2Label.textContent = "Ekspresi Pecahan 2 (opsional):";
      additionalParamsDiv.appendChild(fractionExpr2Label);
      additionalParamsDiv.appendChild(fractionExpr2Input);

      additionalParamsDiv.style.display = "block";

      fractionActionSelect.addEventListener("change", function () {
        if (this.value === "simplify") {
          fractionExpr2Input.style.display = "none";
          fractionExpr2Label.style.display = "none";
        } else {
          fractionExpr2Input.style.display = "block";
          fractionExpr2Label.style.display = "block";
        }
      });
      if (fractionActionSelect.value === "simplify") {
        fractionExpr2Input.style.display = "none";
        fractionExpr2Label.style.display = "none";
      }

      break;
    case "deret_aritmatika":
    case "deret_geometri":
      calcExpressionInput.style.display = "none";
      calcExpressionInput.previousElementSibling.style.display = "none";

      const firstTermInput = document.createElement("input");
      firstTermInput.type = "number";
      firstTermInput.id = "firstTerm";
      firstTermInput.placeholder = "Contoh: 1";
      firstTermInput.value = "1";
      firstTermInput.className = "dynamic-param-input";
      const firstTermLabel = document.createElement("label");
      firstTermLabel.htmlFor = "firstTerm";
      firstTermLabel.textContent = "Suku Pertama (a₁):";
      additionalParamsDiv.appendChild(firstTermLabel);
      additionalParamsDiv.appendChild(firstTermInput);

      const diffRatioLabelText =
        operation === "deret_aritmatika" ? "Beda (d):" : "Rasio (r):";
      const diffRatioInput = document.createElement("input");
      diffRatioInput.type = "number";
      diffRatioInput.id = "commonDiffRatio";
      diffRatioInput.placeholder = "Contoh: 2";
      diffRatioInput.value = "2";
      diffRatioInput.className = "dynamic-param-input";
      const diffRatioLabel = document.createElement("label");
      diffRatioLabel.htmlFor = "commonDiffRatio";
      diffRatioLabel.textContent = diffRatioLabelText;
      additionalParamsDiv.appendChild(diffRatioLabel);
      additionalParamsDiv.appendChild(diffRatioInput);

      const nTermInput = document.createElement("input");
      nTermInput.type = "number";
      nTermInput.id = "nTerm";
      nTermInput.placeholder = "Contoh: 5";
      nTermInput.value = "5";
      nTermInput.className = "dynamic-param-input";
      const nTermLabel = document.createElement("label");
      nTermLabel.htmlFor = "nTerm";
      nTermLabel.textContent = "Suku/Jumlah ke-n (n):";
      additionalParamsDiv.appendChild(nTermLabel);
      additionalParamsDiv.appendChild(nTermInput);

      const seqTypeSelect = document.createElement("select");
      seqTypeSelect.id = "seqType";
      seqTypeSelect.className = "dynamic-param-select";
      seqTypeSelect.innerHTML = `
                <option value="term">Suku ke-n</option>
                <option value="sum">Jumlah n suku</option>
            `;
      const seqTypeLabel = document.createElement("label");
      seqTypeLabel.htmlFor = "seqType";
      seqTypeLabel.textContent = "Jenis Perhitungan:";
      additionalParamsDiv.appendChild(seqTypeLabel);
      additionalParamsDiv.appendChild(seqTypeSelect);
      additionalParamsDiv.style.display = "block";
      break;
    case "limit":
      placeholderText = "Contoh: sin(x)/x";
      labelText = "Ekspresi Limit:";
      const limitPointInput = document.createElement("input");
      limitPointInput.type = "text";
      limitPointInput.id = "limitPoint";
      limitPointInput.placeholder = "Contoh: 0 atau oo (infinity)";
      limitPointInput.value = "0";
      limitPointInput.className = "dynamic-param-input";
      const limitPointLabel = document.createElement("label");
      limitPointLabel.htmlFor = "limitPoint";
      limitPointLabel.textContent = "Titik Limit (x →):";
      additionalParamsDiv.appendChild(limitPointLabel);
      additionalParamsDiv.appendChild(limitPointInput);
      additionalParamsDiv.style.display = "block";
      break;
    case "trigonometri":
      placeholderText = "Contoh: sin(x)**2 + cos(x)**2";
      labelText = "Ekspresi Trigonometri:";
      break;
    case "turunan":
      placeholderText = "Contoh: x**3 + 2*x";
      labelText = "Ekspresi Turunan:";
      break;
    case "integral":
      placeholderText = "Contoh: x**2";
      labelText = "Ekspresi Integral:";
      break;
    case "integral_tentu":
      placeholderText = "Contoh: x**2";
      labelText = "Ekspresi Integral Tentu:";

      const lowerBoundInput = document.createElement("input");
      lowerBoundInput.type = "text";
      lowerBoundInput.id = "lowerBound";
      lowerBoundInput.placeholder = "Batas Bawah";
      lowerBoundInput.className = "dynamic-param-input";
      const lowerBoundLabel = document.createElement("label");
      lowerBoundLabel.htmlFor = "lowerBound";
      lowerBoundLabel.textContent = "Batas Bawah:";
      additionalParamsDiv.appendChild(lowerBoundLabel);
      additionalParamsDiv.appendChild(lowerBoundInput);

      const upperBoundInput = document.createElement("input");
      upperBoundInput.type = "text";
      upperBoundInput.id = "upperBound";
      upperBoundInput.placeholder = "Batas Atas";
      upperBoundInput.className = "dynamic-param-input";
      const upperBoundLabel = document.createElement("label");
      upperBoundLabel.htmlFor = "upperBound";
      upperBoundLabel.textContent = "Batas Atas:";
      additionalParamsDiv.appendChild(upperBoundLabel);
      additionalParamsDiv.appendChild(upperBoundInput);
      additionalParamsDiv.style.display = "block";

      const integralPreviewDiv = document.createElement("div");
      integralPreviewDiv.id = "integralPreview";
      integralPreviewDiv.className = "input-helper";
      integralPreviewDiv.innerHTML =
        "<small>Pratinjau: ∫<sub>a</sub><sup>b</sup> f(x) dx</small>";
      additionalParamsDiv.appendChild(integralPreviewDiv);
      updateDefiniteIntegralInputs();
      break;
    case "logaritma":
      placeholderText = "Contoh: log(x^2) atau log(x, 2) untuk basis 2";
      labelText = "Ekspresi Logaritma:";
      break;
    case "fungsi":
      placeholderText = "Contoh: f(x) = x^2 + 2x + 1";
      labelText = "Definisi Fungsi:";
      break;
    default:
      placeholderText = "Masukkan ekspresi matematika...";
      labelText = "Masukkan Ekspresi Matematika:";
      break;
  }

  if (calcExpressionInput) {
    calcExpressionInput.placeholder = placeholderText;
    calcExpressionInput.previousElementSibling.textContent = labelText;
  }
}

import { getCurrentOperation } from "../main.js";

export function updateDefiniteIntegralInputs() {
  const integralInputs = document.getElementById("integralInputs");
  const currentOp = getCurrentOperation();

  if (currentOp === "integral_tentu") {
    if (integralInputs) {
      integralInputs.style.display = "block";

      const lowerValue = document.getElementById("lowerBound")?.value || "0";
      const upperValue = document.getElementById("upperBound")?.value || "1";

      const previewLower = document.getElementById("previewLower");
      const previewUpper = document.getElementById("previewUpper");

      if (previewLower) previewLower.textContent = lowerValue;
      if (previewUpper) previewUpper.textContent = upperValue;
    }
  } else {
    if (integralInputs) {
      integralInputs.style.display = "none";
    }
  }
}

let scrollY = 0;

export function initializeHelpModal() {
  const helpBtn = document.getElementById("helpBtn");
  const helpModal = document.getElementById("helpModal");
  const helpContentElement = document.getElementById("helpContent");
  const closeModalBtn = helpModal?.querySelector(".close");

  if (!helpBtn || !helpModal || !helpContentElement) return;

  helpBtn.addEventListener("click", () => {
    scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    showHelpModalContent(helpContentElement);
    helpModal.style.display = "flex";

    setTimeout(() => {
      scrollToHelpContent();
    }, 100);
  });

  function closeHelpModal() {
    helpModal.style.display = "none";

    document.body.style.overflow = "";
    document.body.style.width = "";
    document.body.style.top = "";
    window.scrollTo(scrollY);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeHelpModal);
  }

  window.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      closeHelpModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && helpModal.style.display === "flex") {
      closeHelpModal();
    }
  });
}

function scrollToHelpContent() {
  const helpModal = document.getElementById("helpModal");
  const helpContent = document.getElementById("helpContent");

  const modalContent = helpModal?.querySelector(".modal-content");
  if (modalContent) {
    modalContent.scrollTo({ top: 0, behavior: "smooth" });

    const firstHeading = helpContent?.querySelector("h2, h3, h4");
    if (firstHeading) {
      firstHeading.setAttribute("tabindex", "-1");
      firstHeading.focus();
    }
  }
}

function showHelpModalContent(helpContentElement) {
  const helpText = `
    <h3 id="help-title">Cara Menggunakan Kalkulator Matematika</h3>
    <p>Aplikasi ini membantu Anda menyelesaikan berbagai jenis perhitungan matematika dengan langkah-langkah penyelesaian.</p>

    <h4 id="basic-steps">Langkah-langkah Dasar:</h4>
    <ol>
      <li>Pilih jenis operasi yang diinginkan dari daftar tombol.</li>
      <li>Masukkan ekspresi matematika di kotak input sesuai dengan operasi yang dipilih.</li>
      <li>Klik tombol "Hitung Sekarang" untuk melihat hasilnya dan langkah-langkah penyelesaian.</li>
    </ol>

    <h4 id="additional-features">Fitur Tambahan:</h4>
    <ul>
      <li><strong>Visualisasi Grafik:</strong> Masukkan fungsi di bagian "Visualisasi Grafik" untuk melihat representasi visualnya.</li>
      <li><strong>Riwayat Perhitungan:</strong> Semua perhitungan Anda akan disimpan di bagian "Riwayat Perhitungan" agar mudah diakses kembali.</li>
      <li><strong>Keyboard Shortcuts:</strong>
        <ul style="list-style-type: square;">
          <li><code>Ctrl + Enter</code>: Hitung ekspresi matematika.</li>
          <li><code>Alt + Enter</code>: Buat grafik fungsi.</li>
          <li><code>Esc</code>: Bersihkan semua hasil dan input.</li>
        </ul>
      </li>
    </ul>

    <h4 id="writing-format">Format Penulisan Umum:</h4>
    <ul>
      <li>Gunakan <code>^</code> untuk pangkat: <code>x^2</code> (x kuadrat)</li>
      <li>Gunakan <code>*</code> untuk perkalian: <code>2*x</code> (2 kali x) atau bisa dimasukkan langsung angka berikutnya <code>(2x^4)</code></li>
      <li>Fungsi trigonometri: <code>sin(x)</code>, <code>cos(x)</code>, <code>tan(x)</code></li>
      <li>Logaritma: <code>log(x)</code> (logaritma natural), <code>log(x, basis)</code></li>
      <li>Eksponen: <code>exp(x)</code> atau <code>E**x</code> (e pangkat x)</li>
      <li>Pecahan: <code>1/2</code></li>
      <li>Bilangan kompleks: <code>I</code> (untuk imajiner, misal: <code>2 + 3*I</code>)</li>
      <li>Akar kuadrat: <code>sqrt(x)</code></li>
      <li>Nilai Absolut: <code>Abs(x)</code></li>
    </ul>
    
    <h4 id="specific-operations">Catatan untuk Operasi Spesifik:</h4>
    <ul>
        <li><strong>Persamaan:</strong> Untuk sistem persamaan, pisahkan dengan koma, contoh: <code>[x+y=5, x-y=1]</code>.</li>
        <li><strong>Substitusi:</strong> Masukkan ekspresi dan nilai pengganti, contoh: <code>x=5, y=3</code>.</li>
        <li><strong>Statistika:</strong> Masukkan angka dipisahkan koma, contoh: <code>1, 2, 3, 4, 5</code>.</li>
        <li><strong>Deret Aritmatika/Geometri:</strong> Masukkan suku pertama, beda/rasio, dan suku ke-n/jumlah n.</li>
        <li><strong>Limit:</strong> Masukkan titik limit, gunakan <code>oo</code> untuk tak hingga.</li>
        <li><strong>Integral Tentu:</strong> Masukkan batas bawah dan batas atas.</li>
    </ul>
    `;
  if (helpContentElement) {
    helpContentElement.innerHTML = helpText;

    helpContentElement.addEventListener(
      "wheel",
      function (event) {
        const element = event.currentTarget;
        const maxScrollTop = element.scrollHeight - element.clientHeight;
        const delta = event.deltaY;

        if (delta < 0 && element.scrollTop <= 0) {
          event.preventDefault();
        } else if (delta > 0 && element.scrollTop >= maxScrollTop) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    let touchStartY = 0;
    helpContentElement.addEventListener("touchstart", function (event) {
      touchStartY = event.touches[0].clientY;
    });

    helpContentElement.addEventListener(
      "touchmove",
      function (event) {
        const touchY = event.touches[0].clientY;
        const delta = touchStartY - touchY;
        const element = event.currentTarget;
        const maxScrollTop = element.scrollHeight - element.clientHeight;

        if (delta < 0 && element.scrollTop <= 0) {
          event.preventDefault();
        } else if (delta > 0 && element.scrollTop >= maxScrollTop) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  }
}

class ScrollToTopButton {
  constructor() {
    this.button = null;
    this.scrollThreshold = 300;
    this.isVisible = false;
    this.init();
  }

  init() {
    this.getExistingButton();
    if (!this.button) return;
    this.bindEvents();
    this.checkScroll();
  }

  getExistingButton() {
    this.button = document.getElementById("scrollToTopBtn");
  }

  bindEvents() {
    let scrollTimer = null;
    window.addEventListener("scroll", () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => this.checkScroll(), 10);
    });

    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      this.scrollToTop();
    });

    this.button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.scrollToTop();
      }
    });
  }

  checkScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.scrollThreshold && !this.isVisible) {
      this.showButton();
    } else if (scrollTop <= this.scrollThreshold && this.isVisible) {
      this.hideButton();
    }
  }

  showButton() {
    this.isVisible = true;
    this.button.classList.add("show");
    this.button.classList.add("pulse");
    setTimeout(() => this.button.classList.remove("pulse"), 600);
    this.button.setAttribute("aria-hidden", "false");
  }

  hideButton() {
    this.isVisible = false;
    this.button.classList.remove("show");
    this.button.setAttribute("aria-hidden", "true");
  }

  scrollToTop() {
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      this.smoothScrollPolyfill();
    }
    this.addClickAnimation();
  }

  smoothScrollPolyfill() {
    const startPosition = window.pageYOffset;
    const duration = 500;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuad(
        timeElapsed,
        startPosition,
        -startPosition,
        duration
      );
      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  addClickAnimation() {
    this.button.style.transform = "translateY(-3px) scale(1.05)";
    setTimeout(() => (this.button.style.transform = ""), 150);
  }
}

let scrollToTopInstance = null;

export function initScrollToTop() {
  if (!scrollToTopInstance) {
    scrollToTopInstance = new ScrollToTopButton();
  }
}

document.addEventListener("DOMContentLoaded", initScrollToTop);

if (typeof window !== "undefined") {
  window.initScrollToTop = initScrollToTop;
  window.scrollToTopInstance = scrollToTopInstance;
}
