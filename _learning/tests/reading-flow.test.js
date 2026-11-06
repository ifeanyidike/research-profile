// Pure content/rendering checks. No network, examples or model/provider calls.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { lessonReading } from "../../learning-studio/lesson-sections.js";
import { renderProse } from "../../learning-studio/prose.js";
const read = (path) => JSON.parse(fs.readFileSync(new URL("../../" + path, import.meta.url)));

test("all studios teach before the worked example and recap, without the previous repeated introductions", () => {
  for (const slug of ["voice-ai-studio", "cyber-studio", "child-development-studio"]) {
    for (const [id, lesson] of Object.entries(read(slug + "/lessons.json"))) {
      const html = lessonReading(lesson);
      const intro = html.indexOf('class="lesson-intro"');
      const teaching = html.indexOf('class="prose-heading"');
      const example = html.indexOf('class="worked-example"');
      const recap = html.indexOf('class="lesson-recap"');
      assert.ok(intro >= 0 && teaching > intro && example > teaching && recap > example, `${slug}/${id}`);
      assert.doesNotMatch(html, /A GUIDED EXPLANATION|Put the steps together|The idea, in plain language/);
    }
  }
});
test("reading headings remain semantic and author text cannot inject markup or a heading tag", () => {
  assert.equal(renderProse("### Title <img>", { headingLevel: 2 }), '<h2 class="prose-heading">Title &lt;img&gt;</h2>');
  assert.equal(renderProse("### Title", { headingLevel: "script" }), '<h3 class="prose-heading">Title</h3>');
  const html = lessonReading({
    concept: "<script>bad</script>",
    mechanism: "<img>",
    pitfall: "<svg>",
    guide: { bridge: "<iframe>", teaching: "### Understand <img>\n\nSafe text.", example: "<button>", explanation: "</section>" },
  });
  assert.doesNotMatch(html, /<script>|<img>|<svg>|<iframe>|<button>/);
});
test("audio foundations precede calculations that depend on samples and sampling rate", () => {
  const modules = read("voice-ai-studio/curriculum.json").modules;
  const at = (id) => modules.findIndex((m) => m.id === id);
  assert.ok(at("V11") < at("V12") && at("V12") < at("V06"));
  assert.deepEqual(modules[at("V11")].prerequisites, ["V01"]);
  assert.ok(modules[at("V06")].prerequisites.includes("V12"));
  const report = read("_learning/plain-english-review-20261106.json");
  assert.equal(Object.keys(report.lessons.voice).length, 44);
  assert.equal(Object.keys(report.lessons.cyber).length, 93);
  assert.equal(Object.keys(report.lessons.child).length, 40);
});

test("worked-example instructions precede the example and remain optional escaped prose", () => {
  const lesson = {
    concept: "Intro",
    mechanism: "Recap",
    pitfall: "Pitfall",
    guide: { bridge: "Prior knowledge", teaching: "### Method\n\nRead first.", example: "print(5)", explanation: "Expect five." },
  };
  assert.doesNotThrow(() => lessonReading(lesson));
  lesson.guide.example_intro = "Save as demo.py.\n\nDo not enter <script> as code.";
  const html = lessonReading(lesson);
  assert.ok(html.indexOf("Save as demo.py.") < html.indexOf('class="lesson-code"'));
  assert.ok(html.indexOf("Expect five.") > html.indexOf('class="lesson-code"'));
  assert.ok(html.includes("&lt;script&gt;") && !html.includes("<script>"));
  const packaged = read("cyber-studio/lessons.json").P02;
  assert.ok(lessonReading(packaged).includes(packaged.guide.example_intro));
});

test("reference snippets have no unwired execution controls; named Python workspaces retain them", () => {
  assert.doesNotMatch(renderProse("```python\nprint(5)\n```"), /studio-code-editor|data-code-action/);
  assert.match(renderProse("```python id=milliseconds\nprint(500)\n```"), /data-code-action="run"/);
  for (const lesson of Object.values(read("cyber-studio/lessons.json"))) {
    for (const field of ["teaching", "solution", "challenge_solution"])
      assert.doesNotMatch(renderProse(lesson.guide[field]), /data-code-action="run"/);
  }
});

test("fictional cases wrap as reading text while code and mathematical examples retain their format", () => {
  for (const lesson of Object.values(read("child-development-studio/lessons.json"))) {
    const html = lessonReading(lesson);
    if (lesson.guide.example_format === "math") assert.match(html, /class="math-example"/);
    else {
      assert.equal(lesson.guide.example_format, "prose");
      assert.match(html, /aria-label="Worked case or scenario"/);
      assert.doesNotMatch(html, /<pre|Reference code/);
    }
  }
  const voice = read("voice-ai-studio/lessons.json");
  assert.match(lessonReading(voice.V02), /class="studio-code-editor"/);
  assert.match(lessonReading(voice.V12), /class="math-example"/);
  assert.match(lessonReading(voice.V34), /class="lesson-code"/);
});
