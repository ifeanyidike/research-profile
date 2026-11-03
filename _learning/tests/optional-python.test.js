// Pure local curriculum/progress checks; no providers or code execution.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createModel } from "../../learning-studio/model.js";
import { mainTopics, refresherTopics } from "../../learning-studio/learning-path.js";
import { renderCode } from "../../learning-studio/code-editor.js";
const modules = JSON.parse(fs.readFileSync(new URL("../../voice-ai-studio/curriculum.json", import.meta.url))).modules;

test("all main voice topics can be completed without passing optional Python refreshers", () => {
  const model = createModel("voice-ai-studio");
  const core = mainTopics(modules);
  assert.equal(core.length, 40);
  assert.deepEqual(
    refresherTopics(modules).map((m) => m.id),
    ["V02", "V03", "V04", "V05"]
  );
  const records = {};
  for (const topic of core) {
    const state = model.learningState(core, records, 100);
    assert.equal(state.next.id, topic.id);
    assert.ok(state.ready(topic), topic.id);
    records[topic.id] = { passedAt: 1 };
  }
  const state = model.learningState(core, records, 100);
  assert.equal(state.passed, 40);
  assert.equal(state.next, undefined);
  for (const topic of refresherTopics(modules)) assert.equal(records[topic.id], undefined, "Skipping must not fabricate a pass");
  const v12 = core.find((m) => m.id === "V12");
  assert.ok(v12.recommended_prerequisites.includes("V04"));
  for (const topic of core) for (const id of topic.recommended_prerequisites || []) assert.ok(refresherTopics(modules).some((m) => m.id === id));
});

test("Python editor escapes code and retains an exact editable source including indentation", () => {
  const source = 'def name():\n    print("</textarea><script>bad</script>")\n    return 3\n';
  const html = renderCode(source, "python");
  assert.ok(html.includes('data-code-action="copy"'));
  assert.ok(html.includes('data-code-action="download"'));
  assert.ok(html.includes('data-code-action="reset"'));
  assert.ok(html.includes('class="py-keyword"'));
  assert.ok(html.includes('class="py-string"'));
  assert.ok(!html.includes("<script>bad</script>"));
  assert.equal((html.match(/<textarea/g) || []).length, 1);
  assert.ok(html.includes("    print(&quot;&lt;/textarea&gt;&lt;script&gt;bad&lt;/script&gt;&quot;)"));
  assert.ok(!renderCode(source, "text").includes("code-input"));
});
