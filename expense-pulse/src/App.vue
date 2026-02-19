<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import Footer from './components/Footer.vue'
  import Header from './components/Header.vue';
</script>


<template>
  <div class="min-h-screen bg-gray-50 font-sanas">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>

<style>
  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  body {
    margin: 0;
    padding: 0;
  }
</style>
