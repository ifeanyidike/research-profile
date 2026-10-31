import { videoEmbed, videoLink } from "./video.js?v=20261031-4";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reviewLabels = {
  "transcript-reviewed": "Transcript reviewed",
  "teaching-material-reviewed": "Teaching material reviewed · speech unverified",
  "description-only": "Spoken content unverified",
};
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours ? hours + ":" + String(minutes).padStart(2, "0") : minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
export function assignmentSummary(item) {
  const ranges = item.segments?.map((s) => `${formatTime(s.start)}–${formatTime(s.end)} · ${s.label}`).join("; ");
  const review = item.contentReview;
  const evidence = reviewLabels[review?.method] ? `Content check: ${reviewLabels[review.method]}. ${review.note}` : "";
  return [item.optional ? "Optional further study." : "", ranges, item.assignment, evidence].filter(Boolean).join(" ");
}
export function resourceCards(items, type, checked) {
  const firstRequired = items.findIndex((item) => !item.optional);
  return items
    .map((item, i) => {
      const key = item.progressKey || `${type}:${i}`;
      const isVideo = type === "video";
      const segments = item.segments?.length ? item.segments : [null];
      const players = isVideo
        ? segments
            .map((segment) => {
              const embed = videoEmbed(item.playbackUrl || item.url, segment);
              if (!embed) return "";
              const title = segment ? `${segment.label} · ${formatTime(segment.start)}–${formatTime(segment.end)}` : item.label;
              const external = videoLink(item.playbackUrl || item.url, segment);
              return `<div class="assigned-clip"><button class="video-load" data-video="${esc(embed)}" data-title="${esc(title)}"><span class="play-icon" aria-hidden="true">▶</span><strong>${esc(title)}</strong><small>${segment ? "Load assigned excerpt" : "Load video"} · connects to YouTube</small></button>${segment && external ? `<p class="fine-print"><a href="${esc(external)}" target="_blank" rel="noopener noreferrer">Open this excerpt on YouTube ↗</a> · stop at ${formatTime(segment.end)}</p>` : ""}</div>`;
            })
            .join("")
        : "";
      const duration = item.durationSeconds ? `Full recording: ${formatTime(item.durationSeconds)}.` : "";
      const rangeAdvice = players
        ? "The embedded excerpt uses these start and stop points. On the original source, stop at the listed end time."
        : "Open the original video and manually watch these time ranges, stopping at each listed end time. This provider is not embedded here.";
      const review = item.contentReview;
      const reviewLabel = reviewLabels[review?.method];
      const evidence = reviewLabel
        ? `<details class="resource-content-review fine-print"><summary>How this source was checked</summary>${review.note !== item.assignment ? `<p>${esc(review.note)}</p>` : ""}<p>${review.sources.map((source) => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a>`).join(" · ")}</p></details>`
        : "";
      const assignedSeconds = item.segments?.reduce((sum, segment) => sum + segment.end - segment.start, 0);
      const timing = !isVideo
        ? ""
        : item.segments?.length
          ? `Watch ${formatTime(assignedSeconds)} total · ${item.segments.map((segment) => `${formatTime(segment.start)}–${formatTime(segment.end)}`).join(" · ")}`
          : item.watchMode === "full" && item.durationSeconds
            ? `Watch full recording · 0:00–${formatTime(item.durationSeconds)}`
            : "Watch the named sections in the guide";
      return `<article class="resource"><div class="resource-info"><span class="eyebrow">${item.optional ? "OPTIONAL · " : ""}${isVideo ? "WATCH" : "READ"} ${i + 1}</span><h3><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label)} ↗</a></h3>${timing ? `<p class="resource-timing">${esc(timing)}</p>` : ""}${reviewLabel ? `<span class="resource-status">Content check: ${esc(reviewLabel)}.</span>` : ""}<details class="resource-study"${i === firstRequired ? " open" : ""}><summary>${isVideo ? "Viewing guide & player" : "Reading guide"}</summary><div class="resource-assignment"><p>${esc(item.assignment || "Follow the topic study assignment.")}</p>${item.segments?.length ? `<ol>${item.segments.map((s) => `<li><strong>${formatTime(s.start)}–${formatTime(s.end)}</strong> · ${esc(s.label)}</li>`).join("")}</ol><p class="fine-print">${rangeAdvice}</p>` : ""}${duration ? `<p class="fine-print">${duration}${item.segments?.length ? " Only the listed excerpts are assigned." : ""}</p>` : ""}${item.accessNote ? `<p class="fine-print">${esc(item.accessNote)}</p>` : ""}</div>${players}${evidence}</details><label class="resource-check"><input type="checkbox" data-resource="${esc(key)}" ${checked.includes(key) ? "checked" : ""} /> ${isVideo ? "I watched the assigned material and took notes" : "I read the assigned sections and took notes"}</label></div></article>`;
    })
    .join("");
}
