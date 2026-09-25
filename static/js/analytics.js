document.addEventListener("DOMContentLoaded", () => {

    const SALES_KEY = "smartbill_sales";
    const PRODUCTS_KEY = "smartbill_products";

    let salesChart = null;


    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    function getSales() {

        const saved =
            localStorage.getItem(SALES_KEY);

        if (!saved) {
            return [];
        }

        try {

            const data = JSON.parse(saved);

            return Array.isArray(data)
                ? data
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

        const saved =
            localStorage.getItem(PRODUCTS_KEY);

        if (!saved) {
            return [];
        }

        try {

            const data = JSON.parse(saved);

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                "Unable to read products:",
                error
            );

            return [];
        }
    }


    /* =====================================================
       UTILITIES
    ===================================================== */

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


    /* =====================================================
       SUMMARY
    ===================================================== */

    function calculateSummary() {

        const sales = getSales();

        const totalSales =
            sales.reduce(
                (sum, sale) =>
                    sum +
                    Number(sale.total || 0),
                0
            );

        const totalBills =
            sales.length;

        const averageBill =
            totalBills > 0
                ? totalSales / totalBills
                : 0;

        return {
            totalSales,
            totalBills,
            averageBill
        };

    }


    function renderSummary() {

        const summary =
            calculateSummary();

        document.getElementById(
            "analyticsTotalSales"
        ).textContent =
            formatCurrency(
                summary.totalSales
            );

        document.getElementById(
            "analyticsTotalBills"
        ).textContent =
            summary.totalBills;

        document.getElementById(
            "analyticsAverageBill"
        ).textContent =
            formatCurrency(
                summary.averageBill
            );


        document.getElementById(
            "snapshotRevenue"
        ).textContent =
            formatCurrency(
                summary.totalSales
            );

        document.getElementById(
            "snapshotBills"
        ).textContent =
            summary.totalBills;

        document.getElementById(
            "snapshotAverage"
        ).textContent =
            formatCurrency(
                summary.averageBill
            );

    }


    /* =====================================================
       SALES TREND
    ===================================================== */

    function getLastSevenDays() {

        const days = [];

        for (let i = 6; i >= 0; i--) {

            const date = new Date();

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

        const sales = getSales();

        const days =
            getLastSevenDays();

        return days.map(day => {

            const dayKey =
                getDateKey(day);

            const total =
                sales.reduce(
                    (sum, sale) => {

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
                                    sale.total || 0
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

        });

    }


    function renderSalesChart() {

        const canvas =
            document.getElementById(
                "analyticsSalesChart"
            );

        if (!canvas) {
            return;
        }

        const trend =
            calculateSalesTrend();

        if (salesChart) {
            salesChart.destroy();
        }

        salesChart =
            new Chart(
                canvas.getContext("2d"),
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

                                borderColor:
                                    "#2580eb",

                                backgroundColor:
                                    "rgba(37, 128, 235, 0.16)",

                                borderWidth:
                                    2.5,

                                pointRadius:
                                    4,

                                pointHoverRadius:
                                    6,

                                pointBackgroundColor:
                                    "#2580eb",

                                pointBorderColor:
                                    "#ffffff",

                                pointBorderWidth:
                                    2,

                                tension:
                                    0.4,

                                fill:
                                    true
                            }

                        ]

                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        interaction: {

                            intersect:
                                false,

                            mode:
                                "index"

                        },

                        plugins: {

                            legend: {
                                display:
                                    false
                            },

                            tooltip: {

                                backgroundColor:
                                    "#0f172a",

                                padding:
                                    12,

                                displayColors:
                                    false,

                                callbacks: {

                                    label:
                                        context =>
                                            ` ₹${Number(
                                                context.parsed.y
                                            ).toFixed(2)}`

                                }

                            }

                        },

                        scales: {

                            x: {

                                grid: {
                                    display:
                                        false
                                },

                                border: {
                                    display:
                                        false
                                },

                                ticks: {

                                    color:
                                        "#64748b",

                                    font: {
                                        size: 10
                                    }

                                }

                            },

                            y: {

                                beginAtZero:
                                    true,

                                border: {
                                    display:
                                        false
                                },

                                grid: {

                                    color:
                                        "rgba(148, 163, 184, 0.18)"

                                },

                                ticks: {

                                    color:
                                        "#64748b",

                                    font: {
                                        size: 10
                                    },

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


    /* =====================================================
       TOP PRODUCTS
    ===================================================== */

    function calculateTopProducts() {

        const sales = getSales();

        const productMap =
            new Map();

        let totalQuantity = 0;


        sales.forEach(sale => {

            if (
                !Array.isArray(
                    sale.items
                )
            ) {
                return;
            }

            sale.items.forEach(item => {

                const name =
                    item.name ||
                    "Unknown Item";

                const quantity =
                    Number(
                        item.quantity || 0
                    );

                if (quantity <= 0) {
                    return;
                }

                const current =
                    productMap.get(name) ||
                    0;

                productMap.set(
                    name,
                    current + quantity
                );

                totalQuantity += quantity;

            });

        });


        return {

            products:
                Array.from(
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
                    .slice(0, 5),

            totalQuantity

        };

    }


    function renderTopProducts() {

        const container =
            document.getElementById(
                "analyticsTopProducts"
            );

        const result =
            calculateTopProducts();

        const products =
            result.products;

        const totalQuantity =
            result.totalQuantity;


        if (products.length === 0) {

            container.innerHTML = `

                <div class="analytics-empty">

                    <strong>
                        No sales data yet
                    </strong>

                    <p>
                        Top products will appear
                        after bills are generated.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            products.map(
                (product, index) => {

                    const percentage =
                        totalQuantity > 0
                            ? (
                                product.quantity /
                                totalQuantity
                            ) * 100
                            : 0;


                    return `

                        <div class="analytics-product-row">

                            <div class="product-rank rank-${index + 1}">
                                ${index + 1}
                            </div>


                            <div class="product-name">
                                ${escapeHtml(
                                    product.name
                                )}
                            </div>


                            <div class="product-progress">

                                <div
                                    class="product-progress-fill"
                                    style="width:${Math.min(
                                        percentage,
                                        100
                                    )}%"
                                ></div>

                            </div>


                            <div class="product-quantity">
                                ${product.quantity}
                                sold
                            </div>


                            <div class="product-percentage">
                                ${percentage.toFixed(0)}%
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    }


    /* =====================================================
       CATEGORY SALES
    ===================================================== */

    function calculateCategorySales() {

        const sales =
            getSales();

        const products =
            getProducts();

        const productCategories =
            new Map();


        products.forEach(product => {

            const name =
                String(
                    product.name || ""
                )
                .trim()
                .toLowerCase();

            if (!name) {
                return;
            }

            productCategories.set(
                name,
                product.category ||
                "Uncategorized"
            );

        });


        const categoryMap =
            new Map();


        sales.forEach(sale => {

            if (
                !Array.isArray(
                    sale.items
                )
            ) {
                return;
            }


            sale.items.forEach(item => {

                const name =
                    String(
                        item.name || ""
                    )
                    .trim()
                    .toLowerCase();


                const category =
                    productCategories.get(
                        name
                    );


                if (!category) {
                    return;
                }


                const amount =
                    Number(
                        item.subtotal ??
                        (
                            Number(
                                item.price || 0
                            ) *
                            Number(
                                item.quantity || 0
                            )
                        )
                    );


                const current =
                    categoryMap.get(
                        category
                    ) || 0;


                categoryMap.set(
                    category,
                    current + amount
                );

            });

        });


        return Array.from(
            categoryMap.entries()
        )
            .map(
                ([category, amount]) => ({
                    category,
                    amount
                })
            )
            .sort(
                (a, b) =>
                    b.amount -
                    a.amount
            );

    }


    function renderCategorySales() {

        const container =
            document.getElementById(
                "analyticsCategorySales"
            );

        const categories =
            calculateCategorySales();


        if (categories.length === 0) {

            container.innerHTML = `

                <div class="analytics-empty">

                    <strong>
                        Category data unavailable
                    </strong>

                    <p>
                        Category-wise sales will appear
                        when products are linked to categories.
                    </p>

                </div>

            `;

            return;
        }


        const total =
            categories.reduce(
                (sum, item) =>
                    sum + item.amount,
                0
            );


        container.innerHTML =
            categories
                .map(
                    (item, index) => {

                        const percentage =
                            total > 0
                                ? (
                                    item.amount /
                                    total
                                ) * 100
                                : 0;


                        const colors = [
                            "orange",
                            "green",
                            "blue",
                            "purple"
                        ];


                        const iconColor =
                            colors[
                                index %
                                colors.length
                            ];


                        return `

                            <div class="category-sales-row">

                                <div class="category-icon ${iconColor}">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path d="M4 7h16"></path>
                                        <path d="M6 7v11"></path>
                                        <path d="M18 7v11"></path>
                                        <path d="M4 18h16"></path>
                                        <path d="M8 11h8"></path>
                                    </svg>

                                </div>


                                <div class="category-content">

                                    <div class="category-header">

                                        <strong>
                                            ${escapeHtml(
                                                item.category
                                            )}
                                        </strong>

                                        <strong>
                                            ${formatCurrency(
                                                item.amount
                                            )}
                                        </strong>

                                    </div>


                                    <div class="category-progress">

                                        <div
                                            class="category-progress-fill ${iconColor}"
                                            style="width:${percentage}%"
                                        ></div>

                                    </div>


                                    <span>
                                        ${percentage.toFixed(1)}%
                                        of categorized sales
                                    </span>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function renderAnalytics() {

        renderSummary();

        renderSalesChart();

        renderTopProducts();

        renderCategorySales();

    }


    renderAnalytics();

});