import {
    Categories,
    createAlert,
    getData,
    saveData,
    getTransactionsTotal,
} from "./index.js";

class BudgetCard {
    constructor(name) {
        this.name = name;

        const cardComponent = document.createElement("div");
        cardComponent.className = "col-md-6";

        cardComponent.innerHTML = `<div class='card bg-secondary-subtle text-light'>
              <div class='card-body' id='${name}'>
                <h5 class='card-title'>${name}</h5>
                <div class='mb-3'>
                  <label class='form-label'>Budget Limit ($)</label>
                  <input
                    type='number'
                    class='form-control bg-dark text-light'
                    placeholder='Enter amount'
                  />
                  <p class='mt-3'><strong>Spent: </strong><span class='budgetSpent'>$0.00</span></p>
                </div>
                <button class='btn btn-outline-primary w-100'>Save</button>
              </div>
            </div>`;

        this.component = cardComponent;
    }

    toComponent() {
        return this.component;
    }
}

const saveBudget = (category, newBudget) => {
    const data = getData();
    data[category].budget = parseFloat(newBudget);
    saveData(data);
};

const container = document.querySelector("#budgetFormContainer");
const categories = Object.values(Categories).filter(
    (category) => category !== Categories.INCOME
);

categories.forEach((category) => {
    container.append(new BudgetCard(category).toComponent());

    const saveButton = document.querySelector(`#${category} button`);
    const budgetInput = document.querySelector(`#${category} input`);
    document.querySelector(`#${category} .budgetSpent`).innerText =
        getTransactionsTotal(category).toFixed(2);
    budgetInput.value = parseFloat(getData()[category].budget);
    const spentElement = document.querySelector(`#${category} .budgetSpent`);

    const spent = getTransactionsTotal(category);
    const budget = parseFloat(getData()[category].budget);

    spentElement.innerText = `$${spent.toFixed(2)}`;
    budgetInput.value = budget;

    if (spent > budget) {
        spentElement.classList.add("text-danger");
    } else {
        spentElement.classList.remove("text-danger");
    }

    saveButton.addEventListener("click", () => {
        if (budgetInput.value) {
            saveBudget(category, budgetInput.value);
            createAlert("Budget saved!", "success");

            const updatedBudget = parseFloat(budgetInput.value);
            if (spent > updatedBudget) {
                spentElement.classList.add("text-danger");
            } else {
                spentElement.classList.remove("text-danger");
            }
        } else {
            createAlert("Please fill the input", "danger");
        }
    });
});
