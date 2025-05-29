import {
    createAlert,
    getData,
    getTransactionsTotal,
    getTransactions,
    saveData,
    Transaction,
    Categories,
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

const updateExpense = (transaction) => {
    const data = getData();
    let categoryData = data[category].transactions;
    const found = categoryData.find((element) => element.id === transaction.id);

    console.log(found);
}

export const renderTransactions = () => {
    const transactions = getTransactions();

    document.querySelector("#expenseTableBody").innerHTML = "";

    transactions.forEach((transaction) => {
        document.querySelector("#expenseTableBody").append(transaction.toTr());
    });
};

const generateCategoriesOptions = () => {
    const selectAdd = document.querySelector("#expenseCategory");
    const selectUpdate = document.querySelector("#updateExpenseCategory");

    [selectAdd, selectUpdate].forEach((select) => {
        for (let category of Object.values(Categories)) {
            const option = document.createElement("option");
            option.innerText = category;
            option.setAttribute("value", category);
            select.append(option);
        }
    })
};

window.onload = () => {
    document.querySelector("#addExpenseForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const date = new Date(document.querySelector("#expenseDate").value);
        const description = document.querySelector(
            "#expenseDescription"
        ).value;
        const category = document.querySelector("#expenseCategory").value;
        const amount = parseFloat(
            document.querySelector("#expenseAmount").value
        );

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
    

    renderTransactions();
    generateCategoriesOptions();
};
