// Original teaching data. No generated grading or external inference is used.
export const t = (args, expected) => ({ args, expected });
export const q = (prompt, options, answer, why) => ({ prompt, options, answer, why });
export function problem(title, params, input, output, code, tests, example, hints) {
  return {
    title,
    task: `Write solve(${params}). ${output}`,
    starter: `def solve(${params}):\n    # Define what your state means before updating it.\n    pass`,
    solution: code.trim(),
    tests,
    hints,
    exerciseBrief: { input, output, example },
  };
}
export function using(problem, wrapper) {
  return problem.solution.replaceAll("solve(", "base(") + "\n" + wrapper.trim();
}
export function unit(id, title, requires, summary, explanation, frames, trap, predict, reflect, cost, terms, exercise, checkpoint, transfer) {
  return {
    lesson: {
      id,
      title,
      requires,
      summary,
      simpleIdea: summary,
      explanation,
      idea: explanation.join("\n\n"),
      discovery: explanation.slice(1),
      analogy: explanation[0],
      walk: frames.map(([action]) => action),
      diagramFrames: frames.map(([, values]) => values),
      trap,
      predict,
      reflect,
      simpleCost: cost[0],
      costMemory: cost[1],
      cost: cost[2],
      words: terms,
      minutes: null,
      ...exercise,
      title,
    },
    checkpoint,
    transfer: { ...transfer, requires: [id] },
  };
}
