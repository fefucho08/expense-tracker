import { renderTransactions } from "./expenses.js";

const initialize = () => {
    const expenseInfo = {};
    for (let category of Object.values(Categories)) {
        if (category === Categories.INCOME) {
            expenseInfo[category] = {
                transactions: [],
            };
        } else {
            expenseInfo[category] = {
                transactions: [],
                budget: 0,
            };
        }
    }
    localStorage.setItem("expenseInfo", JSON.stringify(expenseInfo));
};

export const Categories = {
    PERSONAL: "Personal",
    GROCERIES: "Groceries",
    TRANSPORT: "Transport",
    RESTAURANT: "Restaurant",
    HEALTH: "Health",
    EDUCATION: "Education",
    HOME: "Home",
    OTHERS: "Others",
    INCOME: "Income",
};

export const getData = () => {
    if (!localStorage.getItem("expenseInfo")) {
        initialize();
    }
    return JSON.parse(localStorage.getItem("expenseInfo"));
};

export const saveData = (newData) => {
    localStorage.setItem("expenseInfo", JSON.stringify(newData));
};

export const createAlert = (text, code) => {
    const alertElement = document.createElement("div");
    alertElement.className = `alert alert-${code} position-fixed top-0 start-50 mt-4`;
    alertElement.innerText = text;
    alertElement.style.transform = "translateX(-50%)";
    document.querySelector("body").append(alertElement);
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 2000);
};

export const getTransactionsTotal = (category) => {
    let sum = 0;
    const data = getData();
    const categoryTransactions = data[category].transactions;
    categoryTransactions.forEach((transaction) => {
        sum += parseFloat(transaction.amount);
    });
    return sum;
};

export const getTransactions = (category = undefined) => {
    const transactions = [];
    const data = getData();
    if (category) {
        data[category].transactions.forEach((transaction) => {
            transactions.push(
                new Transaction(
                    transaction.description,
                    transaction.category,
                    transaction.amount,
                    transaction.date,
                    transaction.id
                )
            );
        });
    } else {
        for (let category in data) {
            data[category].transactions.forEach((transaction) => {
                transactions.push(
                    new Transaction(
                        transaction.description,
                        transaction.category,
                        transaction.amount,
                        transaction.date,
                        transaction.id
                    )
                );
            });
        }
    }

    transactions.sort((a, b) => {
        if (new Date(a.date) < new Date(b.date)) {
            return 1;
        } else {
            return -1;
        }
    });

    return transactions;
};

export class Transaction {
    constructor(description, category, amount, date, id) {
        this.date = new Date(date);
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.id = id;
    }

    static delete(category, id) {
        let data = getData();
        let categoryData = data[category];
        categoryData = {
            ...categoryData,
            transactions: categoryData.transactions.filter(
                (transaction) => transaction.id !== id
            ),
        };

        data = { ...data, [category]: categoryData };

        saveData(data);
    }

    toTr() {
        const tr = document.createElement("tr");

        console.log(this.date);

        const year = this.date.getFullYear();
        const month = ("0" + (1 + this.date.getMonth())).slice(-2);
        const day = ("0" + this.date.getDate()).slice(-2);

        tr.innerHTML = `
            <td>${month}/${day}/${year}</td>
            <td>${this.description}</td>
            <td>${this.category}</td>
            <td class="${
                this.category === Categories.INCOME
                    ? "text-success"
                    : "text-danger"
            }">
                ${
                    this.category === Categories.INCOME ? "+" : "-"
                } $${parseFloat(this.amount).toFixed(2)}
            </td>
        `;

        const actionsTd = document.createElement("td");

        const updateBtn = document.createElement("button");
        updateBtn.className = "btn btn-sm btn-outline-warning me-2";

        const updateIcon = document.createElement("i");
        updateIcon.className = "bi bi-pencil-square";
        updateBtn.append(updateIcon);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-outline-danger me-2";

        deleteBtn.addEventListener("click", () => {
            Transaction.delete(this.category, this.id);
            renderTransactions();
        });

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "bi bi-trash";
        deleteBtn.append(deleteIcon);

        actionsTd.append(updateBtn, deleteBtn);
        tr.append(actionsTd);

        return tr;
    }
}
