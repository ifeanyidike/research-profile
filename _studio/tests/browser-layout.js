(async () => {
  const checks = [];
  for (const route of [
    "home",
    "tools",
    "path",
    "lesson/36",
    "check/36",
    "practice",
    "practice/mixed",
    "visual",
    "lab",
    "review",
    "projects",
    "method",
  ]) {
    location.hash = route;
    await new Promise((r) => setTimeout(r, 80));
    const width = document.documentElement.clientWidth,
      scroll = document.documentElement.scrollWidth;
    if (scroll > width) throw Error(`${route} overflows: ${scroll} > ${width}`);
    checks.push(route + " fits " + width + "px");
  }
  const nav = document.querySelector(".mobile-nav");
  if (getComputedStyle(nav).display === "none") throw Error("Mobile navigation is missing");
  nav.querySelector('[data-nav="path"]').click();
  await new Promise((r) => setTimeout(r, 100));
  if (location.hash !== "#path" || nav.querySelector('[aria-current="page"]')?.dataset.nav !== "path")
    throw Error("Mobile navigation did not select Course");
  document.querySelector("#mobile-settings").click();
  if (!document.querySelector("#settings-dialog").open) throw Error("Mobile settings did not open");
  document.querySelector("#settings-dialog").close();
  if (!document.querySelector("#sidebar").inert) throw Error("Hidden desktop navigation remains focusable");
  checks.push("Bottom navigation selects Course; settings open; hidden sidebar is inert");
  return checks;
})();
