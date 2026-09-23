document.addEventListener("DOMContentLoaded", () => {

    const SALES_KEY =
        "smartbill_sales";

    const PRODUCTS_KEY =
        "smartbill_products";


    let salesChart = null;


    /*
     * -----------------------------------------------
     * Local Storage Helpers
     * -----------------------------------------------
     */

    function getSales() {

        const savedSales =
            localStorage.getItem(SALES_KEY);


        if (!savedSales) {
            return [];
        }


        try {

            const sales =
                JSON.parse(savedSales);


            return Array.isArray(sales)
                ? sales
                : [];

        } catch (error) {

            console.error(
                "Unable to read sales:",
                error
            );

            return [];
        }
    }


    function getProducts() {

        const savedProducts =
            localStorage.getItem(PRODUCTS_KEY);


        if (!savedProducts) {
            return [];
        }


        try {

            const products =
                JSON.parse(savedProducts);


            return Array.isArray(products)
                ? products
                : [];

        } catch (error) {

            console.error(
                "Unable to read products:",
                error
            );

            return [];
        }
    }


    /*
     * -----------------------------------------------
     * Utility Functions
     * -----------------------------------------------
     */

    function formatCurrency(value) {

        return `₹${Number(value || 0).toFixed(2)}`;

    }


    function escapeHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function getDateKey(date) {

        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    }


    function formatShortDate(date) {

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short"
            }
        );

    }


    function isToday(date) {

        const today =
            new Date();


        return (
            getDateKey(date) ===
            getDateKey(today)
        );

    }


    /*
     * -----------------------------------------------
     * Summary Metrics
     * -----------------------------------------------
     */

    function updateSummaryMetrics() {

        const sales =
            getSales();


        const products =
            getProducts();


        const todaySales =
            sales.reduce(
                (total, sale) => {

                    if (!sale.date) {
                        return total;
                    }


                    const saleDate =
                        new Date(sale.date);


                    if (isToday(saleDate)) {

                        return (
                            total +
                            Number(
                                sale.total || 0
                            )
                        );

                    }


                    return total;

                },
                0
            );


        const lowStockCount =
            products.filter(
                isLowStock
            ).length;


        document.getElementById(
            "todaySales"
        ).textContent =
            formatCurrency(todaySales);


        document.getElementById(
            "totalBills"
        ).textContent =
            sales.length;


        document.getElementById(
            "totalProducts"
        ).textContent =
            products.length;


        document.getElementById(
            "lowStockItems"
        ).textContent =
            lowStockCount;

    }


    /*
     * -----------------------------------------------
     * Stock Status
     * -----------------------------------------------
     *
     * >= 40%  → Normal
     * < 40%   → Warning
     * < 30%   → High Alert
     */

    function isLowStock(product) {

        const currentStock =
            Number(
                product.stock ?? 0
            );


        const originalStock =
            Number(
                product.originalStock ??
                product.initialStock ??
                product.stock ??
                0
            );


        if (originalStock <= 0) {
            return false;
        }


        const stockPercentage =
            (
                currentStock /
                originalStock
            ) * 100;


        return stockPercentage < 40;

    }


    function getStockStatus(product) {

        const currentStock =
            Number(
                product.stock ?? 0
            );


        const originalStock =
            Number(
                product.originalStock ??
                product.initialStock ??
                product.stock ??
                0
            );


        if (originalStock <= 0) {

            return {
                label: "Normal",
                className: "normal"
            };

        }


        const percentage =
            (
                currentStock /
                originalStock
            ) * 100;


        if (percentage < 30) {

            return {
                label: "High Alert",
                className: "danger"
            };

        }


        if (percentage < 40) {

            return {
                label: "Warning",
                className: "warning"
            };

        }


        return {
            label: "Normal",
            className: "normal"
        };

    }


    /*
     * -----------------------------------------------
     * Sales Trend
     * -----------------------------------------------
     */

    function getLastSevenDays() {

        const days = [];


        for (
            let i = 6;
            i >= 0;
            i--
        ) {

            const date =
                new Date();


            date.setHours(
                0,
                0,
                0,
                0
            );


            date.setDate(
                date.getDate() - i
            );


            days.push(date);

        }


        return days;

    }


    function calculateSalesTrend() {

        const sales =
            getSales();


        const days =
            getLastSevenDays();


        return days.map(
            day => {

                const dayKey =
                    getDateKey(day);


                const total =
                    sales.reduce(
                        (
                            sum,
                            sale
                        ) => {

                            if (!sale.date) {
                                return sum;
                            }


                            const saleDate =
                                new Date(
                                    sale.date
                                );


                            if (
                                getDateKey(
                                    saleDate
                                ) === dayKey
                            ) {

                                return (
                                    sum +
                                    Number(
                                        sale.total ||
                                        0
                                    )
                                );

                            }


                            return sum;

                        },
                        0
                    );


                return {
                    label:
                        formatShortDate(day),

                    value:
                        total
                };

            }
        );

    }


    function renderSalesChart() {

        const canvas =
            document.getElementById(
                "salesTrendChart"
            );


        if (!canvas) {
            return;
        }


        const trend =
            calculateSalesTrend();


        const context =
            canvas.getContext("2d");


        if (salesChart) {

            salesChart.destroy();

        }


        salesChart =
            new Chart(
                context,
                {
                    type: "line",

                    data: {

                        labels:
                            trend.map(
                                item =>
                                    item.label
                            ),

                        datasets: [
                            {
                                label:
                                    "Sales",

                                data:
                                    trend.map(
                                        item =>
                                            item.value
                                    ),

                                borderWidth: 2,

                                tension: 0.35,

                                fill: true

                            }
                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio:
                            false,

                        plugins: {

                            legend: {
                                display: false
                            }

                        },

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    callback:
                                        value =>
                                            `₹${value}`

                                }

                            }

                        }

                    }

                }
            );

    }


    /*
     * -----------------------------------------------
     * Top Selling Products
     * -----------------------------------------------
     */

    function calculateTopProducts() {

        const sales =
            getSales();


        const productMap =
            new Map();


        sales.forEach(
            sale => {

                if (
                    !Array.isArray(
                        sale.items
                    )
                ) {
                    return;
                }


                sale.items.forEach(
                    item => {

                        const name =
                            item.name ||
                            "Unknown Item";


                        const quantity =
                            Number(
                                item.quantity ||
                                0
                            );


                        if (
                            productMap.has(name)
                        ) {

                            productMap.set(
                                name,
                                productMap.get(name) +
                                quantity
                            );

                        } else {

                            productMap.set(
                                name,
                                quantity
                            );

                        }

                    }
                );

            }
        );


        return Array.from(
            productMap.entries()
        )
            .map(
                ([name, quantity]) => ({
                    name,
                    quantity
                })
            )
            .sort(
                (a, b) =>
                    b.quantity -
                    a.quantity
            )
            .slice(0, 5);

    }


    function renderTopProducts() {

        const container =
            document.getElementById(
                "topProductsList"
            );


        const products =
            calculateTopProducts();


        if (products.length === 0) {

            container.innerHTML = `

                <div class="dashboard-empty">
                    No sales data available yet.
                </div>

            `;

            return;
        }


        container.innerHTML =
            products
                .map(
                    (
                        product,
                        index
                    ) => `

                    <div class="top-product-row">

                        <div class="product-rank">
                            ${index + 1}
                        </div>

                        <div class="top-product-info">

                            <strong>
                                ${escapeHtml(
                                    product.name
                                )}
                            </strong>

                            <span>
                                ${product.quantity}
                                units sold
                            </span>

                        </div>

                    </div>

                `
                )
                .join("");

    }


    /*
     * -----------------------------------------------
     * Recent Transactions
     * -----------------------------------------------
     */

    function renderRecentTransactions() {

        const container =
            document.getElementById(
                "recentTransactions"
            );


        const sales =
            getSales()
                .slice(0, 5);


        if (sales.length === 0) {

            container.innerHTML = `

                <div class="dashboard-empty">
                    No transactions yet.
                </div>

            `;

            return;
        }


        container.innerHTML =
            sales
                .map(
                    sale => `

                    <div class="transaction-row">

                        <div>

                            <strong>
                                ${escapeHtml(
                                    sale.invoiceNumber ||
                                    "-"
                                )}
                            </strong>

                            <span>
                                ${escapeHtml(
                                    sale.customerName ||
                                    "User"
                                )}
                            </span>

                        </div>


                        <div class="transaction-right">

                            <strong>
                                ${formatCurrency(
                                    sale.total
                                )}
                            </strong>

                            <span>
                                ${formatTransactionDate(
                                    sale.date
                                )}
                            </span>

                        </div>

                    </div>

                `
                )
                .join("");

    }


    function formatTransactionDate(
        value
    ) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short"
            }
        );

    }


    /*
     * -----------------------------------------------
     * Smart Insights
     * -----------------------------------------------
     *
     * These are rule-based.
     * They are NOT AI/ML.
     */

    function renderSmartInsights() {

        const container =
            document.getElementById(
                "smartInsights"
            );


        const sales =
            getSales();


        const products =
            getProducts();


        const insights = [];


        /*
         * Low Stock
         */

        const lowStockProducts =
            products.filter(
                isLowStock
            );


        lowStockProducts
            .slice(0, 3)
            .forEach(
                product => {

                    const status =
                        getStockStatus(
                            product
                        );


                    insights.push({
                        type:
                            status.className,

                        title:
                            status.label ===
                            "High Alert"
                                ? "Stock Alert"
                                : "Low Stock",

                        message:
                            `${product.name} is running low on stock.`
                    });

                }
            );


        /*
         * Top Product
         */

        const topProducts =
            calculateTopProducts();


        if (
            topProducts.length > 0
        ) {

            insights.push({

                type:
                    "success",

                title:
                    "Top Product",

                message:
                    `${topProducts[0].name} is currently the most sold product.`

            });

        }


        /*
         * No sales
         */

        if (
            sales.length === 0
        ) {

            insights.push({

                type:
                    "info",

                title:
                    "Getting Started",

                message:
                    "Create your first bill to start seeing sales insights."

            });

        }


        /*
         * Render
         */

        if (
            insights.length === 0
        ) {

            container.innerHTML = `

                <div class="dashboard-empty">
                    No insights available yet.
                </div>

            `;

            return;
        }


        container.innerHTML =
            insights
                .slice(0, 5)
                .map(
                    insight => `

                    <div class="insight-item ${insight.type}">

                        <div class="insight-indicator"></div>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    insight.title
                                )}
                            </strong>

                            <p>
                                ${escapeHtml(
                                    insight.message
                                )}
                            </p>

                        </div>

                    </div>

                `
                )
                .join("");

    }


    /*
     * -----------------------------------------------
     * Initial Render
     * -----------------------------------------------
     */

    function renderDashboard() {

        updateSummaryMetrics();

        renderSalesChart();

        renderTopProducts();

        renderRecentTransactions();

        renderSmartInsights();

    }


    renderDashboard();

});