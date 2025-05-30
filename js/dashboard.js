import {
    Categories,
    getData,
    getTransactions,
    getTransactionsTotal,
} from "./index.js";

const sumAllExpenses = () => {
    let sum = 0;
    for (let category of Object.values(Categories)) {
        if (category === Categories.INCOME) continue;
        sum += getTransactionsTotal(category);
    }
    return sum;
};

const sumAllIncomes = () => {
    return getTransactionsTotal(Categories.INCOME);
};

const getBalance = () => {
    return sumAllIncomes() - sumAllExpenses();
};

const getBudgetTotal = () => {
    let sum = 0;
    let data = getData();
    for (let category of Object.values(Categories)) {
        if (category === Categories.INCOME) continue;
        sum += parseFloat(data[category].budget);
    }
    return sum;
};

const renderRecentTransactions = () => {
    const transactions = getTransactions().slice(0, 5);

    document.querySelector("#recentExpensesTableBody").innerHTML = "";

    transactions.forEach((transaction) => {
        document
            .querySelector("#recentExpensesTableBody")
            .append(transaction.toShortTr());
    });
};

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(
        "#expensesAmount"
    ).innerText = `$${sumAllExpenses().toFixed(2)}`;

    document.querySelector(
        "#incomeAmount"
    ).innerText = `$${sumAllIncomes().toFixed(2)}`;

    document.querySelector(
        "#balanceAmount"
    ).innerText = `$${getBalance().toFixed(2)}`;

    document.querySelector(
        "#totalBudget"
    ).innerText = `$${getBudgetTotal().toFixed(2)}`;

    document.querySelector(
        "#usedBudget"
    ).innerText = `$${sumAllExpenses().toFixed(2)}`;

    document.querySelector("#remainingBudget").innerText = `$${(
        getBudgetTotal() - sumAllExpenses()
    ).toFixed(2)}`;

    renderRecentTransactions();
});
