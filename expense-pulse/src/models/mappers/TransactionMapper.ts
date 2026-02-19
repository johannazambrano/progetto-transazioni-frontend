import type { PaginazioneDTO } from '../dtos/PaginazioneDTO';
import type { TransactionDTO } from '../dtos/TransactionDTO';
import type { TransactionResponseDTO } from '../dtos/TransactionResponseDTO';
import type { TransactionVO } from '../vo/TransactionVO';
import type { PaginationVO } from '../vo/PaginationVO';
import { CategoryMapper } from './CategoryMapper';

export class TransactionMapper {
    static toEntity(dto: TransactionDTO): TransactionVO {
        return {
            id: dto.id || '',
            title: dto.title,
            amount: dto.amount,
            category: CategoryMapper.toEntity(dto.category),
            date: dto.date
        };
    }

    static toPaginazioneEntity(dto: PaginazioneDTO): PaginationVO {
        return {
            currentPage: dto.numeroPagina,
            totalPages: dto.numeroPagTotali,
            totalElements: dto.numeroRisTotali,
            pageSize: dto.numeroElementiPerPagina
        }
    }

    // Trasforma l'intera risposta del BE
    static toResponseState(dto: TransactionResponseDTO) {
        return {
            transactions: dto.transactions.map(this.toEntity),
            pagination: this.toPaginazioneEntity(dto.paginazione)
        }
    }

    static toDTO(entity: TransactionVO): TransactionDTO {
        const dto: TransactionDTO = {
            title: entity.title,
            amount: entity.amount,
            category: CategoryMapper.toDTO(entity.category),
            date: entity.date
        };

        // Includiamo l'id nel DTO solo se è presente (necessario per PUT/DELETE)
        if (entity.id && entity.id.trim() !== '') {
            dto.id = entity.id;
        }

        return dto;
    }
}