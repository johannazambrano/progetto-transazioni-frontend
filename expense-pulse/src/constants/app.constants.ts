import type { LayoutItemVO } from "@/models/vo/LayoutItemVO";

export const DEFAULT_LAYOUT_HOME: LayoutItemVO[] = [
  { i: "balance", x: 0, y: 0, w: 12, h: 3, minW: 8, maxW: 12, minH: 3, maxH: 3, static: false },
  { i: "expenseChart", x: 0, y: 4, w: 6, h: 9, minW: 4, maxW: 12, minH: 6, maxH: 12, static: false },
  { i: "timeChart", x: 6, y: 4, w: 6, h: 9, minW: 5, maxW: 12, minH: 9, maxH: 12, static: false },
  { i: "transactionForm", x: 0, y: 12, w: 12, h: 5, minW: 8, maxW: 12, minH: 5, maxH: 5, static: false },
  { i: "researchTable", x: 0, y: 18, w: 12, h: 4, minW: 8, maxW: 12, minH: 3, maxH: 8, static: false },
  { i: "transactionHistory", x: 0, y: 22, w: 12, h: 8, minW: 6, maxW: 12, minH: 4, maxH: 15, static: false },
];

export const LAYOUT_STORAGE_KEY = "expensePulse_layout_v1";

export const DEFAULT_LAYOUT_CATEGORIES: LayoutItemVO[] = [
  { i: "stats", x: 0, y: 6, w: 12, h: 4, minW: 10, maxW: 12, minH: 4, maxH: 12, static: true },
  { i: "form", x: 0, y: 0, w: 12, h: 4, minW: 8, maxW: 12, minH: 4, maxH: 10, static: false },
  { i: "table", x: 0, y: 6, w: 12, h: 10, minW: 6, maxW: 12, minH: 8, maxH: 12, static: false },
];