// Placement for cards inside a two-row ScrollRow.
//
// A two-row scroller naturally fills top-to-bottom, which would scramble the
// editorial order. Instead each card is placed so every screenful of three
// columns reads left to right, top row first (1 2 3 / 4 5 6, then 7 8 9 /
// 10 11 12). A short last page of three or fewer fills column by column so it
// doesn't leave a hole. Applied from sm up; phones keep the plain order.
export function place(i: number, n: number) {
  const page = Math.floor(i / 6);
  const j = i % 6;
  const rest = n - page * 6;
  const { r, c } =
    rest <= 3
      ? { r: (j % 2) + 1, c: Math.floor(j / 2) + 1 }
      : { r: j < 3 ? 1 : 2, c: (j % 3) + 1 };
  return `--r: ${r}; --c: ${page * 3 + c}`;
}
export const placed = 'sm:[grid-row:var(--r)] sm:[grid-column:var(--c)]';
