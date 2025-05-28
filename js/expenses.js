import {
    createAlert,
    getData,
    getTransactionsTotal,
    getTransactions,
    saveData,
    Transaction,
} from "./index.js";

const createExpense = (transaction) => {
    const data = getData();
    data[transaction.category].transactions.push(transaction);

    saveData(data);

    if (
        getTransactionsTotal(transaction.category) >
        data[transaction.category].budget
    ) {
        createAlert(
            `Your expenses in ${transaction.category} is over the budget`,
            "danger"
        );
    }

    renderTransactions();
};

document.querySelector("#addExpenseForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = new Date(document.querySelector("#expenseDate").value);
    const description = document.querySelector("#expenseDescription").value;
    const category = document.querySelector("#expenseCategory").value;
    const amount = parseFloat(document.querySelector("#expenseAmount").value);

    const transaction = new Transaction(
        description,
        category,
        amount,
        date,
        Date.now()
    );

    bootstrap.Modal.getInstance(
        document.querySelector("#addExpenseModal")
    ).hide();

    createExpense(transaction);

    e.target.reset();
});

export const renderTransactions = () => {
    const transactions = getTransactions();

    document.querySelector("#expenseTableBody").innerHTML = "";

    transactions.forEach((transaction) => {
        document.querySelector("#expenseTableBody").append(transaction.toTr());
    });
};

renderTransactions();
