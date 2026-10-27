// Small, authored pictures of the same states described by the worked examples.
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const illustratedStates = {
  76: [
    {
      nodes: [
        [3, 160, 30],
        [2, 95, 90],
      ],
      edges: [[3, 2]],
    },
    {
      nodes: [
        [3, 190, 25],
        [2, 125, 85],
        [1, 60, 145],
      ],
      edges: [
        [3, 2],
        [2, 1],
      ],
    },
    {
      nodes: [
        [2, 160, 30],
        [1, 85, 115],
        [3, 235, 115],
      ],
      edges: [
        [2, 1],
        [2, 3],
      ],
    },
    {
      nodes: [
        [2, 160, 30],
        [1, 85, 115],
        [3, 235, 115],
      ],
      edges: [
        [2, 1],
        [2, 3],
      ],
    },
  ],
  87: [{ flow: [0, 0, 0, 0, 0] }, { flow: [2, 0, 2, 0, 0] }, { flow: [3, 2, 2, 3, 1] }, { flow: [3, 2, 2, 3, 1] }],
  88: [
    { pairs: [[0, 0]] },
    { pairs: [[0, 0]] },
    { pairs: [[0, 1]] },
    {
      pairs: [
        [0, 1],
        [1, 0],
      ],
    },
  ],
  106: [
    { chain: [] },
    {
      chain: [
        [0, 0],
        [1, 0],
        [1, 1],
      ],
    },
    {
      chain: [
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    },
    {
      chain: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    },
  ],
};
const line = (a, b, extra = "") => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${extra}/>`;
const circle = (x, y, label) => `<circle cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y + 5}" text-anchor="middle">${esc(label)}</text>`;
export function advancedDiagram(id, step) {
  const state = illustratedStates[id]?.[step];
  if (!state) return "";
  let body = "",
    label = "";
  if (id === 76) {
    const positions = Object.fromEntries(state.nodes.map(([v, x, y]) => [v, [x, y]]));
    label = step < 2 ? "Search-tree shape before repair" : "After a right rotation: inorder remains 1, 2, 3";
    body = state.edges.map(([a, b]) => line(positions[a], positions[b])).join("") + state.nodes.map(([v, x, y]) => circle(x, y, v)).join("");
  } else if (id === 87) {
    const nodes = [
        [35, 90],
        [160, 30],
        [160, 150],
        [285, 90],
      ],
      edges = [
        [0, 1, 3],
        [0, 2, 2],
        [1, 3, 2],
        [2, 3, 3],
        [1, 2, 1],
      ];
    label = "Directed pipes. Edge labels are sent flow / original capacity.";
    body =
      edges
        .map(
          ([a, b, cap], i) =>
            line(nodes[a], nodes[b], `class="${state.flow[i] ? "diagram-selected" : ""}" marker-end="url(#flow-arrow)"`) +
            `<text class="diagram-edge-label" x="${(nodes[a][0] + nodes[b][0]) / 2 + (a === 1 && b === 2 ? 21 : 0)}" y="${(nodes[a][1] + nodes[b][1]) / 2 - 6}" text-anchor="middle">${state.flow[i]} / ${cap}</text>`
        )
        .join("") + nodes.map(([x, y], v) => circle(x, y, v)).join("");
  } else if (id === 88) {
    const nodes = [
        [60, 45],
        [60, 135],
        [260, 45],
        [260, 135],
      ],
      edges = [
        [0, 0],
        [0, 1],
        [1, 0],
      ];
    label = "Left and right groups. Thick edges are current pairs; pale edges are other eligible choices.";
    body =
      edges
        .map(([a, b]) =>
          line(nodes[a], nodes[b + 2], `class="${state.pairs.some(([x, y]) => x === a && y === b) ? "diagram-selected" : "diagram-eligible"}"`)
        )
        .join("") + nodes.map(([x, y], i) => circle(x, y, (i < 2 ? "L" : "R") + (i % 2))).join("");
  } else {
    const pos = ([x, y]) => [80 + 160 * x, 145 - 110 * y];
    label = step === 3 ? "Completed counterclockwise boundary" : "Square points; the green segments show the current chain";
    body =
      state.chain
        .slice(1)
        .map((p, i) => line(pos(state.chain[i]), pos(p), 'class="diagram-selected"'))
        .join("") +
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ]
        .map((p) => {
          const [x, y] = pos(p);
          return `<circle cx="${x}" cy="${y}" r="5"/><text x="${x}" y="${y + (p[1] ? -14 : 22)}" text-anchor="middle">(${p.join(",")})</text>`;
        })
        .join("");
  }
  return `<div class="advanced-picture"><svg viewBox="0 0 320 185" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="25" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker></defs>${body}</svg><p class="fine-print">${esc(label)}</p></div>`;
}
