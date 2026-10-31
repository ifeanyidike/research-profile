// Pure validation only: no external I/O, database or provider calls.
import test from "node:test";
import assert from "node:assert/strict";
import { validateRecord as cyberValidate } from "../../cyber-studio/model.js";
import { createModel } from "../../learning-studio/model.js";
const validators = [cyberValidate, createModel("voice-ai-studio").validateRecord, createModel("child-development-studio").validateRecord];
test("all studio note fields use the browser UTF-16 limit while preserving valid Unicode", () => {
  for (const validate of validators)
    for (const field of ["notes", "evidence", "assessment"]) {
      const record = (value) => ({ values: { [field]: value }, changed: { [field]: 200 } });
      for (const value of ["a".repeat(20000), "é".repeat(20000), "😀".repeat(10000), "a".repeat(19998) + "😀"])
        assert.doesNotThrow(() => validate(record(value)));
      for (const value of ["a".repeat(20001), "😀".repeat(10001), "a".repeat(19999) + "😀"]) assert.throws(() => validate(record(value)), /too long/);
    }
});
