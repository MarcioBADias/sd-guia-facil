import test from "node:test";
import assert from "node:assert/strict";
import { benefitTable, findBenefits } from "../src/lib/beneficioCst.js";

test("RJ801001 matches CST 30 and 40, not 20, as marked SIM in the supplied table", () => {
  assert.ok(findBenefits("30").some((r) => r.code === "RJ801001"));
  assert.ok(findBenefits("40").some((r) => r.code === "RJ801001"));
  assert.equal(findBenefits("20").some((r) => r.code === "RJ801001"), false);
});
test("CST 00 allows no cBenef filling in the supplied table", () => {
  assert.deepEqual(findBenefits("00").map((r) => r.code), [""]);
});
test("RJ802447 matches CST 20 and 70 with source date preserved", () => {
  const row = findBenefits("70", "RJ802447")[0];
  assert.equal(row.start, "2022-04-07");
  assert.deepEqual(row.csts, ["20", "70"]);
});
test("SEM cBenef has no CST mapping and must not be recommended by CST", () => {
  const row = benefitTable.rows.find((r) => r.code === "SEM cBenef");
  assert.deepEqual(row.csts, []);
  assert.equal(findBenefits("40", "SEM cBenef").length, 0);
});