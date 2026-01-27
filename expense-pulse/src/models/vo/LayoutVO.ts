import type { LayoutItemVO } from "./LayoutItemVO";

export interface LayoutVO {
  id?: string;
  layoutName: string;
  layout: LayoutItemVO[];
  isDefault?: boolean;
}