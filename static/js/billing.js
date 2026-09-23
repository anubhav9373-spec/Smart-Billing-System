document.addEventListener("DOMContentLoaded", () => {

    const PRODUCTS_KEY = "smartbill_products";
    const CURRENT_BILL_KEY = "smartbill_current_bill";

    const productSearch =
        document.getElementById("productSearch");

    const productSuggestions =
        document.getElementById("productSuggestions");

    const selectedProductBox =
        document.getElementById("selectedProduct");

    const availableStock =
        document.getElementById("availableStock");

    const productQuantity =
        document.getElementById("productQuantity");

    const addToCartBtn =
        document.getElementById("addToCartBtn");

    const cartTable =
        document.getElementById("cartTable");

    const emptyCart =
        document.getElementById("emptyCart");

    const cartStatus =
        document.getElementById("cartStatus");

    const subtotalElement =
        document.getElementById("subtotal");

    const discountInput =
        document.getElementById("discount");

    const finalTotalElement =
        document.getElementById("finalTotal");

    const billCustomerName =
        document.getElementById("billCustomerName");

    const extraItemName =
        document.getElementById("extraItemName");

    const extraItemPrice =
        document.getElementById("extraItemPrice");

    const extraItemQuantity =
        document.getElementById("extraItemQuantity");

    const billingToast =
        document.getElementById("billingToast");


    let products = loadProducts();

    let selectedProduct = null;

    let cart = [];

    let invoiceNumber =
        generateInvoiceNumber();


    document.getElementById("invoiceNumber").textContent =
        `Invoice: ${invoiceNumber}`;


    // ----------------------------------
    // Product storage
    // ----------------------------------

    function loadProducts() {

        const saved =
            localStorage.getItem(PRODUCTS_KEY);

        if (!saved) {
            return [];
        }

        try {
            return JSON.parse(saved);
        } catch (error) {

            console.error(
                "Unable to load products:",
                error
            );

            return [];
        }
    }


    // ----------------------------------
    // Invoice number
    // ----------------------------------

    function generateInvoiceNumber() {

        const now = new Date();

        const date =
            now.getFullYear().toString() +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0");

        const random =
            Math.floor(
                100 + Math.random() * 900
            );

        return `INV-${date}-${random}`;
    }


    // ----------------------------------
    // Currency
    // ----------------------------------

    function formatCurrency(value) {

        return `₹${Number(value).toFixed(2)}`;

    }


    // ----------------------------------
    // Product search
    // ----------------------------------

    productSearch.addEventListener(
        "input",
        () => {

            const query =
                productSearch.value
                    .trim()
                    .toLowerCase();


            selectedProduct = null;

            selectedProductBox.textContent =
                "No product selected";

            availableStock.textContent =
                "-";


            if (!query) {

                productSuggestions.classList.add(
                    "hidden"
                );

                return;
            }


            const matches =
                products.filter(product =>
                    product.name
                        .toLowerCase()
                        .includes(query)
                );


            renderSuggestions(matches);

        }
    );


    function renderSuggestions(matches) {

        productSuggestions.innerHTML = "";


        if (matches.length === 0) {

            productSuggestions.innerHTML = `
                <div class="suggestion-empty">
                    No matching product found.
                </div>
            `;

            productSuggestions.classList.remove(
                "hidden"
            );

            return;
        }


        matches.forEach(product => {

            const item =
                document.createElement("button");

            item.type = "button";

            item.className =
                "product-suggestion";


            item.innerHTML = `
                <strong>
                    ${escapeHtml(product.name)}
                </strong>

                <span>
                    ${product.unit}
                    ·
                    ${formatCurrency(product.price)}
                    ·
                    Stock: ${product.stock}
                </span>
            `;


            item.addEventListener(
                "click",
                () => selectProduct(product)
            );


            productSuggestions.appendChild(item);

        });


        productSuggestions.classList.remove(
            "hidden"
        );

    }


    // ----------------------------------
    // Select product
    // ----------------------------------

    function selectProduct(product) {

        selectedProduct = product;

        productSearch.value =
            product.name;


        selectedProductBox.innerHTML = `
            <strong>
                ${escapeHtml(product.name)}
            </strong>

            <span>
                ${product.unit}
                ·
                ${formatCurrency(product.price)}
            </span>
        `;


        availableStock.textContent =
            `${product.stock} ${product.unit}`;


        productSuggestions.classList.add(
            "hidden"
        );


        productQuantity.value = "1";

    }


    // ----------------------------------
    // Add product to cart
    // ----------------------------------

    addToCartBtn.addEventListener(
        "click",
        addProductToCart
    );


    function addProductToCart() {

        if (!selectedProduct) {

            showToast(
                "Please select a product first.",
                true
            );

            return;
        }


        const quantity =
            Number(productQuantity.value);


        if (!Number.isFinite(quantity) ||
            quantity <= 0) {

            showToast(
                "Enter a valid quantity.",
                true
            );

            return;
        }


        const existingCartItem =
            cart.find(
                item =>
                    item.type === "product" &&
                    item.productId === selectedProduct.id
            );


        const alreadyInCart =
            existingCartItem
                ? existingCartItem.quantity
                : 0;


        if (
            alreadyInCart + quantity >
            Number(selectedProduct.stock)
        ) {

            showToast(
                `Only ${selectedProduct.stock} ${selectedProduct.unit} available.`,
                true
            );

            return;
        }


        if (existingCartItem) {

            existingCartItem.quantity += quantity;

        } else {

            cart.push({

                id: `product-${selectedProduct.id}`,

                type: "product",

                productId:
                    selectedProduct.id,

                name:
                    selectedProduct.name,

                unit:
                    selectedProduct.unit,

                price:
                    Number(selectedProduct.price),

                quantity

            });

        }


        renderCart();

        showToast(
            `${selectedProduct.name} added to cart.`
        );


        productQuantity.value = "1";

    }


    // ----------------------------------
    // Extra item
    // ----------------------------------

    document
        .getElementById("addExtraItemBtn")
        .addEventListener(
            "click",
            addExtraItem
        );


    function addExtraItem() {

        const name =
            extraItemName.value.trim();

        const price =
            Number(extraItemPrice.value);

        const quantity =
            Number(extraItemQuantity.value);


        if (!name) {

            showToast(
                "Enter extra item name.",
                true
            );

            return;
        }


        if (!Number.isFinite(price) ||
            price < 0) {

            showToast(
                "Enter a valid extra item price.",
                true
            );

            return;
        }


        if (!Number.isFinite(quantity) ||
            quantity <= 0) {

            showToast(
                "Enter a valid extra item quantity.",
                true
            );

            return;
        }


        cart.push({

            id:
                `extra-${Date.now()}`,

            type:
                "extra",

            productId:
                null,

            name,

            unit:
                "pcs",

            price,

            quantity

        });


        renderCart();


        extraItemName.value = "";
        extraItemPrice.value = "";
        extraItemQuantity.value = "1";


        showToast(
            "Extra item added."
        );

    }


    // ----------------------------------
    // Cart rendering
    // ----------------------------------

    function renderCart() {

        cartTable.innerHTML = "";


        if (cart.length === 0) {

            emptyCart.classList.remove(
                "hidden"
            );

            cartStatus.textContent =
                "No items added.";

        } else {

            emptyCart.classList.add(
                "hidden"
            );

            cartStatus.textContent =
                `${cart.length} item(s) in cart.`;

        }


        cart.forEach(item => {

            const row =
                document.createElement("tr");


            const itemSubtotal =
                item.price *
                item.quantity;


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHtml(item.name)}
                    </strong>

                    ${
                        item.type === "extra"
                            ? `<small class="extra-label">Extra</small>`
                            : ""
                    }
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${item.unit}
                </td>

                <td>
                    ${formatCurrency(item.price)}
                </td>

                <td>
                    ${formatCurrency(itemSubtotal)}
                </td>

                <td>

                    <button
                        type="button"
                        class="remove-cart-item"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>

                </td>
            `;


            cartTable.appendChild(row);

        });


        updateTotals();

    }


    // ----------------------------------
    // Remove cart item
    // ----------------------------------

    cartTable.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".remove-cart-item"
                );


            if (!button) return;


            const id =
                button.dataset.id;


            cart =
                cart.filter(
                    item => item.id !== id
                );


            renderCart();

        }
    );


    // ----------------------------------
    // Totals
    // ----------------------------------

    discountInput.addEventListener(
        "input",
        updateTotals
    );


    function updateTotals() {

        const subtotal =
            cart.reduce(
                (total, item) =>
                    total +
                    item.price *
                    item.quantity,
                0
            );


        let discount =
            Number(discountInput.value);


        if (
            !Number.isFinite(discount) ||
            discount < 0
        ) {

            discount = 0;

        }


        if (discount > subtotal) {

            discount = subtotal;

        }


        const finalTotal =
            subtotal - discount;


        subtotalElement.textContent =
            formatCurrency(subtotal);


        finalTotalElement.textContent =
            formatCurrency(finalTotal);

    }


    // ----------------------------------
    // Clear cart
    // ----------------------------------

    document
        .getElementById("clearCartBtn")
        .addEventListener(
            "click",
            () => {

                if (cart.length === 0) {
                    return;
                }


                const confirmed =
                    window.confirm(
                        "Clear all items from this bill?"
                    );


                if (!confirmed) return;


                cart = [];

                renderCart();

            }
        );


    // ----------------------------------
    // Generate invoice
    // ----------------------------------

    document
        .getElementById("generateInvoiceBtn")
        .addEventListener(
            "click",
            generateInvoice
        );


    function generateInvoice() {

        if (cart.length === 0) {

            showToast(
                "Add at least one item before generating the invoice.",
                true
            );

            return;
        }


        let customerName =
            billCustomerName.value.trim();


        if (!customerName) {
            customerName = "User";
        }


        const subtotal =
            cart.reduce(
                (total, item) =>
                    total +
                    item.price *
                    item.quantity,
                0
            );


        let discount =
            Number(discountInput.value);


        if (!Number.isFinite(discount) ||
            discount < 0) {

            discount = 0;

        }


        discount =
            Math.min(
                discount,
                subtotal
            );


        const finalTotal =
            subtotal - discount;


        const bill = {

            invoiceNumber,

            customerName,

            date:
                new Date().toISOString(),

            items:
                cart.map(item => ({
                    ...item,
                    subtotal:
                        item.price *
                        item.quantity
                })),

            subtotal,

            discount,

            total:
                finalTotal

        };


        localStorage.setItem(
          "smartbill_current_bill",
          JSON.stringify(bill)
        );


        const existingSales =
          JSON.parse(
            localStorage.getItem(
              "smartbill_sales"
            )
          ) || [];


        existingSales.unshift(bill);


        localStorage.setItem(
          "smartbill_sales",
          JSON.stringify(existingSales)
        );


        window.location.href =
            "/invoice";

    }


    // ----------------------------------
    // Toast
    // ----------------------------------

    let toastTimer;


    function showToast(
        message,
        error = false
    ) {

        billingToast.textContent =
            message;


        billingToast.classList.remove(
            "hidden",
            "toast-error"
        );


        if (error) {

            billingToast.classList.add(
                "toast-error"
            );

        }


        clearTimeout(toastTimer);


        toastTimer =
            setTimeout(
                () => {

                    billingToast.classList.add(
                        "hidden"
                    );

                },
                2500
            );

    }


    // ----------------------------------
    // Escape HTML
    // ----------------------------------

    function escapeHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    // Initial render

    renderCart();

});