// Function to load existing expenses from localStorage
function loadExpenses() {
  const data = localStorage.getItem("expenses");
  return data ? JSON.parse(data) : [];
}

// Function to save a new expense to localStorage
function saveExpense(expense) {
  const expenses = loadExpenses();
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Function to render the 5 most recent transactions
function renderRecentTransactions() {
  const expenses = loadExpenses().slice(-5).reverse(); // Get the last 5 items
  const tbody = document.querySelector("#expenses tbody");
  tbody.innerHTML = "";

  expenses.forEach((exp) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${exp.date}</td>
            <td>${exp.description}</td>
            <td>
                <span class="badge ${
                  exp.type === "income" ? "bg-success" : "bg-danger"
                }">
                    ${exp.type.charAt(0).toUpperCase() + exp.type.slice(1)}
                </span>
            </td>
            <td class="${
              exp.type === "income" ? "text-success" : "text-danger"
            }">
                ${exp.type === "income" ? "+" : "-"} $${parseFloat(
      exp.amount
    ).toFixed(2)}
            </td>
        `;

    tbody.appendChild(tr);
  });
}

// Handle form submission
document
  .getElementById("addExpenseForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const newExpense = {
      date: document.getElementById("expenseDate").value,
      description: document.getElementById("expenseDescription").value,
      category: document.getElementById("expenseCategory").value,
      type: document.getElementById("expenseType").value,
      amount: parseFloat(document.getElementById("expenseAmount").value),
    };

    saveExpense(newExpense);

    // Close the modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addExpenseModal")
    );
    modal.hide();

    // Reset the form
    this.reset();

    // Refresh recent transactions
    renderRecentTransactions();
  });

// On page load, display recent transactions
document.addEventListener("DOMContentLoaded", function () {
  renderRecentTransactions();
});
