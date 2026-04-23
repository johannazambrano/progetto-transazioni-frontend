<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  showHeader?: boolean
  showFooter?: boolean
}

withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFooter: false,
})
</script>

<template>
  <div class="card-wrapper">
    <header v-if="showHeader" class="card-header">
      <slot name="header">
        <div v-if="title" class="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">{{ title }}</h2>
          <span v-if="subtitle" class="text-xs sm:text-sm text-gray-500">{{ subtitle }}</span>
        </div>
      </slot>
    </header>

    <div class="card-content">
      <slot />
    </div>

    <footer v-if="showFooter" class="card-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>