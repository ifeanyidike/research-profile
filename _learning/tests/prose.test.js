// Pure rendering; no browser, network, models or example execution.
import test from "node:test";
import assert from "node:assert/strict";
import { renderProse } from "../../learning-studio/prose.js";

test("reference code retains indentation and escapes markup instead of running it", () => {
  const html = renderProse('Predict first.\n\n```python\nif value < 3:\n    print("<script>not executable</script>")\n```\n\nExplain the result.');
  assert.match(html, /<p>Predict first\.<\/p>/);
  assert.match(html, /<pre[^>]+tabindex="0"[^>]*><code>/);
  assert.ok(html.includes("if value &lt; 3:\n    print(&quot;&lt;script&gt;not executable&lt;/script&gt;&quot;)"));
  assert.ok(!html.includes("<script>"));
  assert.match(html, /<p>Explain the result\.<\/p>/);
});

test("ordinary authored TeX and unfinished code fences remain escaped text", () => {
  assert.equal(renderProse("Use \\(x<3\\).\n\nNext & final."), "<p>Use \\(x&lt;3\\).</p><p>Next &amp; final.</p>");
  const html = renderProse("Example:\n\n```python\nprint('<img>')");
  assert.ok(!html.includes("<pre"));
  assert.ok(!html.includes("<img>"));
  assert.ok(!renderProse("```python\nprint('unfinished')").includes("<pre"));
});

test("authored teaching steps and lists render semantic structure without allowing markup", () => {
  const html = renderProse("### Inspect <script>\n\n1. Predict \\(x<3\\).\n2. Check & explain.\n\n- Keep <img> as text.\n- Describe the result.");
  assert.match(html, /<h3 class="prose-heading">Inspect &lt;script&gt;<\/h3>/);
  assert.ok(html.includes("<ol><li>Predict \\(x&lt;3\\).</li><li>Check &amp; explain.</li></ol>"));
  assert.match(html, /<ul><li>Keep &lt;img&gt; as text\.<\/li>/);
  assert.ok(!html.includes("<script>") && !html.includes("<img>"));
  const code = renderProse("```text\n### code heading\n1. code item\n- code item\n```");
  assert.ok(code.includes("<pre"));
  assert.ok(!code.includes("<h3") && !code.includes("<ol") && !code.includes("<ul"));
});
