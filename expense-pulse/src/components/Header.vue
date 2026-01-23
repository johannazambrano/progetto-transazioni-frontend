<script setup lang="ts">
import { RouterLink } from "vue-router";
import { House, Layers } from "lucide-vue-next";
</script>

<template>
  <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">ExpensePulse</h1>
        <p class="text-gray-500">Monitora le tue finanze in tempo reale</p>
      </div>
     <div class="flex gap-2">
        <RouterLink to="/"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
          <House :size="18" />
          Home
        </RouterLink>
        <RouterLink to="/categories"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
          <Layers :size="18" />
          Gestione Categorie
        </RouterLink>
      </div>
    </div>
</template>