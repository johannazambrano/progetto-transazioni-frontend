import type { LayoutItemDTO } from "./LayoutItemDTO";

export interface LayoutDTO {
  id?: string;
  layoutName: string;
  layoutItems: LayoutItemDTO[];
  isDefault?: boolean;
}