document.addEventListener("DOMContentLoaded", () => {

    const CURRENT_BILL_KEY =
        "smartbill_current_bill";


    const savedBill =
        localStorage.getItem(
            CURRENT_BILL_KEY
        );


    if (!savedBill) {

        document.getElementById(
            "customerName"
        ).textContent = "No invoice available.";

        return;

    }


    let bill;


    try {

        bill =
            JSON.parse(savedBill);

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
        bill.invoiceNumber;


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


    bill.items.forEach(
        (item, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHtml(item.name)}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${item.unit}
                </td>

                <td>
                    ₹${Number(item.price).toFixed(2)}
                </td>

                <td>
                    ₹${Number(item.subtotal).toFixed(2)}
                </td>

            `;


            itemsContainer.appendChild(row);

        }
    );


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

        return `₹${Number(value).toFixed(2)}`;

    }


    function formatDate(value) {

        const date =
            new Date(value);


        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
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