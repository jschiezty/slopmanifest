import test from "node:test";
import assert from "node:assert/strict";
import { BANK_SIZE, clauseAt, openings, propositions, endings } from "../lib/manifesto-bank.ts";
test("bank size follows the arrays", () => {
  assert.equal(BANK_SIZE, openings.length * propositions.length * endings.length);
  assert.ok(BANK_SIZE > 0);
});
test("all combinations are distinct and defined", () => {
  const clauses = Array.from({ length: BANK_SIZE }, (_, i) => clauseAt(i));
  assert.equal(new Set(clauses).size, BANK_SIZE);
  for (const clause of clauses) assert.ok(clause.length && !clause.includes("undefined"));
});
test("first and last combinations preserve ordering", () => {
  assert.equal(clauseAt(0), `${openings[0]} ${propositions[0]}. ${endings[0]}`);
  assert.equal(clauseAt(BANK_SIZE - 1), `${openings.at(-1)} ${propositions.at(-1)}. ${endings.at(-1)}`);
});
test("invalid indexes fail explicitly", () => {
  for (const i of [-1, BANK_SIZE, 0.5, NaN, Infinity]) assert.throws(() => clauseAt(i), RangeError);
});
