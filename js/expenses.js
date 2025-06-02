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

    const categoryTotal = getTransactionsTotal(transaction.category);
    const categoryBudget = data[transaction.category].budget;
    if (categoryTotal > categoryBudget) {
        createAlert(
            `Your expenses in ${transaction.category} is over the budget`,
            "danger"
        );
    } else if (categoryBudget - categoryTotal < 20) {
        const remaining = categoryBudget - categoryTotal;
        createAlert(
            `You only have $${remaining.toFixed(2)} left in ${
                transaction.category
            }`,
            "warning"
        );
    }

    renderTransactions();
};

const updateExpense = (newTransaction) => {
    const transactions = getTransactions();
    const prevTransaction = transactions.find(
        (transaction) => transaction.id == newTransaction.id
    );
    prevTransaction.delete();
    createExpense(newTransaction);
    renderTransactions();
};

export const renderTransactions = () => {
    const category = document.querySelector("#filter-category").value;
    const date = document.querySelector("#filter-date").value;

    let year;
    let month;

    if (date) {
        const splitString = date.split("-");
        year = parseInt(splitString[0]);
        month = parseInt(splitString[1]);
    }

    const transactions = getTransactions(category, year, month);

    document.querySelector("#expenseTableBody").innerHTML = "";

    transactions.forEach((transaction) => {
        document.querySelector("#expenseTableBody").append(transaction.toTr());
    });
};

const generateCategoriesOptions = () => {
    const selectAdd = document.querySelector("#expenseCategory");
    const selectUpdate = document.querySelector("#updateExpenseCategory");
    const selectFilter = document.querySelector("#filter-category");

    [selectAdd, selectUpdate, selectFilter].forEach((select) => {
        for (let category of Object.values(Categories)) {
            const option = document.createElement("option");
            option.innerText = category;
            option.setAttribute("value", category);
            select.append(option);
        }
    });
};

window.onload = () => {
    document
        .querySelector("#addExpenseForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            
            // date
            const dateStr = document.querySelector("#expenseDate").value;
            const [year, month, day] = dateStr.split("-");
            const date = new Date(Number(year), Number(month) - 1, Number(day));

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

    document
        .querySelector("#updateExpenseForm")
        .addEventListener("submit", (e) => {
            e.preventDefault();
            const date = document.querySelector("#updateExpenseDate").value;
            const description = document.querySelector(
                "#updateExpenseDescription"
            ).value;
            const category = document.querySelector(
                "#updateExpenseCategory"
            ).value;
            const amount = parseFloat(
                document.querySelector("#updateExpenseAmount").value
            );
            const id = document.querySelector("#updateTransactionId").value;

            const transaction = new Transaction(
                description,
                category,
                amount,
                date,
                id
            );

            updateExpense(transaction);
            const modal = bootstrap.Modal.getInstance(
                document.querySelector("#updateExpenseModal")
            );
            modal.hide();
        });

    document
        .querySelector("#filter-category")
        .addEventListener("change", () => {
            renderTransactions();
        });

    document.querySelector("#resetFilters").addEventListener("click", () => {
        window.location.reload();
    });

    document.querySelector("#filter-date").addEventListener("change", () => {
        renderTransactions();
    });

    renderTransactions();
    generateCategoriesOptions();
};
