document.addEventListener("DOMContentLoaded", () => {

    const CURRENT_BILL_KEY =
        "smartbill_current_bill";


    const savedBill =
        localStorage.getItem(CURRENT_BILL_KEY);


    if (!savedBill) {

        document.getElementById(
            "customerName"
        ).textContent = "No invoice available.";

        return;
    }


    let bill;


    try {

        bill = JSON.parse(savedBill);

    } catch (error) {

        console.error(
            "Invalid invoice data:",
            error
        );

        return;
    }


    document.getElementById(
        "invoiceNumber"
    ).textContent =
        bill.invoiceNumber || "-";


    document.getElementById(
        "customerName"
    ).textContent =
        bill.customerName || "User";


    document.getElementById(
        "invoiceDate"
    ).textContent =
        formatDate(bill.date);


    const itemsContainer =
        document.getElementById(
            "invoiceItems"
        );


    itemsContainer.innerHTML = "";


    if (!Array.isArray(bill.items)) {
        return;
    }


    bill.items.forEach(item => {

        const row =
            document.createElement("div");

        row.className =
            "receipt-item";


        const subtotal =
            Number(item.price) *
            Number(item.quantity);


        row.innerHTML = `

            <span class="item-name">
                ${escapeHtml(item.name)}

                <small class="item-unit">
                    ${escapeHtml(item.unit)}
                </small>
            </span>

            <span>
                ${item.quantity}
            </span>

            <span>
                ₹${Number(item.price).toFixed(2)}
            </span>

            <span>
                ₹${subtotal.toFixed(2)}
            </span>

        `;


        itemsContainer.appendChild(row);

    });


    document.getElementById(
        "invoiceSubtotal"
    ).textContent =
        formatCurrency(bill.subtotal);


    document.getElementById(
        "invoiceDiscount"
    ).textContent =
        formatCurrency(bill.discount);


    document.getElementById(
        "invoiceTotal"
    ).textContent =
        formatCurrency(bill.total);


    function formatCurrency(value) {

        return `₹${Number(value || 0).toFixed(2)}`;

    }


    function formatDate(value) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


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

});