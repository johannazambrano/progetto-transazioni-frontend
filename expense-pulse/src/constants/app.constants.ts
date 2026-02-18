import type { LayoutItemVO } from "@/models/vo/LayoutItemVO";


// --- LAYOUTS ---
export const DEFAULT_LAYOUT_HOME: LayoutItemVO[] = [
  { i: "balance", x: 4, y: 0, w: 5, h: 3, minW: 8, maxW: 8, minH: 3, maxH: 3, static: false },
  { i: "expenseChart", x: 0, y: 4, w: 3, h: 9, minW: 4, maxW: 6, minH: 3, maxH: 12, static: false },
  { i: "timeChart", x: 4, y: 4, w: 3, h: 9, minW: 5, maxW: 12, minH: 9, maxH: 12, static: false },
  { i: "transactionForm", x: 4, y: 12, w: 5, h: 5, minW: 8, maxW: 12, minH: 5, maxH: 5, static: false },
  { i: "researchTable", x: 4, y: 18, w: 5, h: 4, minW: 8, maxW: 12, minH: 3, maxH: 8, static: false },
  { i: "transactionHistory", x: 4, y: 22, w: 6, h: 10, minW: 6, maxW: 12, minH: 4, maxH: 15, static: false },
];

export const LAYOUT_STORAGE_KEY = "expensePulse_layout_v1";

export const DEFAULT_LAYOUT_CATEGORIES: LayoutItemVO[] = [
  { i: "stats", x: 0, y: 6, w: 12, h: 5, minW: 10, maxW: 12, minH: 4, maxH: 12, static: false },
  { i: "form", x: 0, y: 0, w: 12, h: 4, minW: 8, maxW: 12, minH: 4, maxH: 10, static: false },
  { i: "table", x: 0, y: 6, w: 12, h: 10, minW: 6, maxW: 12, minH: 8, maxH: 12, static: false },
];

export const USE_BACKEND_LAYOUTS = true; // ⚠️ Cambia in true quando il backend è pronto