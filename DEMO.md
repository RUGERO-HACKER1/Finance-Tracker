# 🏦 Personal Finance Tracker - DEMO

## 🚀 How to Use the App

### Step 1: Open the App
1. Open `index.html` in your web browser
2. You'll see the clean, modern interface with:
   - Balance display showing 0 RWF
   - Transaction form
   - Empty transaction history
   - Pie chart (empty initially)

### Step 2: Add Sample Data (Quick Start)
1. Click the "✨ Add Sample Data" button
2. This will add 4 sample transactions:
   - Monthly Salary: +100,000 RWF (Income)
   - Lunch at Restaurant: -15,000 RWF (Expense)
   - Bus Transport: -5,000 RWF (Expense)
   - Movie Tickets: -12,000 RWF (Expense)

### Step 3: See the Results
After adding sample data, you'll see:
- **Balance**: 68,000 RWF (100,000 - 32,000)
- **Total Income**: 100,000 RWF
- **Total Expenses**: 32,000 RWF
- **Transaction History**: List of all transactions with delete buttons
- **Pie Chart**: Visual breakdown of expenses by category

### Step 4: Add Your Own Transaction
1. Fill in the form:
   - **Description**: "Coffee" 
   - **Amount**: 3000
   - **Type**: Select "Expense"
   - **Category**: Select "Food"
2. Click "Add Transaction"
3. Watch the balance update instantly!

### Step 5: Try Advanced Features

#### 🌙 Dark Mode
- Click the moon/sun icon in the header
- Toggle between light and dark themes
- Preference is saved automatically

#### 🔍 Search & Filter
- Use the search box to find transactions: "lunch"
- Use the filter dropdown: "Income Only" or "Expenses Only"
- Results update instantly

#### 📥 Export Data
- Click "Export CSV" to download your transactions
- File includes: Date, Description, Category, Type, Amount

#### 🗑️ Clear Data
- Click "Clear All" to remove all transactions
- Confirmation dialog prevents accidents

## 🎯 Example User Flow (As Requested)

### Day 1: Starting Fresh
```
1. Add income: "Salary – 100,000 RWF"
   → Balance = 100,000 RWF ✅

2. Add expense: "Transport – 5,000 RWF" 
   → Balance = 95,000 RWF ✅

3. Add expense: "Food – 20,000 RWF"
   → Balance = 75,000 RWF ✅
```

### View Analytics
- Open "Charts" section
- See pie chart: Transport = 20%, Food = 80% ✅
- Visual breakdown of spending habits

### Data Persistence
- Close browser and reopen
- All data is still there (localStorage) ✅
- No data loss on refresh

## 🌟 Special Features That Make It Stand Out

### 1. **Dark Mode Toggle** 🌙
- Modern dark/light theme switcher
- Saves user preference
- Smooth transitions

### 2. **Real-time Search** 🔍
- Instant search as you type
- Searches both description and category
- No page reload needed

### 3. **Smart Filtering** 📊
- Filter by transaction type
- Show only income or expenses
- Combine with search for powerful filtering

### 4. **CSV Export** 📥
- Professional data export
- Compatible with Excel/Google Sheets
- Includes all transaction details

### 5. **Interactive Charts** 📈
- Beautiful pie chart using Chart.js
- Shows expense breakdown by category
- Updates automatically with new data

### 6. **Mobile Responsive** 📱
- Works perfectly on phones and tablets
- Touch-friendly interface
- Optimized layouts for small screens

### 7. **Data Validation** ✅
- Prevents invalid entries
- User-friendly error messages
- Form validation with visual feedback

### 8. **Smooth Animations** ✨
- Slide-in animations for new transactions
- Hover effects on buttons
- Professional polish

## 🔧 Technical Features

- **Pure JavaScript** - No frameworks needed
- **LocalStorage** - Data persists between sessions
- **Chart.js** - Professional charts
- **CSS Grid/Flexbox** - Modern responsive layout
- **Font Awesome** - Beautiful icons
- **ES6+ Classes** - Clean, organized code

## 📱 Mobile Experience

The app is fully responsive:
- Forms stack vertically on mobile
- Touch-friendly buttons
- Optimized chart sizing
- Easy navigation

## 🎨 Design Highlights

- **Modern CSS Variables** - Easy theming
- **Card-based Layout** - Clean organization
- **Color-coded Transactions** - Green income, red expenses
- **Professional Typography** - Easy to read
- **Subtle Shadows** - Depth and dimension

---

**Ready to manage your finances like a pro!** 💰✨
