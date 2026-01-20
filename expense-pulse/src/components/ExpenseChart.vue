<script setup lang="ts">
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
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
  const expenses = store.transactions.filter((t) => t.amount < 0);
  const dataMap: Record<string, { total: number; color: string }> = {};

  expenses.forEach((t) => {
    const catName = t.category.descrizione;
    const catColor = t.category.colore || "#CBD5E1"; // Fallback se il colore è null

    if (!dataMap[catName]) {
      dataMap[catName] = { total: 0, color: catColor };
    }
    dataMap[catName].total += Math.abs(t.amount);
  });

  // Trasformiamo la mappa in un array di oggetti
  const chartItems = Object.entries(dataMap).map(([label, info]) => ({
    label,
    total: info.total,
    color: info.color,
  }));

  return {
    labels: chartItems.map((i) => i.label),
    datasets: [
      {
        data: chartItems.map((i) => i.total),
        backgroundColor: chartItems.map((i) => i.color),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
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
    <h3 class="text-lg font-bold mb-4 text-gray-800">Distribuzione Spese</h3>
    <div class="h-64 flex justify-center">
      <Pie v-if="hasData" :data="chartData" :options="chartOptions" />
      <div v-else class="flex items-center text-gray-400">
        <p>Nessuna spesa registrata</p>
      </div>
    </div>
  </div>
</template>
