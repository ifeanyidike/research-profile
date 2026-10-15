export function searchTrace(values, target, binary = false) {
  const a = [...values];
  const frames = [
    {
      values: a,
      active: [],
      excluded: [],
      text: binary
        ? "Start with the full sorted list. Each comparison can rule out about half."
        : "Start at the first item. Check one value at a time.",
      checks: 0,
    },
  ];
  let checks = 0;
  if (binary) {
    let left = 0,
      right = a.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      checks++;
      frames.push({
        values: a,
        active: [mid],
        excluded: a.map((_, i) => i).filter((i) => i < left || i > right),
        text: `Check index ${mid}: ${a[mid]}. ${a[mid] === target ? "Found it!" : a[mid] < target ? "Too small. Keep the right half." : "Too large. Keep the left half."}`,
        checks,
      });
      if (a[mid] === target) return frames;
      if (a[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      checks++;
      frames.push({
        values: a,
        active: [i],
        excluded: Array.from({ length: i }, (_, j) => j),
        text: `Check index ${i}: ${a[i]}. ${a[i] === target ? "Found it!" : `Not ${target}. Move one place right.`}`,
        checks,
      });
      if (a[i] === target) return frames;
    }
  }
  frames.push({ values: a, active: [], excluded: a.map((_, i) => i), text: "No candidates remain. The target is absent; return -1.", checks });
  return frames;
}
export function insertionTrace(values) {
  const a = [...values];
  let checks = 0;
  const frames = [
    { values: [...a], active: [], sorted: [0], text: "The first value is a sorted group of one. Insert each next value into that group.", checks },
  ];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    frames.push({
      values: [...a],
      active: [i],
      sorted: Array.from({ length: i }, (_, k) => k),
      text: `Pick up ${key}. Find its place in the sorted left part.`,
      checks,
    });
    while (j >= 0) {
      checks++;
      if (a[j] <= key) break;
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    frames.push({
      values: [...a],
      active: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      text: `Insert ${key} at index ${j + 1}. The first ${i + 1} values are now sorted.`,
      checks,
    });
  }
  frames.push({ values: [...a], active: [], sorted: a.map((_, i) => i), text: "Done. Every value is in order.", checks });
  return frames;
}
export function bfsTrace() {
  return [
    { seen: [], active: "A", queue: ["A"], text: "Start at A. Put it in the queue. Distance 0." },
    { seen: ["A"], active: "A", queue: ["B", "C"], text: "Visit A. Discover B and C, both one edge away." },
    { seen: ["A", "B"], active: "B", queue: ["C", "D"], text: "Visit B. Discover D at distance 2. Record B as its parent." },
    { seen: ["A", "B", "C"], active: "C", queue: ["D", "E"], text: "Visit C. D is already discovered. Add E at distance 2." },
    { seen: ["A", "B", "C", "D"], active: "D", queue: ["E", "F"], text: "Visit D. Discover F at distance 3." },
    { seen: ["A", "B", "C", "D", "E"], active: "E", queue: ["F"], text: "Visit E. F is already discovered, so do not enqueue it again." },
    { seen: ["A", "B", "C", "D", "E", "F"], active: "F", queue: [], text: "Visit F. The shortest A → F route has 3 edges: A → B → D → F." },
  ];
}
export function measure(kind, n) {
  const a = Array.from({ length: n }, (_, i) => (kind === "sort" ? n - i : i + 1));
  let slow = 0,
    fast = 0;
  if (kind === "search") {
    const target = n;
    for (const x of a) {
      slow++;
      if (x === target) break;
    }
    let l = 0,
      r = n - 1;
    while (l <= r) {
      fast++;
      const m = (l + r) >> 1;
      if (a[m] === target) break;
      if (a[m] < target) l = m + 1;
      else r = m - 1;
    }
  } else {
    const b = [...a];
    for (let i = 1; i < n; i++) {
      const key = b[i];
      let j = i - 1;
      while (j >= 0) {
        slow++;
        if (b[j] <= key) break;
        b[j + 1] = b[j--];
      }
      b[j + 1] = key;
    }
    function mergeSort(xs) {
      if (xs.length < 2) return xs;
      const m = xs.length >> 1,
        L = mergeSort(xs.slice(0, m)),
        R = mergeSort(xs.slice(m));
      let i = 0,
        j = 0,
        out = [];
      while (i < L.length && j < R.length) {
        fast++;
        out.push(L[i] <= R[j] ? L[i++] : R[j++]);
      }
      return out.concat(L.slice(i), R.slice(j));
    }
    mergeSort(a);
  }
  return { n, slow, fast };
}
export const reviewIntervals = [1, 3, 7, 14, 30];
export function reviewDate(stage, now = Date.now()) {
  return now + reviewIntervals[Math.min(stage, reviewIntervals.length - 1)] * 86400000;
}
