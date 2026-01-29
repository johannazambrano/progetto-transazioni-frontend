<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import type { PaginationVO } from "@/models/vo/PaginationVO";

defineProps<{
  pagination: PaginationVO | null;
}>();

const emit = defineEmits(['change']);
</script>

<template>
  <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-center gap-4 mt-8 py-4">
    <button @click="emit('change', pagination.currentPage - 1)" :disabled="pagination.currentPage === 0"
      class="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors">
      <ChevronLeft :size="20" />
    </button>

    <div class="text-sm font-medium text-gray-600">
      Pagina <span class="font-bold text-gray-900">{{ pagination.currentPage + 1 }}</span> di {{ pagination.totalPages
      }}
    </div>

    <button @click="emit('change', pagination.currentPage + 1)"
      :disabled="pagination.currentPage >= pagination.totalPages - 1"
      class="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors">
      <ChevronRight :size="20" />
    </button>
  </div>
</template>
