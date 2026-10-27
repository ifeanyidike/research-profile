// Shared presentation assets. Icons are decorative; their controls keep text labels.
const paths = {
  book: '<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4zM12 5v15"/>',
  path: '<path d="M8 5h8a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h8"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/>',
  tools:
    '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7m-3.5-3.5v7"/>',
  system:
    '<rect x="8" y="3" width="8" height="5" rx="1"/><rect x="2" y="16" width="8" height="5" rx="1"/><rect x="14" y="16" width="8" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
  practice: '<path d="m8 5-5 7 5 7m8-14 5 7-5 7m-3-16-2 18"/>',
  reasoning: '<path d="M8 16h8m-7 4h6M8 13a6 6 0 1 1 8 0c-1 .8-1 1.5-1 3H9c0-1.5 0-2.2-1-3Z"/>',
  projects: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v3h4v-3"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  settings:
    '<path d="m9 3-.6 2.2-2 .8-2-.9-2 3.4L4 10v2l-1.6 1.5 2 3.5 2-.8 2 .8L9 19h4l.6-2.1 2-.8 2 .9 2-3.5L18 12v-2l1.6-1.5-2-3.4-2 .9-2-.8L13 3Z"/><circle cx="11" cy="11" r="3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};
export function studioIcon(name) {
  return `<svg class="studio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
}
export function studioHeroArt() {
  return `<figure class="studio-hero-art" aria-label="A binary search example: inspect 11, then keep the values larger than 11 to look for 17."><div class="hero-art-caption"><span>SMALL EXAMPLE. BIG IDEA.</span><span class="art-live-dot" aria-hidden="true"></span></div><svg viewBox="0 0 420 238" role="img" aria-label="Search for 17 in a sorted list"><path d="M210 30v30M210 155v25h105v20" fill="none" stroke="#a4aaa0" stroke-width="1.5"/><text x="210" y="24" text-anchor="middle" class="art-code">find(17)</text><rect x="258" y="76" width="150" height="69" rx="10" fill="#dfe9d7"/>${[2, 5, 8, 11, 14, 17, 20].map((n, i) => `<rect x="${14 + i * 56}" y="85" width="48" height="48" rx="6" fill="${i === 3 ? "#1d4237" : "#fffdf8"}" stroke="${i === 3 ? "#1d4237" : "#d9dcd1"}"/><text x="${38 + i * 56}" y="115" text-anchor="middle" class="art-value" fill="${i === 3 ? "#fffdf8" : i < 3 ? "#8b9287" : "#1d4237"}">${n}</text>`).join("")}<text x="210" y="160" text-anchor="middle" class="art-label">inspect the middle</text><rect x="242" y="197" width="152" height="30" rx="15" fill="#1d4237"/><text x="318" y="217" text-anchor="middle" class="art-note">keep the right half →</text></svg><figcaption>A useful question can make the problem smaller.</figcaption></figure>`;
}
export const coursePhases = {
  0: ["01", "Build your toolkit", "The foundations you will keep coming back to."],
  6: ["02", "Connect the patterns", "Turn familiar structures into useful strategies."],
  11: ["03", "Go beneath the surface", "Understand the arguments behind the algorithms."],
  15: ["04", "Bring it all together", "Richer problems, stronger tools, and careful guarantees."],
};
