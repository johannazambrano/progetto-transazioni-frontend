import type { CategoryDTO } from '../dtos/CategoryDTO';
import type { Category } from '../entities/Category';

export class CategoryMapper {
    static toEntity(dto: CategoryDTO): Category {
        return {
            id: dto.id || '',
            descrizione: dto.descrizione,
            codice: dto.codice
        }
    }

    static toDTO(entity: Category): CategoryDTO {
        const dto: CategoryDTO = {
            descrizione: entity.descrizione,
            codice: entity.codice
        };

        // Includiamo l'id solo se esiste e non è vuoto (utile per il PUT, non per il POST)
        if (entity.id && entity.id.trim() !== '') {
            dto.id = entity.id;
        }

        return dto;
    }
}