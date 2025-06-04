export function convertToPythonSyntax(expression) {
  let converted = expression;

  const superscriptMap = {
    "²": "**2",
    "³": "**3",
    "⁴": "**4",
    "⁵": "**5",
    "⁶": "**6",
    "⁷": "**7",
    "⁸": "**8",
    "⁹": "**9",
    "⁰": "**0",
  };

  for (const [sup, replacement] of Object.entries(superscriptMap)) {
    converted = converted.replace(new RegExp(sup, "g"), replacement);
  }

  converted = converted.replace(/<sup>(\d+)<\/sup>/g, "**$1");

  converted = converted.replace(/sin\s*\(/g, "sin(");
  converted = converted.replace(/cos\s*\(/g, "cos(");
  converted = converted.replace(/tan\s*\(/g, "tan(");
  converted = converted.replace(/log\s*\(/g, "log(");
  converted = converted.replace(/exp\s*\(/g, "exp(");
  converted = converted.replace(/sqrt\s*\(/g, "sqrt(");
  converted = converted.replace(/\^/g, "**");
  converted = converted.replace(/(\))(\()/g, "$1*$2");
  converted = converted.replace(/(\d)([a-zA-Z])/g, "$1*$2");
  converted = converted.replace(/(\d)(sin|cos|tan|log|exp|sqrt)/g, "$1*$2");
  converted = converted.replace(/([a-zA-Z])(\d)/g, "$1*$2");

  return converted;
}

export function convertToMathNotation(expression) {
  let converted = expression;

  const superscriptMap = {
    "**2": "²",
    "**3": "³",
    "**4": "⁴",
    "**5": "⁵",
    "**6": "⁶",
    "**7": "⁷",
    "**8": "⁸",
    "**9": "⁹",
    "**0": "⁰",
  };

  for (const [op, sup] of Object.entries(superscriptMap)) {
    converted = converted.replace(new RegExp(op, "g"), sup);
  }

  converted = converted.replace(/(\w+|\([^)]+\))\*\*(\w+|\([^)]+\))/g, "$1^$2");
  converted = converted.replace(/(\w+|\([^)]+\))\*\*(\d+)/g, "$1^$2");
  converted = converted.replace(/(\w+)\*\*(\w+)/g, "$1^$2");

  converted = converted.replace(/(\d)\*([a-zA-Z])/g, "$1$2");
  converted = converted.replace(/([a-zA-Z])\*(\d)/g, "$1$2");
  converted = converted.replace(/\*/g, "×");

  converted = converted.replace(/sqrt/g, "√");
  converted = converted.replace(/pi/g, "π");
  converted = converted.replace(/inf/g, "∞");
  converted = converted.replace(/oo/g, "∞");

  return converted;
}

export function validateExpression(input) {
  const value = input.value.trim();
  if (value === "") {
    input.style.borderColor = "#e0e0e0";
    return true;
  }

  const validChars =
    /^[a-zA-Z0-9+\-*/().,\s^_=<>!~|`@#$%&;:'"\[\]{}?²³⁴⁵⁶⁷⁸⁹⁰<sup>\d+<\/sup>]*$/;
  const isValid = validChars.test(value);

  input.style.borderColor = isValid ? "#51cf66" : "#ff6b6b";
  return isValid;
}

export function downloadGraph(imageUrl, expression) {
  try {
    console.log("imageUrl:", imageUrl);
    console.log("expression:", expression);
    const link = document.createElement("a");
    link.href = imageUrl;
    const fileName = expression.trim()
      ? `grafik_${expression.replace(/[^a-zA-Z0-9]/g, "_")}.png`
      : "grafik_default.png";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Gagal mengunduh grafik:", error);
    alert("Gagal mengunduh grafik. Pastikan URL gambar valid.");
  }
}

window.downloadGraph = downloadGraph;
