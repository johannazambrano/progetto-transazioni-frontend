import type { LayoutItemVO } from "./LayoutItemVO";

export interface LayoutVO {
  id?: string;
  layoutName: string;
  layoutItems: LayoutItemVO[];
  isDefault?: boolean;
}