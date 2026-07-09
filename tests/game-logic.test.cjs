const test = require("node:test");
const assert = require("node:assert/strict");
const logic = require("../game-logic.js");

test("normalizes guesses without losing meaningful spaces", () => {
  assert.equal(logic.cleanInput("  Proof of Stake! "), "PROOF OF STAKE");
  assert.equal(logic.cleanInput("Proof-of-Stake"), "PROOFOFSTAKE");
  assert.equal(logic.compact("PROOF OF STAKE"), "PROOFOFSTAKE");
});

test("fits guesses to multiword answer patterns", () => {
  assert.equal(logic.fitGuessToPattern("PROOFOFSTAKE", "PROOF OF STAKE"), "PROOF OF STAKE");
  assert.equal(logic.fitGuessToPattern("BITCOIN", "PROOF OF STAKE"), null);
});

test("scores duplicate letters only as often as they occur", () => {
  assert.deepEqual(logic.scoreGuess("EER", "EYE"), ["correct", "present", "absent"]);
});

test("uses stable UTC date keys and rotates through every entry", () => {
  assert.equal(logic.getUtcDateKey(new Date("2026-07-09T23:59:59Z")), "2026-07-09");
  const seen = new Set();
  for (let day = 0; day < 31; day += 1) {
    const date = new Date(day * 86400000);
    seen.add(logic.pickDailyIndex(logic.getUtcDateKey(date), 31));
  }
  assert.equal(seen.size, 31);
});
