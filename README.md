# 💸 Expense Tracker

## 📝 Overview
Expense Tracker is a client-side web application that helps users track and manage their personal expenses. Built entirely with JavaScript, HTML, and Bootstrap, it allows users to add, edit, delete, and categorize expenses — while storing all data in the browser's **Local Storage**. No backend or database setup is needed.

This project emphasizes **usability**, **visual feedback**, and **budget management**, with intuitive forms and dynamic charts.

---

## 🎯 Key Features

### 📂 Expense Management
- Add a new expense with:
  - Description
  - Amount
  - Date (calendar input)
  - Category (select dropdown)
- Edit or delete existing transactions through action buttons on each row
- All transactions are stored as instances of a `Transaction` class with unique `id`

### 📊 Dashboard Summary
- Automatic calculations for:
  - Total income
  - Total expenses
  - Net balance
  - Total budget vs. used budget
- Recent 5 transactions preview
- Category-wise **pie chart** using Chart.js (with month filter)

### 📁 Category & Filtering
- Expenses are grouped by predefined categories such as:
  - Personal, Groceries, Transport, Health, etc.
- Users can filter transactions by:
  - Specific category
  - Year and month
- Reset filter to view all transactions

### 📉 Budget Management
- User can set a monthly **budget limit** for each category
- Real-time display of:
  - Spent amount per category
  - Visual warning if expenses exceed the budget (text turns red)
  - Alert shown if the remaining budget is less than $20 or exceeded

### 💾 Local Storage Integration
- All data (expenses, budgets) are stored in `localStorage`
- Data is automatically saved on every action and remains available after page reloads or browser restarts
- `getData()` and `saveData()` functions abstract storage operations

---

## 🛠 Tech Stack

| Area         | Technology             |
|--------------|------------------------|
| Frontend     | HTML5, JavaScript      |
| UI Framework | Bootstrap 5            |
| Charting     | Chart.js               |
| Data Storage | Browser LocalStorage   |

---

## 📌 Notable Implementation Details

- `Transaction` class handles creation and rendering (via `.toTr()` and `.toShortTr()`)
- Pie chart dynamically updates when the month is changed (`summaryMonth`)
- Category dropdowns (`Add`, `Edit`, `Filter`) are generated programmatically
- Alerts shown using custom `createAlert()` for success/warning/error feedback
- Input validation and user experience refined via Bootstrap form components

---

## 🚀 Getting Started

1. Clone or download the repository
2. Open `index.html` in a modern browser
3. Add your expenses and explore the dashboard

> 💡 No server or deployment needed — works 100% offline!

---

## ✅ Evaluation Summary

This project fulfills the following:
- ✔️ **Functionality**: Full CRUD for expenses, budgeting, and filtering
- ✔️ **Usability**: Clear UI, modal-based interactions, responsive layout
- ✔️ **Persistence**: All data handled via `localStorage`
- ✔️ **Visual Clarity**: Dynamic summaries with charts and alerts

---

## 📂 File Structure

```bash
EXPENSE-TRACKER/
├── js/
│   ├── budget.js
│   ├── dashboard.js
│   ├── expenses.js
│   ├── index.js
│   └── summary.js
├── views/
│   ├── budget.html
│   ├── dashboard.html
│   ├── expenses.html
│   └── summary.html
├── README.md
└── .vscode/
```

---

## 📬 Contact
For questions or suggestions, feel free to reach out via GitHub Issues or pull requests.