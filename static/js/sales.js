document.addEventListener("DOMContentLoaded", () => {

    const SALES_KEY =
        "smartbill_sales";


    const searchInput =
        document.getElementById("salesSearch");


    const dateInput =
        document.getElementById("salesDate");


    const clearButton =
        document.getElementById(
            "clearSalesFilters"
        );


    const tableBody =
        document.getElementById(
            "salesTableBody"
        );


    const emptyState =
        document.getElementById(
            "salesEmptyState"
        );


    const billCount =
        document.getElementById(
            "salesBillCount"
        );


    const totalAmount =
        document.getElementById(
            "salesTotalAmount"
        );


    function getSales() {

        const savedSales =
            localStorage.getItem(
                SALES_KEY
            );


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
                "Unable to read sales history:",
                error
            );

            return [];
        }
    }


    function formatCurrency(value) {

        return `₹${Number(value || 0).toFixed(2)}`;

    }


    function formatDate(value) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {
            return "-";
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    function escapeHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function getItemCount(sale) {

        if (!Array.isArray(sale.items)) {
            return 0;
        }


        return sale.items.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

    }


    function renderSales() {

        const sales =
            getSales();


        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();


        const selectedDate =
            dateInput.value;


        const filteredSales =
            sales.filter(sale => {

                const invoiceNumber =
                    String(
                        sale.invoiceNumber || ""
                    ).toLowerCase();


                const customerName =
                    String(
                        sale.customerName || ""
                    ).toLowerCase();


                const matchesSearch =
                    !searchTerm ||
                    invoiceNumber.includes(searchTerm) ||
                    customerName.includes(searchTerm);


                let matchesDate = true;


                if (selectedDate) {

                    const saleDate =
                        new Date(sale.date);


                    if (
                        Number.isNaN(
                            saleDate.getTime()
                        )
                    ) {

                        matchesDate = false;

                    } else {

                        const year =
                            saleDate.getFullYear();


                        const month =
                            String(
                                saleDate.getMonth() + 1
                            ).padStart(2, "0");


                        const day =
                            String(
                                saleDate.getDate()
                            ).padStart(2, "0");


                        const saleDateString =
                            `${year}-${month}-${day}`;


                        matchesDate =
                            saleDateString ===
                            selectedDate;
                    }
                }


                return (
                    matchesSearch &&
                    matchesDate
                );

            });


        renderTable(
            filteredSales
        );


        updateSummary(
            filteredSales
        );

    }


    function renderTable(sales) {

        tableBody.innerHTML = "";


        if (sales.length === 0) {

            emptyState.hidden = false;

            return;
        }


        emptyState.hidden = true;


        sales.forEach(sale => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHtml(
                            sale.invoiceNumber || "-"
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHtml(
                        sale.customerName || "User"
                    )}
                </td>


                <td>
                    ${formatDate(
                        sale.date
                    )}
                </td>


                <td>
                    ${getItemCount(sale)}
                </td>


                <td>
                    <strong>
                        ${formatCurrency(
                            sale.total
                        )}
                    </strong>
                </td>


                <td>

                    <button
                        type="button"
                        class="button small-button view-invoice-button"
                        data-invoice-id="${escapeHtml(
                            sale.id || sale.invoiceNumber
                        )}"
                    >
                        View Invoice
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


        attachInvoiceButtons();

    }


    function attachInvoiceButtons() {

        const buttons =
            document.querySelectorAll(
                ".view-invoice-button"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const invoiceId =
                        button.dataset.invoiceId;


                    openInvoice(
                        invoiceId
                    );

                }
            );

        });

    }


    function openInvoice(invoiceId) {

        const sales =
            getSales();


        const sale =
            sales.find(
                item =>
                    String(
                        item.id ||
                        item.invoiceNumber
                    ) === String(invoiceId)
            );


        if (!sale) {

            alert(
                "Invoice could not be found."
            );

            return;
        }


        localStorage.setItem(
            "smartbill_current_bill",
            JSON.stringify(sale)
        );


        window.location.href =
            "/invoice";

    }


    function updateSummary(sales) {

        billCount.textContent =
            sales.length;


        const total =
            sales.reduce(
                (sum, sale) =>
                    sum +
                    Number(sale.total || 0),
                0
            );


        totalAmount.textContent =
            formatCurrency(total);

    }


    searchInput.addEventListener(
        "input",
        renderSales
    );


    dateInput.addEventListener(
        "change",
        renderSales
    );


    clearButton.addEventListener(
        "click",
        () => {

            searchInput.value = "";
            dateInput.value = "";

            renderSales();

        }
    );


    renderSales();

});