import type { LayoutVO } from '@/models/vo/LayoutVO';
import type { LayoutDTO } from '@/models/dtos/LayoutDTO';
import { LayoutItemMapper } from './LayoutItemMapper';

/**
 * Mapper tra LayoutVO e LayoutDTO
 */
export class LayoutMapper {
  /**
   * Converte da DTO a VO
   */
  static toVO(dto: LayoutDTO): LayoutVO {
    return {
      id: dto.id,
      layoutName: dto.layoutName,
      layoutItems: LayoutItemMapper.toVOList(dto.layoutItems || []),
      isDefault: dto.isDefault ?? false,
    };
  }

  /**
   * Converte da VO a DTO
   */
  static toDTO(vo: LayoutVO): LayoutDTO {
    return {
      id: vo.id,
      layoutName: vo.layoutName,
      layoutItems: LayoutItemMapper.toDTOList(vo.layoutItems || []),
      isDefault: vo.isDefault,
    };
  }

  /**
   * Converte array di DTO in array di VO
   */
  static toVOList(dtos: LayoutDTO[]): LayoutVO[] {
    return dtos.map(dto => this.toVO(dto));
  }

  /**
   * Converte array di VO in array di DTO
   */
  static toDTOList(vos: LayoutVO[]): LayoutDTO[] {
    return vos.map(vo => this.toDTO(vo));
  }
}
