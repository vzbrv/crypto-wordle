(function (root, factory) {
  const logic = factory();
  if (typeof module === "object" && module.exports) module.exports = logic;
  else root.WordBrainLogic = logic;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function getUtcDateKey(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function pickDailyIndex(dateText, count) {
    if (!Number.isInteger(count) || count <= 0) return 0;
    const dayNumber = Math.floor(Date.parse(`${dateText}T00:00:00Z`) / 86400000);
    const cycle = Math.floor(dayNumber / count);
    const dayInCycle = ((dayNumber % count) + count) % count;
    let stride = Math.max(1, count - 1);
    while (greatestCommonDivisor(stride, count) !== 1) stride -= 1;
    return (hashText(`cycle:${cycle}`) % count + dayInCycle * stride) % count;
  }

  function hashText(value) {
    let hash = 2166136261;
    for (const char of String(value)) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function greatestCommonDivisor(a, b) {
    while (b) [a, b] = [b, a % b];
    return a;
  }

  function cleanInput(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();
  }

  function compact(value) {
    return cleanInput(value).replace(/[^A-Z0-9]/g, "");
  }

  function fitGuessToPattern(guess, answerPattern) {
    const chars = compact(guess).split("");
    if (chars.length !== compact(answerPattern).length) return null;
    let pointer = 0;
    return answerPattern.split("").map((char) => {
      if (char === " ") return " ";
      const next = chars[pointer] || "";
      pointer += 1;
      return next;
    }).join("");
  }

  function scoreGuess(guess, answerPattern) {
    const result = Array(answerPattern.length).fill("absent");
    const fittedGuess = fitGuessToPattern(guess, answerPattern);
    if (fittedGuess === null) return result;
    const answerChars = answerPattern.split("");
    const remaining = {};

    answerChars.forEach((char, index) => {
      if (char === " ") {
        result[index] = "space";
      } else if (fittedGuess[index] === char) {
        result[index] = "correct";
      } else {
        remaining[char] = (remaining[char] || 0) + 1;
      }
    });

    fittedGuess.split("").forEach((char, index) => {
      if (answerChars[index] === " " || result[index] === "correct") return;
      if (remaining[char] > 0) {
        result[index] = "present";
        remaining[char] -= 1;
      }
    });

    return result;
  }

  return {
    cleanInput,
    compact,
    fitGuessToPattern,
    getUtcDateKey,
    pickDailyIndex,
    scoreGuess
  };
});
