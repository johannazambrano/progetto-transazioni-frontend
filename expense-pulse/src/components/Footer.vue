<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
        <!-- <div class="mx-auto px-6 py-8">    RIPRISTINARE PER STILE FOOTER CLASSIMO -->
        <div class="mx-auto py-4"> 
            <!-- Sezione principale -->
            <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">  RIPRISTINARE PER STILE FOOTER CLASSIMO -->
            <div class="text-center">
                <!-- Brand -->
                <div>
                    <h3 class="text-xl font-bold mb-2">ExpensePulse</h3>
                    <p class="text-sm text-gray-400">
                        Gestisci le tue finanze con intelligenza
                    </p>
                </div>

                <!-- Links -->
                <!-- <div>   RIPRISTINARE PER STILE FOOTER CLASSIMO 
                    <h4 class="font-semibold mb-3">Link Utili</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Dashboard</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Categorie</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Report</a></li>
                    </ul>
                </div> -->

                <!-- Info -->
                <!-- <div>   RIPRISTINARE PER STILE FOOTER CLASSIMO 
                    <h4 class="font-semibold mb-3">Supporto</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Documentazione</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">FAQ</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition">Contatti</a></li>
                    </ul>
                </div> -->
            </div>

            <!-- Copyright -->
            <!-- <div class="border-t border-gray-700 pt-6 text-center">   RIPRISTINARE PER STILE FOOTER CLASSIMO -->
            <div class="pt-3 text-center">
                <p class="text-sm text-gray-400">
                    © {{ currentYear }} ExpensePulse. Tutti i diritti riservati.
                </p>
            </div>
        </div>
    </footer>
</template>
