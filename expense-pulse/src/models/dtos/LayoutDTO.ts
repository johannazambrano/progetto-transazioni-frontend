import type { LayoutItemDTO } from "./LayoutItemDTO";

export interface LayoutDTO {
  id?: string;
  layoutName: string;
  layout: LayoutItemDTO[];
  isDefault?: boolean;
}