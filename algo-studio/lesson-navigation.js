// Navigation never awards progress or bypasses the checks needed to finish.
export const testSuiteVersion = "20261027-course2";
export function invalidateOldTestRun(draft) {
  if ((draft.results || draft.passedCode) && draft.testSuiteVersion !== testSuiteVersion) {
    draft.results = null;
    draft.passedCode = null;
  }
  return draft;
}
export function canVisitLessonStep(lesson, draft, step) {
  if (!Number.isInteger(step) || step < 0 || step > 3) return false;
  if (step === 0) return true;
  if (step === 1) return draft.step >= 1 || draft.predict !== undefined || (draft.walkIndex || 0) >= lesson.walk.length - 1;
  if (draft.predict !== lesson.predict.answer) return false;
  if (step === 2) return true;
  return (
    draft.step === 3 ||
    draft.reflect !== undefined ||
    (typeof draft.code === "string" &&
      draft.passedCode === draft.code &&
      Array.isArray(draft.results) &&
      draft.results.length > 0 &&
      draft.results.every((result) => result.passed))
  );
}
