import type { LayoutItemVO } from '@/models/vo/LayoutItemVO';
import type { LayoutItemDTO } from '@/models/dtos/LayoutItemDTO';

/**
 * Mapper tra LayoutItemVO e LayoutItemDTO
 */
export class LayoutItemMapper {
  /**
   * Converte da DTO a VO
   */
  static toVO(dto: LayoutItemDTO): LayoutItemVO {
    return {
      i: dto.i,
      x: dto.x,
      y: dto.y,
      w: dto.w,
      h: dto.h,
      minW: dto.minW,
      maxW: dto.maxW,
      minH: dto.minH,
      maxH: dto.maxH,
      static: dto.static ?? false,
    };
  }

  /**
   * Converte da VO a DTO
   */
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
