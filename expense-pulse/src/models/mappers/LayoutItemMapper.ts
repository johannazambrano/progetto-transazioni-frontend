import type { LayoutItemVO } from '@/models/vo/LayoutItemVO';
import type { LayoutItemDTO } from '@/models/dtos/LayoutItemDTO';

interface LayoutItemRaw {
  i?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
  staticLayout?: boolean;
}

export class LayoutItemMapper {
  static toVO(dto: LayoutItemRaw): LayoutItemVO {
    return {
      i: dto.i ?? '',
      x: dto.x ?? 0,
      y: dto.y ?? 0,
      w: dto.w ?? 1,
      h: dto.h ?? 1,
      minW: dto.minW,
      maxW: dto.maxW,
      minH: dto.minH,
      maxH: dto.maxH,
      static: dto.staticLayout ?? dto.static ?? false,
    };
  }

  static toDTO(vo: LayoutItemVO): LayoutItemDTO {
    return {
      i: vo.i,
      x: vo.x,
      y: vo.y,
      w: vo.w,
      h: vo.h,
      minW: vo.minW,
      maxW: vo.maxW,
      minH: vo.minH,
      maxH: vo.maxH,
      static: vo.static,
    };
  }

  /**
   * Converte array di DTO in array di VO
   */
  static toVOList(dtos: LayoutItemDTO[]): LayoutItemVO[] {
    return dtos.map(dto => this.toVO(dto));
  }

  /**
   * Converte array di VO in array di DTO
   */
  static toDTOList(vos: LayoutItemVO[]): LayoutItemDTO[] {
    return vos.map(vo => this.toDTO(vo));
  }
}
