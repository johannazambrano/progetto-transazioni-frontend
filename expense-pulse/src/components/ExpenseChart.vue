<script setup lang="ts">
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js";
import { useExpenseStore } from "@/stores/expenseStore";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const store = useExpenseStore();

// Interfaccia per garantire a TS la struttura dei dati
interface PieChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
}

const hasData = computed(() => store.transactions.some((t) => t.amount < 0));

const chartData = computed<PieChartData>(() => {
  const expenses = store.transactions.filter(t => t.amount < 0);
  const dataMap: Record<string, number> = {};
  
  expenses.forEach(t => {
    const catName = t.category.descrizione;
    dataMap[catName] = (dataMap[catName] || 0) + Math.abs(t.amount);
  });

  return {
    labels: Object.keys(dataMap),
    datasets: [{
      data: Object.values(dataMap),
      backgroundColor: ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'],
      borderWidth: 0,
    }]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { usePointStyle: true, padding: 20 },
    },
  },
};
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <!-- <h3 class="text-lg font-bold mb-4 text-gray-800">Distribuzione Spese</h3> -->
    <div class="h-64 flex justify-center">
      <Pie v-if="hasData" :data="chartData" :options="chartOptions" />
      <div v-else class="flex items-center text-gray-400">
        <p>Nessuna spesa registrata</p>
      </div>
    </div>
  </div>
</template>