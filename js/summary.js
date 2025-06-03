import { getTransactions, Categories } from "./index.js";

let pieChart;

const getMonthlyCategoryTotals = (year, month) => {
  const totals = {};
  for (let category of Object.values(Categories)) {
    if (category !== Categories.INCOME) {
      totals[category] = 0;
    }
  }

  const transactions = getTransactions(undefined, year, month);

  transactions.forEach((transaction) => {
    if (
      transaction.category !== Categories.INCOME &&
      totals[transaction.category] !== undefined
    ) {
      totals[transaction.category] += parseFloat(transaction.amount);
    }
  });

  return totals;
};

const renderPieChart = (year, month) => {
  const totals = getMonthlyCategoryTotals(year, month);
  const labels = [];
  const data = [];

  for (const [category, amount] of Object.entries(totals)) {
    if (amount > 0) {
      labels.push(category);
      data.push(amount);
    }
  }

  const pieChartContext = document
    .getElementById("categoryPieChart")
    .getContext("2d");

  if (pieChart) pieChart.destroy();

  const chartTitle =
    month && year
      ? `Expenses by Category – ${month}/${year}`
      : `Expenses by Category – All`;

  pieChart = new Chart(pieChartContext, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#e6194b", "#3cb44b", "#ffe119",
            "#4363d8", "#f58231", "#911eb4",
            "#46f0f0", "#f032e6", "#bcf60c",
            "#fabebe", "#008080", "#e6beff"
          ]
        }
      ]
    },
    options: {
      layout: { padding: { top: 20, bottom: 20 } },
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          color: "#ffffff",
          font: { size: 18, weight: "bold" },
          padding: { bottom: 20 }
        },
        legend: {
          labels: {
            color: "#ffffff",
            font: { size: 12 },
            padding: 20
          },
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const total = context.chart._metasets[context.datasetIndex].total;
              const percentage = ((value / total) * 100).toFixed(1);
              return ` $${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const monthInput = document.getElementById("summaryMonth");

  const updateChart = () => {
    const monthValue = monthInput.value;

    if (monthValue) {
      const [year, month] = monthValue.split("-");
      renderPieChart(Number(year), Number(month));
    } else {
      renderPieChart();
    }
  };

  monthInput.addEventListener("change", updateChart);

  updateChart();
});
