(async () => {
  const checks = [];
  const assert = (x, message) => {
    if (!x) throw Error(message);
    checks.push(message);
  };
  const wait = async (fn, ms = 15000) => {
    const t = Date.now();
    while (!fn()) {
      if (Date.now() - t > ms) throw Error("Timed out waiting for UI: " + fn);
      await new Promise((r) => setTimeout(r, 80));
    }
  };
  const click = (s) => {
    const b = document.querySelector(s);
    if (!b) throw Error("Missing " + s);
    b.click();
  };
  const navigate = async (hash) => {
    location.hash = hash;
    await new Promise((r) => setTimeout(r, 100));
  };
  localStorage.removeItem("algo-studio-v1");
  await navigate("home");
  assert(document.querySelectorAll("nav [data-nav]").length === 3, "Navigation offers only Learn, Course outline, and Tools");
  assert(document.querySelectorAll("#main .button.primary").length === 1, "Home offers one primary next action");
  assert(!document.querySelector(".stats-row"), "Home does not show competing dashboard panels");
  await navigate("lesson/0");
  assert(document.querySelectorAll(".walkthrough-step").length === 1, "Worked example shows one step at a time");
  assert(!document.querySelector('[data-step="1"]'), "Next lesson part waits until example is finished");
  click('[data-walk="1"]');
  assert(document.querySelector(".walkthrough-step").textContent.includes("index 0"), "Next example step advances the trace");
  assert(JSON.parse(localStorage.getItem("algo-studio-v1")).drafts[0].walkIndex === 1, "Worked example position is saved");
  click('[data-walk="2"]');
  click('[data-step="1"]');
  click('[data-answer="predict"][data-index="2"]');
  assert(!!document.querySelector(".feedback.retry"), "Incorrect predictions receive feedback");
  assert(document.querySelector(".lesson-panel .button.primary").disabled, "Prediction gate rejects incorrect answer");
  click('[data-answer="predict"][data-index="0"]');
  click('[data-step="2"]');
  assert(document.querySelector("#practice-continue").disabled, "Python step explains that tests must pass before continuing");
  const editor = document.querySelector("#code-editor");
  editor.value = "def solve(items, target):\n    for i, item in enumerate(items):\n        if item == target:\n            return i\n    return -1";
  editor.dispatchEvent(new Event("input"));
  click("#run-code");
  await wait(() => document.querySelector(".results-heading") || document.querySelector("#test-results .feedback"), 85000);
  assert(
    document.querySelector(".results-heading")?.textContent.includes("All tests passed"),
    "Real browser Python execution passes edge-case tests"
  );
  assert(document.querySelector(".efficiency-details").textContent.includes("Python line steps"), "Python counts are available on demand");
  assert(!document.querySelector(".efficiency-details").open, "Detailed metrics stay collapsed by default");
  click('[data-step="3"]');
  assert(document.querySelector("#complete-lesson").disabled, "Completion requires reasoning checkpoint");
  click('[data-answer="reflect"][data-index="1"]');
  assert(!document.querySelector("#complete-lesson").disabled, "Correct reasoning and passing code enable completion");
  click("#complete-lesson");
  assert(!!document.querySelector(".checkpoint-success"), "Lesson completion displays next action");
  const s = JSON.parse(localStorage.getItem("algo-studio-v1"));
  assert(!!s.done[0] && !s.done[0].assisted, "Independent completion persists");
  assert(s.reviews[0].due > Date.now(), "Completion schedules a future spaced review");
  await navigate("lesson/1");
  assert(!!document.querySelector(".step-tabs"), "Next lesson unlocks after checkpoint");
  assert(
    document.querySelector(".familiar-example") && document.querySelector(".walkthrough-step"),
    "Every new lesson starts with a plain explanation and small example"
  );
  await navigate("tools");
  assert(document.querySelectorAll(".learning-tool").length === 4, "Extra tools remain available in one place");
  await navigate("lesson/6");
  assert(
    document.querySelector("#main").textContent.includes("First, build the foundation"),
    "Uncompleted prerequisites keep later exercises locked"
  );
  await navigate("visual");
  click("#visual-next");
  assert(document.querySelector("#frame-count").textContent.includes("1 /"), "Visualization advances one frame");
  click("#visual-back");
  assert(document.querySelector("#frame-count").textContent.includes("0 /"), "Visualization reverses one frame");
  document.querySelector("#visual-values").value = "bad";
  click("#visual-apply");
  assert(document.querySelector("#toast").textContent.includes("integers"), "Visualization validates custom data");
  await navigate("lab");
  assert(document.querySelector(".big-number").textContent === "64", "Lab counts linear comparisons");
  click('[data-lab-kind="sort"]');
  assert(document.querySelector(".big-number").textContent === "2,016", "Lab counts insertion sort comparisons");
  await navigate("review");
  click('[data-review="0"]');
  click('[data-answer="review"][data-index="1"]');
  click("#review-finish");
  assert(JSON.parse(localStorage.getItem("algo-studio-v1")).reviews[0].stage === 0, "Early recall does not accelerate review schedule");
  await navigate("practice");
  document.querySelector("#practice-search").value = "binary";
  document.querySelector("#practice-search").dispatchEvent(new Event("input"));
  assert(document.querySelectorAll(".exercise-card").length === 2, "Practice search filters exercises by title");
  click("#search-button");
  document.querySelector("#search-input").value = "coin";
  document.querySelector("#search-input").dispatchEvent(new Event("input"));
  assert(document.querySelectorAll("#search-results a").length === 1, "Global search filters lessons");
  document.querySelector("#search-dialog").close();
  return { passed: checks.length, checks };
})();
