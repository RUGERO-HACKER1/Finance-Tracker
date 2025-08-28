// 💰 Personal Finance Tracker Pro - Advanced Version

class FinanceTrackerPro {
    constructor() {
        this.transactions = this.loadFromStorage('transactions') || [];
        this.budgets = this.loadFromStorage('budgets') || [];
        this.goals = this.loadFromStorage('goals') || [];
        this.settings = this.loadFromStorage('settings') || this.getDefaultSettings();
        this.categories = this.loadFromStorage('categories') || this.getDefaultCategories();

        this.charts = {};
        this.currentSection = 'dashboard';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredTransactions = [];
        this.currentEditingId = null;

        this.init();
    }

    init() {
        try {
            // Initialize immediately without loading screen
            this.setupEventListeners();
            this.applyTheme();
            this.showSection('dashboard');
            this.updateAllDisplays();

            // Initialize charts after DOM is ready
            setTimeout(() => {
                try {
                    this.initializeCharts();
                    this.updateCharts();
                } catch (error) {
                    console.warn('Charts initialization failed:', error);
                    // Continue without charts
                }
            }, 100);

        } catch (error) {
            console.error('Initialization failed:', error);
            // Show basic interface
            this.showSection('dashboard');
        }
    }

    getDefaultSettings() {
        return {
            currency: 'RWF',
            theme: 'light',
            itemsPerPage: 10,
            notifications: true,
            language: 'en',
            dateFormat: 'MM/DD/YYYY',
            autoBackup: false
        };
    }

    getDefaultCategories() {
        return {
            income: [
                { id: 'salary', name: 'Salary', icon: '💼', color: '#10B981' },
                { id: 'freelance', name: 'Freelance', icon: '💻', color: '#059669' },
                { id: 'investment', name: 'Investment', icon: '📈', color: '#047857' },
                { id: 'gift', name: 'Gift', icon: '🎁', color: '#065F46' },
                { id: 'other-income', name: 'Other Income', icon: '💰', color: '#064E3B' }
            ],
            expense: [
                { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#EF4444' },
                { id: 'transport', name: 'Transportation', icon: '🚗', color: '#DC2626' },
                { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#B91C1C' },
                { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#991B1B' },
                { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#7F1D1D' },
                { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#F59E0B' },
                { id: 'education', name: 'Education', icon: '📚', color: '#D97706' },
                { id: 'other', name: 'Other', icon: '📦', color: '#92400E' }
            ]
        };
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Mobile menu toggle
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Theme toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Transaction form
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Edit transaction form
        document.getElementById('editTransactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateTransaction();
        });

        // Quick action buttons
        document.getElementById('quickAddIncome')?.addEventListener('click', () => {
            this.showAddTransactionModal('income');
        });

        document.getElementById('quickAddExpense')?.addEventListener('click', () => {
            this.showAddTransactionModal('expense');
        });

        document.getElementById('viewReports')?.addEventListener('click', () => {
            this.showSection('analytics');
        });

        document.getElementById('setBudget')?.addEventListener('click', () => {
            this.showSection('budgets');
        });

        // Add transaction button
        document.getElementById('addTransactionBtn')?.addEventListener('click', () => {
            this.showAddTransactionModal();
        });

        // Sample data button
        document.getElementById('addSampleBtn')?.addEventListener('click', () => {
            this.addSampleData();
        });

        // Export CSV button
        document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
            this.exportToCSV();
        });

        // Clear all button
        document.getElementById('clearAllBtn')?.addEventListener('click', () => {
            this.clearAllData();
        });

        // Search and filters
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.filterTransactions();
        });

        document.getElementById('searchInput')?.addEventListener('keyup', (e) => {
            this.filterTransactions();
        });

        document.getElementById('filterType')?.addEventListener('change', () => {
            this.filterTransactions();
        });

        document.getElementById('filterCategory')?.addEventListener('change', () => {
            this.filterTransactions();
        });

        document.getElementById('filterPeriod')?.addEventListener('change', () => {
            this.filterTransactions();
        });

        // Sort
        document.getElementById('sortBy')?.addEventListener('change', () => {
            this.filterTransactions();
        });

        // Bulk actions
        document.getElementById('selectAll')?.addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        document.getElementById('bulkDelete')?.addEventListener('click', () => {
            this.bulkDeleteTransactions();
        });

        // Export/Import
        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.exportTransactions();
        });

        document.getElementById('importBtn')?.addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile')?.addEventListener('change', (e) => {
            this.importTransactions(e);
        });

        // Period selector for analytics
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateAnalytics(e.target.dataset.period);
            });
        });

        // Budget buttons
        document.getElementById('addBudgetBtn')?.addEventListener('click', () => {
            this.showAddBudgetModal();
        });

        // Goal buttons
        document.getElementById('addGoalBtn')?.addEventListener('click', () => {
            this.showAddGoalModal();
        });

        // Settings buttons
        document.getElementById('exportAllData')?.addEventListener('click', () => {
            this.exportAllData();
        });

        document.getElementById('clearAllData')?.addEventListener('click', () => {
            this.clearAllData();
        });

        // Settings form elements
        document.getElementById('currencySetting')?.addEventListener('change', (e) => {
            this.updateSettings({ currency: e.target.value });
        });

        document.getElementById('itemsPerPageSetting')?.addEventListener('change', (e) => {
            this.updateSettings({ itemsPerPage: parseInt(e.target.value) });
            this.itemsPerPage = parseInt(e.target.value);
            this.filterTransactions();
        });

        document.getElementById('notificationsSetting')?.addEventListener('change', (e) => {
            this.updateSettings({ notifications: e.target.checked });
        });

        // Theme options
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.updateSettings({ theme });

                // Update active state
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Import data file input
        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.accept = '.json';
        importInput.style.display = 'none';
        importInput.addEventListener('change', (e) => this.importAllData(e));
        document.body.appendChild(importInput);

        document.getElementById('importData')?.addEventListener('click', () => {
            importInput.click();
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showAddTransactionModal();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportTransactions();
                        break;
                }
            }
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Auto-save settings
        document.getElementById('currencySetting')?.addEventListener('change', (e) => {
            this.settings.currency = e.target.value;
            this.saveToStorage('settings', this.settings);
            this.updateAllDisplays();
        });
    }

    // UI Management
    showLoadingScreen() {
        try {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.remove('hidden');
                loadingScreen.style.display = 'flex';
            }
        } catch (error) {
            console.warn('Could not show loading screen:', error);
        }
    }

    hideLoadingScreen() {
        try {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                loadingScreen.style.display = 'none';
            }
        } catch (error) {
            console.warn('Could not hide loading screen:', error);
        }
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName)?.classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            transactions: 'Transactions',
            analytics: 'Analytics',
            budgets: 'Budgets',
            goals: 'Goals',
            settings: 'Settings'
        };
        document.querySelector('.page-title').textContent = titles[sectionName] || 'Dashboard';

        this.currentSection = sectionName;

        // Load section-specific data
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'transactions':
                this.updateTransactionsList();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
            case 'budgets':
                this.updateBudgetsDisplay();
                break;
            case 'goals':
                this.updateGoalsDisplay();
                break;
            case 'settings':
                this.updateSettingsDisplay();
                break;
        }
    }

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-mode');

        // Update button icon
        const btn = document.getElementById('darkModeToggle');
        btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        // Save preference
        this.settings.theme = isDark ? 'dark' : 'light';
        this.saveToStorage('settings', this.settings);
    }

    applyTheme() {
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Transaction Management
    addTransaction() {
        const description = document.getElementById('description')?.value?.trim();
        const amount = parseFloat(document.getElementById('amount')?.value);
        const type = document.querySelector('input[name="type"]:checked')?.value;
        const category = document.getElementById('category')?.value;
        const date = document.getElementById('date')?.value;
        const notes = document.getElementById('notes')?.value?.trim() || '';

        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            category,
            date,
            notes,
            timestamp: new Date().toISOString()
        };

        // Validation
        if (!this.validateTransaction(transaction)) {
            return;
        }

        this.transactions.push(transaction);
        this.saveToStorage('transactions', this.transactions);
        this.updateAllDisplays();
        this.closeModal('addTransactionModal');
        this.showNotification(`✅ ${type === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');

        // Reset form
        document.getElementById('transactionForm').reset();
        this.setDefaultDate();
    }

    validateTransaction(transaction) {
        if (!transaction.description) {
            this.showNotification('Description is required', 'error');
            return false;
        }
        if (!transaction.amount || transaction.amount <= 0) {
            this.showNotification('Amount must be greater than 0', 'error');
            return false;
        }
        if (!transaction.type) {
            this.showNotification('Transaction type is required', 'error');
            return false;
        }
        if (!transaction.category) {
            this.showNotification('Category is required', 'error');
            return false;
        }
        if (!transaction.date) {
            this.showNotification('Date is required', 'error');
            return false;
        }
        return true;
    }

    updateTransaction() {
        const form = document.getElementById('editTransactionForm');
        const formData = new FormData(form);
        const id = parseInt(formData.get('id') || document.getElementById('editTransactionId').value);

        const updatedTransaction = {
            id,
            description: formData.get('description')?.trim() || document.getElementById('editDescription').value.trim(),
            amount: parseFloat(formData.get('amount') || document.getElementById('editAmount').value),
            type: formData.get('editType') || document.querySelector('input[name="editType"]:checked')?.value,
            category: formData.get('category') || document.getElementById('editCategory').value,
            date: formData.get('date') || document.getElementById('editDate').value,
            notes: formData.get('notes')?.trim() || document.getElementById('editNotes').value.trim(),
            timestamp: new Date().toISOString()
        };

        if (!this.validateTransaction(updatedTransaction)) {
            return;
        }

        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.transactions[index] = updatedTransaction;
            this.saveToStorage('transactions', this.transactions);
            this.updateAllDisplays();
            this.closeModal('editTransactionModal');
            this.showNotification('Transaction updated successfully!', 'success');
        }
    }

    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveToStorage('transactions', this.transactions);
            this.updateAllDisplays();
            this.showNotification('Transaction deleted successfully!', 'info');
        }
    }

    bulkDeleteTransactions() {
        const selectedIds = Array.from(document.querySelectorAll('.transaction-checkbox:checked'))
            .map(cb => parseInt(cb.value));

        if (selectedIds.length === 0) {
            this.showNotification('No transactions selected', 'warning');
            return;
        }

        if (confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
            this.transactions = this.transactions.filter(t => !selectedIds.includes(t.id));
            this.saveToStorage('transactions', this.transactions);
            this.updateAllDisplays();
            this.showNotification(`${selectedIds.length} transactions deleted`, 'info');
        }
    }

    // Display Updates
    updateAllDisplays() {
        this.updateDashboard();
        this.updateTransactionsList();
        this.updateAnalytics();
        this.updateCharts();
    }

    updateDashboard() {
        const stats = this.calculateStats();
        const monthlyStats = this.getMonthlyStats();

        // Update main balance cards
        const totalBalanceEl = document.getElementById('totalBalance');
        const totalIncomeEl = document.getElementById('totalIncome');
        const totalExpensesEl = document.getElementById('totalExpenses');
        const savingsRateEl = document.getElementById('savingsRate');

        if (totalBalanceEl) {
            totalBalanceEl.textContent = this.formatCurrency(stats.balance);
            totalBalanceEl.style.color = stats.balance >= 0 ? 'var(--success-600)' : 'var(--danger-600)';
        }

        if (totalIncomeEl) {
            totalIncomeEl.textContent = this.formatCurrency(stats.income);
        }

        if (totalExpensesEl) {
            totalExpensesEl.textContent = this.formatCurrency(stats.expenses);
        }

        // Update monthly balance in header
        const monthlyBalanceEl = document.getElementById('monthlyBalance');
        if (monthlyBalanceEl) {
            monthlyBalanceEl.textContent = this.formatCurrency(monthlyStats.balance);
            monthlyBalanceEl.style.color = monthlyStats.balance >= 0 ? 'var(--success-600)' : 'var(--danger-600)';
        }

        // Update monthly income
        const monthlyIncomeEl = document.getElementById('monthlyIncome');
        if (monthlyIncomeEl) {
            monthlyIncomeEl.textContent = this.formatCurrency(monthlyStats.income);
        }

        // Update monthly expenses
        const monthlyExpensesEl = document.getElementById('monthlyExpenses');
        if (monthlyExpensesEl) {
            monthlyExpensesEl.textContent = this.formatCurrency(monthlyStats.expenses);
        }

        // Update savings rate
        const savingsRate = stats.income > 0 ? ((stats.balance / stats.income) * 100) : 0;
        if (savingsRateEl) {
            savingsRateEl.textContent = `${savingsRate.toFixed(1)}%`;
        }

        const savingsProgressEl = document.getElementById('savingsProgress');
        if (savingsProgressEl) {
            savingsProgressEl.style.width = `${Math.max(0, Math.min(100, savingsRate))}%`;
        }

        // Update balance change indicator
        const balanceChangeEl = document.getElementById('balanceChange');
        if (balanceChangeEl) {
            const changePercent = this.calculateBalanceChange();
            const isPositive = changePercent >= 0;
            balanceChangeEl.innerHTML = `
                <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                <span>${isPositive ? '+' : ''}${changePercent.toFixed(1)}% from last month</span>
            `;
            balanceChangeEl.style.color = isPositive ? 'var(--success-600)' : 'var(--danger-600)';
        }

        // Update recent transactions
        this.updateRecentTransactions();

        // Update transaction counts
        const totalTransactionsEl = document.getElementById('totalTransactions');
        if (totalTransactionsEl) {
            totalTransactionsEl.textContent = stats.totalTransactions;
        }

        const monthlyTransactionsEl = document.getElementById('monthlyTransactions');
        if (monthlyTransactionsEl) {
            monthlyTransactionsEl.textContent = monthlyStats.transactionCount;
        }

        // Update average daily spending
        const avgDailyEl = document.getElementById('avgDaily');
        if (avgDailyEl) {
            const avgDaily = monthlyStats.transactionCount > 0 ?
                (monthlyStats.expenses / new Date().getDate()).toFixed(0) : 0;
            avgDailyEl.textContent = this.formatCurrency(avgDaily);
        }
    }

    calculateStats() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            balance: income - expenses,
            totalTransactions: this.transactions.length
        };
    }

    getMonthlyStats() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
        });

        const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expenses,
            balance: income - expenses,
            transactionCount: monthlyTransactions.length
        };
    }

    calculateBalanceChange() {
        // Calculate balance change from previous month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthBalance = this.getMonthlyStats().balance;

        const previousMonthTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === previousMonth &&
                   transactionDate.getFullYear() === previousYear;
        });

        const previousMonthIncome = previousMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const previousMonthExpenses = previousMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const previousMonthBalance = previousMonthIncome - previousMonthExpenses;

        if (previousMonthBalance === 0) return 0;

        return ((currentMonthBalance - previousMonthBalance) / Math.abs(previousMonthBalance)) * 100;
    }

    updateRecentTransactions() {
        const container = document.getElementById('recentTransactionsList');
        if (!container) return;

        const recentTransactions = [...this.transactions]
            .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
            .slice(0, 5);

        if (recentTransactions.length === 0) {
            container.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-receipt"></i>
                    <p>No recent transactions</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-details">
                        <span class="transaction-category">
                            <i class="fas fa-tag"></i>
                            ${transaction.category}
                        </span>
                        <span class="transaction-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(transaction.date)}
                        </span>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }



    updateTransactionsList() {
        this.filterTransactions();
        this.updateTransactionStats();
        this.populateFilterCategories();
    }

    filterTransactions() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('filterType')?.value || 'all';
        const categoryFilter = document.getElementById('filterCategory')?.value || 'all';
        const periodFilter = document.getElementById('filterPeriod')?.value || 'all';
        const sortBy = document.getElementById('sortBy')?.value || 'date-desc';

        let filtered = [...this.transactions];

        // Apply filters
        if (searchTerm) {
            filtered = filtered.filter(t =>
                t.description.toLowerCase().includes(searchTerm) ||
                t.category.toLowerCase().includes(searchTerm) ||
                (t.notes && t.notes.toLowerCase().includes(searchTerm))
            );
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(t => t.type === typeFilter);
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(t => t.category === categoryFilter);
        }

        if (periodFilter !== 'all') {
            filtered = this.filterByPeriod(filtered, periodFilter);
        }

        // Apply sorting
        filtered = this.sortTransactions(filtered, sortBy);

        this.filteredTransactions = filtered;
        this.renderTransactionsList(filtered);
        this.updatePagination();
    }

    filterByPeriod(transactions, period) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (period) {
            case 'today':
                return transactions.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= today;
                });
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return transactions.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= weekAgo;
                });
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return transactions.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= monthAgo;
                });
            case 'year':
                const yearAgo = new Date(today);
                yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                return transactions.filter(t => {
                    const transactionDate = new Date(t.date);
                    return transactionDate >= yearAgo;
                });
            default:
                return transactions;
        }
    }

    sortTransactions(transactions, sortBy) {
        switch (sortBy) {
            case 'date-desc':
                return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-asc':
                return transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'amount-desc':
                return transactions.sort((a, b) => b.amount - a.amount);
            case 'amount-asc':
                return transactions.sort((a, b) => a.amount - b.amount);
            case 'category':
                return transactions.sort((a, b) => a.category.localeCompare(b.category));
            default:
                return transactions;
        }
    }

    renderTransactionsList(transactions) {
        const container = document.getElementById('transactionsList');
        if (!container) return;

        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-receipt"></i>
                    <h3>No transactions found</h3>
                    <p>Try adjusting your filters or add a new transaction</p>
                    <button class="btn-primary" onclick="financeTracker.showAddTransactionModal()">
                        <i class="fas fa-plus"></i> Add Transaction
                    </button>
                </div>
            `;
            return;
        }

        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedTransactions = transactions.slice(startIndex, endIndex);

        container.innerHTML = paginatedTransactions.map(transaction => `
            <div class="transaction-item">
                <input type="checkbox" class="transaction-checkbox" value="${transaction.id}">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-details">
                        <span class="transaction-category">
                            <i class="fas fa-tag"></i>
                            ${transaction.category}
                        </span>
                        <span class="transaction-date">
                            <i class="fas fa-calendar"></i>
                            ${this.formatDate(transaction.date)}
                        </span>
                        ${transaction.notes ? `
                            <span class="transaction-notes">
                                <i class="fas fa-sticky-note"></i>
                                ${transaction.notes.substring(0, 30)}${transaction.notes.length > 30 ? '...' : ''}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="action-btn-sm edit" onclick="financeTracker.editTransaction(${transaction.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn-sm delete" onclick="financeTracker.deleteTransaction(${transaction.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update bulk actions visibility
        this.updateBulkActionsVisibility();
    }

    updateTransactionStats() {
        const stats = this.calculateStats();
        const monthlyStats = this.getMonthlyStats();

        document.getElementById('totalTransactions').textContent = stats.totalTransactions;
        document.getElementById('monthlyTransactions').textContent = monthlyStats.transactionCount;

        // Calculate average daily spending
        const avgDaily = monthlyStats.transactionCount > 0 ?
            (monthlyStats.expenses / new Date().getDate()).toFixed(0) : 0;
        document.getElementById('avgDaily').textContent = this.formatCurrency(avgDaily);
    }

    populateFilterCategories() {
        const categoryFilter = document.getElementById('filterCategory');
        if (!categoryFilter) return;

        const categories = [...new Set(this.transactions.map(t => t.category))].sort();

        categoryFilter.innerHTML = `
            <option value="all">All Categories</option>
            ${categories.map(category => `
                <option value="${category}">${category}</option>
            `).join('')}
        `;
    }

    // Modal Management
    showAddTransactionModal(presetType = null) {
        const modal = document.getElementById('addTransactionModal');
        if (!modal) {
            this.showNotification('Transaction modal not found!', 'error');
            return;
        }

        modal.classList.add('active');

        // Set default date
        this.setDefaultDate();

        // Preset transaction type if provided
        if (presetType) {
            const typeRadio = document.querySelector(`input[name="type"][value="${presetType}"]`);
            if (typeRadio) {
                typeRadio.checked = true;
                // Trigger change event to update UI if needed
                typeRadio.dispatchEvent(new Event('change'));
            }
        }

        // Clear form
        document.getElementById('transactionForm')?.reset();
        this.setDefaultDate();

        // Re-apply preset type after reset
        if (presetType) {
            const typeRadio = document.querySelector(`input[name="type"][value="${presetType}"]`);
            if (typeRadio) typeRadio.checked = true;
        }

        // Focus on description field
        setTimeout(() => {
            document.getElementById('description')?.focus();
        }, 100);
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        // Populate edit form
        document.getElementById('editTransactionId').value = transaction.id;
        document.getElementById('editDescription').value = transaction.description;
        document.getElementById('editAmount').value = transaction.amount;
        document.getElementById('editCategory').value = transaction.category;
        document.getElementById('editDate').value = transaction.date;
        document.getElementById('editNotes').value = transaction.notes || '';

        // Set radio button
        const typeRadio = document.querySelector(`input[name="editType"][value="${transaction.type}"]`);
        if (typeRadio) typeRadio.checked = true;

        // Show modal
        document.getElementById('editTransactionModal').classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = today;
        }
    }

    // Bulk Actions
    toggleSelectAll(checked) {
        document.querySelectorAll('.transaction-checkbox').forEach(cb => {
            cb.checked = checked;
        });
        this.updateBulkActionsVisibility();
    }

    updateBulkActionsVisibility() {
        const selectedCount = document.querySelectorAll('.transaction-checkbox:checked').length;
        const bulkDelete = document.getElementById('bulkDelete');

        if (bulkDelete) {
            bulkDelete.style.display = selectedCount > 0 ? 'inline-flex' : 'none';
        }

        // Update select all checkbox
        const selectAll = document.getElementById('selectAll');
        const allCheckboxes = document.querySelectorAll('.transaction-checkbox');

        if (selectAll && allCheckboxes.length > 0) {
            selectAll.checked = selectedCount === allCheckboxes.length;
            selectAll.indeterminate = selectedCount > 0 && selectedCount < allCheckboxes.length;
        }
    }

    // Pagination
    updatePagination() {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');

        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';

        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.onclick = () => this.changePage(this.currentPage - 1);
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
            nextBtn.onclick = () => this.changePage(this.currentPage + 1);
        }

        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        }
    }

    changePage(newPage) {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);

        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderTransactionsList(this.filteredTransactions);
            this.updatePagination();
        }
    }

    // Charts and Analytics
    initializeCharts() {
        try {
            // Check if Chart.js is available
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded - charts will not be available');
                return;
            }

            this.initCategoryChart();
            this.initIncomeExpenseChart();
            this.initTrendsChart();
            this.initSparklines();
        } catch (error) {
            console.error('Chart initialization failed:', error);
            // Continue without charts
        }
    }

    initCategoryChart() {
        try {
            const ctx = document.getElementById('categoryChart')?.getContext('2d');
            if (!ctx || typeof Chart === 'undefined') return;

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
                        '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
                        '#EC4899', '#6B7280'
                    ],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${this.formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
        } catch (error) {
            console.error('Category chart initialization failed:', error);
        }
    }

    initIncomeExpenseChart() {
        const ctx = document.getElementById('incomeExpenseChart')?.getContext('2d');
        if (!ctx) return;

        this.charts.incomeExpense = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.label}: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    initTrendsChart() {
        const ctx = document.getElementById('trendsChart')?.getContext('2d');
        if (!ctx) return;

        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Income',
                    data: [],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Expenses',
                    data: [],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value)
                        }
                    }
                }
            }
        });
    }

    initSparklines() {
        // Initialize small sparkline charts for overview cards
        const incomeCtx = document.getElementById('incomeSparkline')?.getContext('2d');
        const expenseCtx = document.getElementById('expenseSparkline')?.getContext('2d');

        if (incomeCtx) {
            this.charts.incomeSparkline = new Chart(incomeCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        borderColor: '#10B981',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: {
                        point: { radius: 0 }
                    }
                }
            });
        }

        if (expenseCtx) {
            this.charts.expenseSparkline = new Chart(expenseCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        borderColor: '#EF4444',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: {
                        point: { radius: 0 }
                    }
                }
            });
        }
    }

    updateCharts() {
        this.updateCategoryChart();
        this.updateIncomeExpenseChart();
        this.updateTrendsChart();
        this.updateSparklines();
    }

    updateCategoryChart() {
        if (!this.charts.category) return;

        const expensesByCategory = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });

        const categories = Object.keys(expensesByCategory);
        const amounts = Object.values(expensesByCategory);

        if (categories.length === 0) {
            this.charts.category.data.labels = ['No expenses yet'];
            this.charts.category.data.datasets[0].data = [1];
            this.charts.category.data.datasets[0].backgroundColor = ['#E5E7EB'];
        } else {
            this.charts.category.data.labels = categories;
            this.charts.category.data.datasets[0].data = amounts;
            // Reset colors for actual data
            this.charts.category.data.datasets[0].backgroundColor = [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
                '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
                '#EC4899', '#6B7280'
            ];
        }

        this.charts.category.update();
    }

    updateIncomeExpenseChart() {
        if (!this.charts.incomeExpense) return;

        const stats = this.calculateStats();
        this.charts.incomeExpense.data.datasets[0].data = [stats.income, stats.expenses];
        this.charts.incomeExpense.update();
    }

    updateTrendsChart() {
        if (!this.charts.trends) return;

        // Get last 6 months of data
        const monthlyData = this.getMonthlyTrends(6);

        this.charts.trends.data.labels = monthlyData.labels;
        this.charts.trends.data.datasets[0].data = monthlyData.income;
        this.charts.trends.data.datasets[1].data = monthlyData.expenses;
        this.charts.trends.update();
    }

    updateSparklines() {
        // Update sparkline charts with last 7 days of data
        const dailyData = this.getDailyTrends(7);

        if (this.charts.incomeSparkline) {
            this.charts.incomeSparkline.data.labels = dailyData.labels;
            this.charts.incomeSparkline.data.datasets[0].data = dailyData.income;
            this.charts.incomeSparkline.update();
        }

        if (this.charts.expenseSparkline) {
            this.charts.expenseSparkline.data.labels = dailyData.labels;
            this.charts.expenseSparkline.data.datasets[0].data = dailyData.expenses;
            this.charts.expenseSparkline.update();
        }
    }

    // Data Analysis Methods
    getMonthlyTrends(months) {
        const now = new Date();
        const labels = [];
        const income = [];
        const expenses = [];

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            labels.push(monthName);

            const monthlyTransactions = this.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getMonth() === date.getMonth() &&
                       transactionDate.getFullYear() === date.getFullYear();
            });

            const monthlyIncome = monthlyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const monthlyExpenses = monthlyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            income.push(monthlyIncome);
            expenses.push(monthlyExpenses);
        }

        return { labels, income, expenses };
    }

    getDailyTrends(days) {
        const now = new Date();
        const labels = [];
        const income = [];
        const expenses = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            labels.push(dayName);

            const dailyTransactions = this.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.toDateString() === date.toDateString();
            });

            const dailyIncome = dailyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const dailyExpenses = dailyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            income.push(dailyIncome);
            expenses.push(dailyExpenses);
        }

        return { labels, income, expenses };
    }

    updateAnalytics(period = 'month') {
        this.updateCharts();
        this.updateTopCategories();
        this.updateFinancialInsights();
    }

    updateTopCategories() {
        const container = document.getElementById('topCategories');
        if (!container) return;

        const expensesByCategory = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });

        const sortedCategories = Object.entries(expensesByCategory)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (sortedCategories.length === 0) {
            container.innerHTML = `
                <div class="category-item">
                    <span class="category-name">No expense data available</span>
                </div>
            `;
            return;
        }

        const total = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

        container.innerHTML = sortedCategories.map(([category, amount]) => {
            const percentage = ((amount / total) * 100).toFixed(1);
            return `
                <div class="category-item">
                    <div class="category-info">
                        <span class="category-name">${category}</span>
                        <span class="category-amount">${this.formatCurrency(amount)}</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="category-percentage">${percentage}%</span>
                </div>
            `;
        }).join('');
    }

    updateFinancialInsights() {
        const container = document.getElementById('financialInsights');
        if (!container) return;

        const insights = this.generateInsights();

        if (insights.length === 0) {
            container.innerHTML = `
                <div class="insight-card">
                    <i class="fas fa-lightbulb"></i>
                    <p>Add more transactions to see personalized insights!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <i class="fas fa-${insight.icon}"></i>
                <p>${insight.message}</p>
            </div>
        `).join('');
    }

    generateInsights() {
        const insights = [];
        const stats = this.calculateStats();
        const monthlyStats = this.getMonthlyStats();

        // Spending insights
        if (monthlyStats.expenses > monthlyStats.income) {
            insights.push({
                type: 'warning',
                icon: 'exclamation-triangle',
                message: 'You\'re spending more than you earn this month. Consider reviewing your expenses.'
            });
        }

        // Savings insights
        const savingsRate = stats.income > 0 ? ((stats.balance / stats.income) * 100) : 0;
        if (savingsRate > 20) {
            insights.push({
                type: 'success',
                icon: 'piggy-bank',
                message: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income.`
            });
        } else if (savingsRate < 10 && stats.income > 0) {
            insights.push({
                type: 'info',
                icon: 'chart-line',
                message: 'Try to save at least 10-20% of your income for better financial health.'
            });
        }

        // Category insights
        const expensesByCategory = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            });

        const topCategory = Object.entries(expensesByCategory)
            .sort(([,a], [,b]) => b - a)[0];

        if (topCategory) {
            const [category, amount] = topCategory;
            const percentage = ((amount / stats.expenses) * 100).toFixed(1);
            insights.push({
                type: 'info',
                icon: 'chart-pie',
                message: `${category} is your biggest expense category, accounting for ${percentage}% of your spending.`
            });
        }

        return insights;
    }

    // Budget Management
    createBudget(budgetData) {
        const budget = {
            id: Date.now(),
            name: budgetData.name,
            category: budgetData.category,
            amount: parseFloat(budgetData.amount),
            period: budgetData.period, // monthly, weekly, yearly
            startDate: budgetData.startDate,
            endDate: budgetData.endDate,
            alertThreshold: parseFloat(budgetData.alertThreshold) || 80,
            isActive: true,
            createdAt: new Date().toISOString()
        };

        this.budgets.push(budget);
        this.saveToStorage('budgets', this.budgets);
        this.updateBudgetsDisplay();
        this.showNotification('Budget created successfully!', 'success');
    }

    updateBudget(id, budgetData) {
        const index = this.budgets.findIndex(b => b.id === id);
        if (index !== -1) {
            this.budgets[index] = { ...this.budgets[index], ...budgetData };
            this.saveToStorage('budgets', this.budgets);
            this.updateBudgetsDisplay();
            this.showNotification('Budget updated successfully!', 'success');
        }
    }

    deleteBudget(id) {
        if (confirm('Are you sure you want to delete this budget?')) {
            this.budgets = this.budgets.filter(b => b.id !== id);
            this.saveToStorage('budgets', this.budgets);
            this.updateBudgetsDisplay();
            this.showNotification('Budget deleted successfully!', 'info');
        }
    }

    getBudgetProgress(budget) {
        const now = new Date();
        const startDate = new Date(budget.startDate);
        const endDate = new Date(budget.endDate);

        // Get transactions for this budget period and category
        const budgetTransactions = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'expense' &&
                   t.category === budget.category &&
                   transactionDate >= startDate &&
                   transactionDate <= endDate;
        });

        const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount) * 100;

        return {
            spent,
            remaining,
            percentage: Math.min(percentage, 100),
            isOverBudget: spent > budget.amount,
            isNearLimit: percentage >= budget.alertThreshold,
            transactionCount: budgetTransactions.length
        };
    }

    updateBudgetsDisplay() {
        const container = document.getElementById('budgetsGrid');
        if (!container) return;

        if (this.budgets.length === 0) {
            container.innerHTML = `
                <div class="no-budgets">
                    <i class="fas fa-bullseye"></i>
                    <h3>No budgets set</h3>
                    <p>Create your first budget to track spending limits</p>
                    <button class="btn-primary" onclick="financeTracker.showAddBudgetModal()">
                        Create Budget
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.budgets.map(budget => {
            const progress = this.getBudgetProgress(budget);
            return `
                <div class="budget-card ${progress.isOverBudget ? 'over-budget' : progress.isNearLimit ? 'near-limit' : ''}">
                    <div class="budget-header">
                        <div class="budget-info">
                            <h3>${budget.name}</h3>
                            <p class="budget-category">${budget.category}</p>
                        </div>
                        <div class="budget-actions">
                            <button class="btn-icon" onclick="financeTracker.editBudget(${budget.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete" onclick="financeTracker.deleteBudget(${budget.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="progress-info">
                            <span class="spent">${this.formatCurrency(progress.spent)} spent</span>
                            <span class="remaining ${progress.remaining < 0 ? 'over' : ''}">${this.formatCurrency(Math.abs(progress.remaining))} ${progress.remaining < 0 ? 'over' : 'left'}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${progress.isOverBudget ? 'over-budget' : progress.isNearLimit ? 'near-limit' : ''}"
                                 style="width: ${progress.percentage}%"></div>
                        </div>
                        <div class="progress-percentage">${progress.percentage.toFixed(1)}% of ${this.formatCurrency(budget.amount)}</div>
                    </div>
                    <div class="budget-period">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(budget.startDate)} - ${this.formatDate(budget.endDate)}
                    </div>
                </div>
            `;
        }).join('');
    }

    showAddBudgetModal() {
        const modal = document.getElementById('addBudgetModal');
        if (!modal) {
            this.createBudgetModal();
        }
        document.getElementById('addBudgetModal').classList.add('active');
    }

    createBudgetModal() {
        const modalHTML = `
            <div id="addBudgetModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Create New Budget</h3>
                        <button class="modal-close" onclick="financeTracker.closeModal('addBudgetModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="budgetForm" class="modal-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="budgetName">Budget Name *</label>
                                <input type="text" id="budgetName" placeholder="e.g., Monthly Food Budget" required>
                            </div>
                            <div class="form-group">
                                <label for="budgetAmount">Budget Amount *</label>
                                <div class="amount-input">
                                    <input type="number" id="budgetAmount" placeholder="0" required min="1" step="0.01">
                                    <span class="currency">${this.settings.currency}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="budgetCategory">Category *</label>
                                <select id="budgetCategory" required>
                                    <option value="">Select Category</option>
                                    ${this.categories.expense.map(cat => `
                                        <option value="${cat.name}">${cat.icon} ${cat.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="budgetPeriod">Period *</label>
                                <select id="budgetPeriod" required>
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="budgetStartDate">Start Date *</label>
                                <input type="date" id="budgetStartDate" required>
                            </div>
                            <div class="form-group">
                                <label for="budgetEndDate">End Date *</label>
                                <input type="date" id="budgetEndDate" required>
                            </div>
                            <div class="form-group full-width">
                                <label for="budgetAlert">Alert Threshold (%)</label>
                                <input type="number" id="budgetAlert" placeholder="80" min="1" max="100" value="80">
                                <small>Get notified when spending reaches this percentage</small>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="financeTracker.closeModal('addBudgetModal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Create Budget
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listener
        document.getElementById('budgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBudgetSubmit();
        });
    }

    handleBudgetSubmit() {
        const budgetData = {
            name: document.getElementById('budgetName').value.trim(),
            amount: document.getElementById('budgetAmount').value,
            category: document.getElementById('budgetCategory').value,
            period: document.getElementById('budgetPeriod').value,
            startDate: document.getElementById('budgetStartDate').value,
            endDate: document.getElementById('budgetEndDate').value,
            alertThreshold: document.getElementById('budgetAlert').value || 80
        };

        if (!budgetData.name || !budgetData.amount || !budgetData.category || !budgetData.startDate || !budgetData.endDate) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (new Date(budgetData.endDate) <= new Date(budgetData.startDate)) {
            this.showNotification('End date must be after start date', 'error');
            return;
        }

        this.createBudget(budgetData);
        this.closeModal('addBudgetModal');
        document.getElementById('budgetForm').reset();
    }

    // Goals Management
    createGoal(goalData) {
        const goal = {
            id: Date.now(),
            name: goalData.name,
            description: goalData.description,
            targetAmount: parseFloat(goalData.targetAmount),
            currentAmount: parseFloat(goalData.currentAmount) || 0,
            targetDate: goalData.targetDate,
            category: goalData.category,
            priority: goalData.priority,
            isActive: true,
            createdAt: new Date().toISOString(),
            milestones: []
        };

        this.goals.push(goal);
        this.saveToStorage('goals', this.goals);
        this.updateGoalsDisplay();
        this.showNotification('Goal created successfully!', 'success');
    }

    updateGoal(id, goalData) {
        const index = this.goals.findIndex(g => g.id === id);
        if (index !== -1) {
            this.goals[index] = { ...this.goals[index], ...goalData };
            this.saveToStorage('goals', this.goals);
            this.updateGoalsDisplay();
            this.showNotification('Goal updated successfully!', 'success');
        }
    }

    deleteGoal(id) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goals = this.goals.filter(g => g.id !== id);
            this.saveToStorage('goals', this.goals);
            this.updateGoalsDisplay();
            this.showNotification('Goal deleted successfully!', 'info');
        }
    }

    addToGoal(id, amount) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.currentAmount += parseFloat(amount);
            if (goal.currentAmount >= goal.targetAmount) {
                goal.isCompleted = true;
                goal.completedAt = new Date().toISOString();
                this.showNotification(`🎉 Congratulations! You've achieved your goal: ${goal.name}!`, 'success');
            }
            this.saveToStorage('goals', this.goals);
            this.updateGoalsDisplay();
        }
    }

    getGoalProgress(goal) {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        const remaining = goal.targetAmount - goal.currentAmount;
        const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

        return {
            percentage: Math.min(percentage, 100),
            remaining: Math.max(remaining, 0),
            daysLeft,
            isCompleted: goal.currentAmount >= goal.targetAmount,
            isOverdue: daysLeft < 0 && !goal.isCompleted,
            dailyTarget: remaining > 0 && daysLeft > 0 ? remaining / daysLeft : 0
        };
    }

    updateGoalsDisplay() {
        const container = document.getElementById('goalsGrid');
        if (!container) return;

        if (this.goals.length === 0) {
            container.innerHTML = `
                <div class="no-goals">
                    <i class="fas fa-trophy"></i>
                    <h3>No goals set</h3>
                    <p>Set financial goals to track your progress</p>
                    <button class="btn-primary" onclick="financeTracker.showAddGoalModal()">
                        Add Goal
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.goals.map(goal => {
            const progress = this.getGoalProgress(goal);
            return `
                <div class="goal-card ${progress.isCompleted ? 'completed' : progress.isOverdue ? 'overdue' : ''}">
                    <div class="goal-header">
                        <div class="goal-info">
                            <h3>${goal.name}</h3>
                            <p class="goal-description">${goal.description}</p>
                        </div>
                        <div class="goal-actions">
                            <button class="btn-icon" onclick="financeTracker.showAddToGoalModal(${goal.id})" title="Add Money">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn-icon" onclick="financeTracker.editGoal(${goal.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon delete" onclick="financeTracker.deleteGoal(${goal.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-info">
                            <span class="current">${this.formatCurrency(goal.currentAmount)}</span>
                            <span class="target">of ${this.formatCurrency(goal.targetAmount)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${progress.isCompleted ? 'completed' : ''}"
                                 style="width: ${progress.percentage}%"></div>
                        </div>
                        <div class="progress-details">
                            <span class="percentage">${progress.percentage.toFixed(1)}%</span>
                            ${!progress.isCompleted ? `
                                <span class="remaining">${this.formatCurrency(progress.remaining)} remaining</span>
                            ` : '<span class="completed-badge">🎉 Completed!</span>'}
                        </div>
                    </div>
                    <div class="goal-timeline">
                        <div class="timeline-item">
                            <i class="fas fa-calendar"></i>
                            <span>Target: ${this.formatDate(goal.targetDate)}</span>
                        </div>
                        ${!progress.isCompleted && progress.daysLeft > 0 ? `
                            <div class="timeline-item">
                                <i class="fas fa-clock"></i>
                                <span>${progress.daysLeft} days left</span>
                            </div>
                            ${progress.dailyTarget > 0 ? `
                                <div class="timeline-item">
                                    <i class="fas fa-target"></i>
                                    <span>${this.formatCurrency(progress.dailyTarget)}/day needed</span>
                                </div>
                            ` : ''}
                        ` : ''}
                        <div class="timeline-item priority-${goal.priority}">
                            <i class="fas fa-flag"></i>
                            <span>${goal.priority} priority</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showAddGoalModal() {
        const modal = document.getElementById('addGoalModal');
        if (!modal) {
            this.createGoalModal();
        }
        document.getElementById('addGoalModal').classList.add('active');
    }

    createGoalModal() {
        const modalHTML = `
            <div id="addGoalModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Create New Goal</h3>
                        <button class="modal-close" onclick="financeTracker.closeModal('addGoalModal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form id="goalForm" class="modal-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="goalName">Goal Name *</label>
                                <input type="text" id="goalName" placeholder="e.g., Emergency Fund" required>
                            </div>
                            <div class="form-group">
                                <label for="goalTarget">Target Amount *</label>
                                <div class="amount-input">
                                    <input type="number" id="goalTarget" placeholder="0" required min="1" step="0.01">
                                    <span class="currency">${this.settings.currency}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="goalCurrent">Current Amount</label>
                                <div class="amount-input">
                                    <input type="number" id="goalCurrent" placeholder="0" min="0" step="0.01">
                                    <span class="currency">${this.settings.currency}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="goalDate">Target Date *</label>
                                <input type="date" id="goalDate" required>
                            </div>
                            <div class="form-group">
                                <label for="goalCategory">Category</label>
                                <select id="goalCategory">
                                    <option value="savings">💰 Savings</option>
                                    <option value="emergency">🚨 Emergency Fund</option>
                                    <option value="vacation">🏖️ Vacation</option>
                                    <option value="house">🏠 House</option>
                                    <option value="car">🚗 Car</option>
                                    <option value="education">📚 Education</option>
                                    <option value="retirement">👴 Retirement</option>
                                    <option value="other">📦 Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="goalPriority">Priority</label>
                                <select id="goalPriority">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div class="form-group full-width">
                                <label for="goalDescription">Description</label>
                                <textarea id="goalDescription" placeholder="Describe your goal..."></textarea>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="financeTracker.closeModal('addGoalModal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-plus"></i> Create Goal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Set minimum date to today
        document.getElementById('goalDate').min = new Date().toISOString().split('T')[0];

        // Add event listener
        document.getElementById('goalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGoalSubmit();
        });
    }

    handleGoalSubmit() {
        const goalData = {
            name: document.getElementById('goalName').value.trim(),
            targetAmount: document.getElementById('goalTarget').value,
            currentAmount: document.getElementById('goalCurrent').value || 0,
            targetDate: document.getElementById('goalDate').value,
            category: document.getElementById('goalCategory').value,
            priority: document.getElementById('goalPriority').value,
            description: document.getElementById('goalDescription').value.trim()
        };

        if (!goalData.name || !goalData.targetAmount || !goalData.targetDate) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (new Date(goalData.targetDate) <= new Date()) {
            this.showNotification('Target date must be in the future', 'error');
            return;
        }

        this.createGoal(goalData);
        this.closeModal('addGoalModal');
        document.getElementById('goalForm').reset();
    }

    // Sample Data and Utility Functions
    addSampleData() {
        const sampleTransactions = [
            {
                id: Date.now() + 1,
                description: 'Monthly Salary',
                amount: 150000,
                type: 'income',
                category: 'Salary',
                date: new Date().toISOString().split('T')[0],
                notes: 'Regular monthly salary payment',
                timestamp: new Date().toISOString()
            },
            {
                id: Date.now() + 2,
                description: 'Freelance Project',
                amount: 75000,
                type: 'income',
                category: 'Freelance',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: 'Web development project',
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: Date.now() + 3,
                description: 'Grocery Shopping',
                amount: 25000,
                type: 'expense',
                category: 'Food',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: 'Weekly groceries at supermarket',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: Date.now() + 4,
                description: 'Bus Transport',
                amount: 8000,
                type: 'expense',
                category: 'Transport',
                date: new Date().toISOString().split('T')[0],
                notes: 'Daily commute',
                timestamp: new Date().toISOString()
            },
            {
                id: Date.now() + 5,
                description: 'Movie Tickets',
                amount: 15000,
                type: 'expense',
                category: 'Entertainment',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: 'Weekend movie with friends',
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: Date.now() + 6,
                description: 'Electricity Bill',
                amount: 18000,
                type: 'expense',
                category: 'Bills',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: 'Monthly electricity payment',
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: Date.now() + 7,
                description: 'New Shirt',
                amount: 12000,
                type: 'expense',
                category: 'Shopping',
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: 'Casual shirt for work',
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: Date.now() + 8,
                description: 'Doctor Visit',
                amount: 20000,
                type: 'expense',
                category: 'Healthcare',
                date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                notes: 'Regular checkup',
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        this.transactions = [...this.transactions, ...sampleTransactions];
        this.saveToStorage('transactions', this.transactions);
        this.updateAllDisplays();
        this.showNotification('Sample data added successfully! 🎉', 'success');
    }

    exportToCSV() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to export!', 'warning');
            return;
        }

        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...this.transactions.map(t => [
                t.date,
                `"${t.description}"`,
                t.category,
                t.type,
                t.amount,
                `"${t.notes || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully! 📥', 'success');
    }

    clearAllData() {
        if (confirm('⚠️ Are you sure you want to delete ALL transactions? This cannot be undone!')) {
            if (confirm('🚨 FINAL WARNING: This will permanently delete all your financial data. Continue?')) {
                this.transactions = [];
                this.saveToStorage('transactions', this.transactions);
                this.updateAllDisplays();
                this.showNotification('All data has been cleared! 🗑️', 'info');
            }
        }
    }

    // Settings Management
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveToStorage('settings', this.settings);
        this.applySettings();
        this.showNotification('Settings updated successfully!', 'success');
    }

    applySettings() {
        // Apply theme
        if (this.settings.theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Update currency display throughout the app
        this.updateAllDisplays();
    }

    updateSettingsDisplay() {
        // Update currency setting
        const currencySelect = document.getElementById('currencySetting');
        if (currencySelect) {
            currencySelect.value = this.settings.currency;
        }

        // Update theme buttons
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === this.settings.theme) {
                btn.classList.add('active');
            }
        });

        // Update other settings
        const itemsPerPageInput = document.getElementById('itemsPerPageSetting');
        if (itemsPerPageInput) {
            itemsPerPageInput.value = this.settings.itemsPerPage;
        }

        const notificationsToggle = document.getElementById('notificationsSetting');
        if (notificationsToggle) {
            notificationsToggle.checked = this.settings.notifications;
        }
    }

    exportAllData() {
        const exportData = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            data: {
                transactions: this.transactions,
                budgets: this.budgets,
                goals: this.goals,
                settings: this.settings,
                categories: this.categories
            },
            summary: {
                totalTransactions: this.transactions.length,
                totalBudgets: this.budgets.length,
                totalGoals: this.goals.length,
                ...this.calculateStats()
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `finance-tracker-complete-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(link.href);
        this.showNotification('Complete data exported successfully!', 'success');
    }

    importAllData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (importedData.data) {
                    const replace = confirm(
                        'This will replace all your current data. Are you sure?\n\n' +
                        'Click OK to REPLACE all data, or Cancel to merge with existing data.'
                    );

                    if (replace) {
                        this.transactions = importedData.data.transactions || [];
                        this.budgets = importedData.data.budgets || [];
                        this.goals = importedData.data.goals || [];
                        this.settings = { ...this.settings, ...importedData.data.settings };
                        this.categories = { ...this.categories, ...importedData.data.categories };
                    } else {
                        // Merge data
                        if (importedData.data.transactions) {
                            const existingIds = new Set(this.transactions.map(t => t.id));
                            const newTransactions = importedData.data.transactions.filter(t => !existingIds.has(t.id));
                            this.transactions = [...this.transactions, ...newTransactions];
                        }

                        if (importedData.data.budgets) {
                            const existingBudgetIds = new Set(this.budgets.map(b => b.id));
                            const newBudgets = importedData.data.budgets.filter(b => !existingBudgetIds.has(b.id));
                            this.budgets = [...this.budgets, ...newBudgets];
                        }

                        if (importedData.data.goals) {
                            const existingGoalIds = new Set(this.goals.map(g => g.id));
                            const newGoals = importedData.data.goals.filter(g => !existingGoalIds.has(g.id));
                            this.goals = [...this.goals, ...newGoals];
                        }
                    }

                    // Save all data
                    this.saveToStorage('transactions', this.transactions);
                    this.saveToStorage('budgets', this.budgets);
                    this.saveToStorage('goals', this.goals);
                    this.saveToStorage('settings', this.settings);
                    this.saveToStorage('categories', this.categories);

                    // Update displays
                    this.updateAllDisplays();
                    this.applySettings();

                    this.showNotification('Data imported successfully!', 'success');
                } else {
                    throw new Error('Invalid file format');
                }

            } catch (error) {
                this.showNotification('Error importing file: ' + error.message, 'error');
            }

            event.target.value = '';
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete ALL data? This includes transactions, budgets, and goals. This action cannot be undone!')) {
            if (confirm('This is your final warning. ALL DATA WILL BE PERMANENTLY DELETED. Continue?')) {
                this.transactions = [];
                this.budgets = [];
                this.goals = [];

                this.saveToStorage('transactions', this.transactions);
                this.saveToStorage('budgets', this.budgets);
                this.saveToStorage('goals', this.goals);

                this.updateAllDisplays();
                this.showNotification('All data has been cleared!', 'info');
            }
        }
    }

    resetToDefaults() {
        if (confirm('Reset all settings to default values?')) {
            this.settings = this.getDefaultSettings();
            this.categories = this.getDefaultCategories();

            this.saveToStorage('settings', this.settings);
            this.saveToStorage('categories', this.categories);

            this.applySettings();
            this.updateSettingsDisplay();
            this.showNotification('Settings reset to defaults!', 'info');
        }
    }

    // Export/Import functionality
    exportTransactions() {
        if (this.transactions.length === 0) {
            this.showNotification('No transactions to export!', 'warning');
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '2.0',
            transactions: this.transactions,
            budgets: this.budgets,
            goals: this.goals,
            settings: this.settings,
            summary: this.calculateStats()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `finance-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(link.href);
        this.showNotification('Data exported successfully!', 'success');
    }

    importTransactions(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                let transactions = [];

                // Handle different import formats
                if (Array.isArray(importedData)) {
                    transactions = importedData;
                } else if (importedData.transactions) {
                    transactions = importedData.transactions;
                    // Also import other data if available
                    if (importedData.budgets) this.budgets = importedData.budgets;
                    if (importedData.goals) this.goals = importedData.goals;
                    if (importedData.settings) this.settings = { ...this.settings, ...importedData.settings };
                }

                // Validate and merge transactions
                const validTransactions = transactions.filter(t =>
                    t.id && t.amount && t.description && t.category && t.type && t.date
                );

                if (validTransactions.length === 0) {
                    throw new Error('No valid transactions found in file');
                }

                const replace = confirm(
                    `Found ${validTransactions.length} valid transactions.\n\n` +
                    'Click OK to REPLACE all current data, or Cancel to MERGE with existing data.'
                );

                if (replace) {
                    this.transactions = validTransactions;
                } else {
                    // Merge, avoiding duplicates
                    const existingIds = new Set(this.transactions.map(t => t.id));
                    const newTransactions = validTransactions.filter(t => !existingIds.has(t.id));
                    this.transactions = [...this.transactions, ...newTransactions];
                }

                // Save all data
                this.saveToStorage('transactions', this.transactions);
                this.saveToStorage('budgets', this.budgets);
                this.saveToStorage('goals', this.goals);
                this.saveToStorage('settings', this.settings);

                this.updateAllDisplays();
                this.showNotification(`Successfully imported ${validTransactions.length} transactions!`, 'success');

            } catch (error) {
                this.showNotification('Error importing file: ' + error.message, 'error');
            }

            // Reset file input
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    // Storage methods
    saveToStorage(key, data) {
        localStorage.setItem(`financeTrackerPro_${key}`, JSON.stringify(data));
    }

    loadFromStorage(key) {
        const stored = localStorage.getItem(`financeTrackerPro_${key}`);
        return stored ? JSON.parse(stored) : null;
    }

    // Utility methods
    formatCurrency(amount) {
        return `${amount.toLocaleString()} ${this.settings.currency}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) {
            // Fallback to simple alert if container not found
            alert(message);
            return;
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' :
                                  type === 'error' ? 'exclamation-circle' :
                                  type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions for HTML onclick events
function showSection(sectionName) {
    window.financeTracker?.showSection(sectionName);
}

function showAddTransactionModal() {
    window.financeTracker?.showAddTransactionModal();
}

function showAddBudgetModal() {
    window.financeTracker?.showAddBudgetModal();
}

function showAddGoalModal() {
    window.financeTracker?.showAddGoalModal();
}

function closeModal(modalId) {
    window.financeTracker?.closeModal(modalId);
}

// Additional global functions for new features
function editBudget(id) {
    window.financeTracker?.editBudget(id);
}

function deleteBudget(id) {
    window.financeTracker?.deleteBudget(id);
}

function editGoal(id) {
    window.financeTracker?.editGoal(id);
}

function deleteGoal(id) {
    window.financeTracker?.deleteGoal(id);
}

function addToGoal(id) {
    window.financeTracker?.showAddToGoalModal(id);
}

function exportData() {
    window.financeTracker?.exportAllData();
}

function importData(event) {
    window.financeTracker?.importAllData(event);
}

function clearAllData() {
    window.financeTracker?.clearAllData();
}

function resetSettings() {
    window.financeTracker?.resetToDefaults();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Finance Tracker Pro...');
        window.financeTracker = new FinanceTrackerPro();
        console.log('Finance Tracker Pro initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize FinanceTrackerPro:', error);

        // Show error message
        alert('There was an error loading the advanced interface. Please refresh the page or try the test version (test.html).');
    }
});


}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Initialize the app
    window.budgetApp = new BudgetApp();
});


