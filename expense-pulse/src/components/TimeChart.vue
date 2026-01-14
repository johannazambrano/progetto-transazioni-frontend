<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useExpenseStore } from "@/stores/expenseStore";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const store = useExpenseStore();

const chartData = computed(() => {
  // Ordiniamo le transazioni per data per avere un grafico coerente
  const sorted = [...store.transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Raggruppiamo i totali per giorno
  const dataMap: Record<string, number> = {};
  sorted.forEach((t) => {
    // Prendiamo solo le uscite (valore assoluto)
    if (t.amount < 0) {
      dataMap[t.date] = (dataMap[t.date] || 0) + Math.abs(t.amount);
    }
  });

  return {
    labels: Object.keys(dataMap),
    datasets: [
      {
        label: "Spese Giornaliere (€)",
        data: Object.values(dataMap),
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
    ],
  };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true
      },
    },
  };

</script>

<template>
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
    <h3 class="text-lg font-bold mb-4 text-gray-800">Andamento temporale delle Spese</h3>
    <div class="h-64">
      <Bar v-if="store.transactions.length > 0" :data="chartData" :options="chartOptions" />
      <div v-else class="h-full flex items-center justify-center text-gray-400">
        Nessun dato disponibile
      </div>
    </div>
  </div>
</template>
