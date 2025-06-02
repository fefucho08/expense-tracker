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
    INCOME: "Income",
    OTHERS: "Others",
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

export const getTransactions = (
    category = undefined,
    year = undefined,
    month = undefined
) => {
    let transactions = [];
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

    if (month && year) {
        transactions = transactions.filter(
            (transaction) =>
                transaction.date.getMonth() + 1 === month &&
                transaction.date.getFullYear() === year
        );
    }

    return transactions;
};

export class Transaction {
    constructor(description, category, amount, date, id) {
        // date
        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const [year, month, day] = date.split("-");
            this.date = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
            this.date = new Date(date);
        }
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.id = Number(id);
    }

    delete() {
        let data = getData();
        let categoryData = data[this.category];
        categoryData = {
            ...categoryData,
            transactions: categoryData.transactions.filter(
                (transaction) => transaction.id != this.id
            ),
        };

        data = { ...data, [this.category]: categoryData };
        saveData(data);
    }

    toTr() {
        const tr = document.createElement("tr");
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
        updateBtn.setAttribute("data-bs-toggle", "modal");
        updateBtn.setAttribute("data-bs-target", "#updateExpenseModal");

        updateBtn.addEventListener("click", () => {
            document.querySelector("#updateExpenseDate").value =
                this.date.toLocaleDateString("en-CA", {
                    timeZone: "America/Vancouver",
                });
            document.querySelector("#updateExpenseDescription").value =
                this.description;
            document.querySelector("#updateExpenseCategory").value =
                this.category;
            document.querySelector("#updateExpenseAmount").value = this.amount;
            document.querySelector("#updateTransactionId").value = this.id;
        });

        const updateIcon = document.createElement("i");
        updateIcon.className = "bi bi-pencil-square";
        updateBtn.append(updateIcon);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-outline-danger me-2";

        deleteBtn.addEventListener("click", () => {
            this.delete();
            renderTransactions();
        });

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "bi bi-trash";
        deleteBtn.append(deleteIcon);

        actionsTd.append(updateBtn, deleteBtn);
        tr.append(actionsTd);

        return tr;
    }

    toShortTr() {
        const tr = document.createElement("tr");
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

        return tr;
    }
}
