import { getTransactions, Categories } from "./index.js";

let pieChart;

function getMonthlyCategoryTotals(year, month) {
  const totals = {};
  for (const category of Object.values(Categories)) {
    if (category !== Categories.INCOME) {
      totals[category] = 0;
    }
  }

  const transactions = getTransactions(undefined, year, month);

  transactions.forEach((tx) => {
    if (
      tx.category !== Categories.INCOME &&
      totals[tx.category] !== undefined
    ) {
      totals[tx.category] += parseFloat(tx.amount);
    }
  });

  return totals;
}

function renderPieChart(year, month) {
  const totals = getMonthlyCategoryTotals(year, month);
  const labels = [];
  const data = [];

  for (let [category, amount] of Object.entries(totals)) {
    if (amount > 0) {
      labels.push(category);
      data.push(amount);
    }
  }

  const ctx = document.getElementById("categoryPieChart").getContext("2d");

  if (pieChart) pieChart.destroy();

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#e6194b", // 빨강
            "#3cb44b", // 초록
            "#ffe119", // 노랑
            "#4363d8", // 파랑
            "#f58231", // 주황
            "#911eb4", // 보라
            "#46f0f0", // 시안
            "#f032e6", // 핑크
            "#bcf60c", // 연두
            "#fabebe", // 연핑크
            "#008080", // 짙은 청록
            "#e6beff", // 라벤더
          ],
        },
      ],
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20,
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Expenses by Category – ${month}/${year}`,
          color: "#ffffff",
          font: {
            size: 18,
            weight: "bold",
          },
          padding: {
            bottom: 20,
          },
        },
        legend: {
          labels: {
            color: "#ffffff",
            font: {
              size: 12,
            },
            padding: 20,
          },
          position: "bottom",
          title: {
            display: false,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const total = context.chart._metasets[context.datasetIndex].total;
              const percentage = ((value / total) * 100).toFixed(1);
              return ` $${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const monthInput = document.getElementById("summaryMonth");
  const today = new Date();
  monthInput.value = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  function updateChart() {
    const [year, month] = monthInput.value.split("-");
    renderPieChart(Number(year), Number(month));
  }

  monthInput.addEventListener("change", updateChart);

  updateChart();
});
