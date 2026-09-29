// ============================================
// SmartBill - Settings
// ============================================

const SETTINGS_KEY = "smartbill_settings";


// --------------------------------------------
// Default Settings
// --------------------------------------------

const defaultSettings = {
    storeName: "Sharma General Store",
    storePhone: "",
    storeAddress: "",
    storeEmail: "",

    invoicePrefix: "INV",
    defaultCustomer: "User",
    receiptFormat: "thermal-80mm",
    showStoreInfo: true,

    currency: "INR",
    defaultDiscount: 0,
    decimalPlaces: 2,

    warningThreshold: 40,
    highAlertThreshold: 30,

    theme: "light"
};


// --------------------------------------------
// Get Settings
// --------------------------------------------

function getSettings() {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);

        if (!savedSettings) {
            return { ...defaultSettings };
        }

        const parsedSettings = JSON.parse(savedSettings);

        return {
            ...defaultSettings,
            ...parsedSettings
        };

    } catch (error) {
        console.error("Unable to load settings:", error);

        return { ...defaultSettings };
    }
}


// --------------------------------------------
// Save Settings
// --------------------------------------------

function saveSettings() {

    const settings = {
        storeName: document.getElementById("storeName").value.trim(),
        storePhone: document.getElementById("storePhone").value.trim(),
        storeAddress: document.getElementById("storeAddress").value.trim(),
        storeEmail: document.getElementById("storeEmail").value.trim(),

        invoicePrefix: document.getElementById("invoicePrefix").value.trim(),
        defaultCustomer: document.getElementById("defaultCustomer").value.trim(),
        receiptFormat: document.getElementById("receiptFormat").value,
        showStoreInfo: document.getElementById("showStoreInfo").checked,

        currency: document.getElementById("currency").value,
        defaultDiscount: Number(
            document.getElementById("defaultDiscount").value
        ),
        decimalPlaces: Number(
            document.getElementById("decimalPlaces").value
        ),

        warningThreshold: Number(
            document.getElementById("warningThreshold").value
        ),
        highAlertThreshold: Number(
            document.getElementById("highAlertThreshold").value
        ),

        theme: document.querySelector(
            'input[name="theme"]:checked'
        ).value
    };


    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!settings.storeName) {
        showToast("Please enter your store name.", "error");
        return;
    }

    if (!settings.invoicePrefix) {
        showToast("Please enter an invoice prefix.", "error");
        return;
    }

    if (!settings.defaultCustomer) {
        showToast("Please enter a default customer name.", "error");
        return;
    }

    if (
        Number.isNaN(settings.defaultDiscount) ||
        settings.defaultDiscount < 0 ||
        settings.defaultDiscount > 100
    ) {
        showToast("Discount must be between 0% and 100%.", "error");
        return;
    }

    if (
        Number.isNaN(settings.warningThreshold) ||
        settings.warningThreshold <= 0 ||
        settings.warningThreshold > 100
    ) {
        showToast(
            "Warning threshold must be between 1% and 100%.",
            "error"
        );
        return;
    }

    if (
        Number.isNaN(settings.highAlertThreshold) ||
        settings.highAlertThreshold <= 0 ||
        settings.highAlertThreshold > 100
    ) {
        showToast(
            "High alert threshold must be between 1% and 100%.",
            "error"
        );
        return;
    }

    if (
        settings.highAlertThreshold >= settings.warningThreshold
    ) {
        showToast(
            "High alert threshold must be lower than warning threshold.",
            "error"
        );
        return;
    }


    // ----------------------------------------
    // Save
    // ----------------------------------------

    try {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(settings)
        );

        applyTheme(settings.theme);

        showToast(
            "Settings saved successfully.",
            "success"
        );

    } catch (error) {
        console.error("Unable to save settings:", error);

        showToast(
            "Unable to save settings.",
            "error"
        );
    }
}


// --------------------------------------------
// Load Settings Into Form
// --------------------------------------------

function loadSettings() {

    const settings = getSettings();

    document.getElementById("storeName").value =
        settings.storeName;

    document.getElementById("storePhone").value =
        settings.storePhone;

    document.getElementById("storeAddress").value =
        settings.storeAddress;

    document.getElementById("storeEmail").value =
        settings.storeEmail;


    document.getElementById("invoicePrefix").value =
        settings.invoicePrefix;

    document.getElementById("defaultCustomer").value =
        settings.defaultCustomer;

    document.getElementById("receiptFormat").value =
        settings.receiptFormat;

    document.getElementById("showStoreInfo").checked =
        settings.showStoreInfo;


    document.getElementById("currency").value =
        settings.currency;

    document.getElementById("defaultDiscount").value =
        settings.defaultDiscount;

    document.getElementById("decimalPlaces").value =
        settings.decimalPlaces;


    document.getElementById("warningThreshold").value =
        settings.warningThreshold;

    document.getElementById("highAlertThreshold").value =
        settings.highAlertThreshold;


    const selectedTheme = document.querySelector(
        `input[name="theme"][value="${settings.theme}"]`
    );

    if (selectedTheme) {
        selectedTheme.checked = true;
    }

    applyTheme(settings.theme);
}


// --------------------------------------------
// Reset Settings
// --------------------------------------------

function resetSettings() {

    const confirmed = confirm(
        "Reset all SmartBill settings to their default values?"
    );

    if (!confirmed) {
        return;
    }

    try {

        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(defaultSettings)
        );

        loadSettings();

        showToast(
            "Settings restored to default.",
            "success"
        );

    } catch (error) {

        console.error(
            "Unable to reset settings:",
            error
        );

        showToast(
            "Unable to reset settings.",
            "error"
        );
    }
}


// --------------------------------------------
// Theme
// --------------------------------------------

function applyTheme(theme) {

    if (theme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
}


// --------------------------------------------
// Clear Current Bill
// --------------------------------------------

function clearCurrentBill() {

    const confirmed = confirm(
        "Are you sure you want to clear the current bill?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("smartbill_current_bill");

    showToast(
        "Current bill cleared.",
        "success"
    );
}


// --------------------------------------------
// Clear Sales History
// --------------------------------------------

function clearSalesHistory() {

    const confirmed = confirm(
        "This will permanently remove all sales history from this browser. Continue?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("smartbill_sales");

    showToast(
        "Sales history cleared.",
        "success"
    );
}


// --------------------------------------------
// Reset Demo Data
// --------------------------------------------

function resetDemoData() {

    const confirmed = confirm(
        "Reset demo data? This will remove current products and sales stored in this browser."
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("smartbill_products");
    localStorage.removeItem("smartbill_sales");
    localStorage.removeItem("smartbill_current_bill");

    showToast(
        "Demo data has been reset.",
        "success"
    );
}


// --------------------------------------------
// Toast
// --------------------------------------------

function showToast(message, type = "success") {

    const toast = document.getElementById("settingsToast");

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.className =
        `settings-toast ${type} show`;

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// --------------------------------------------
// Event Listeners
// --------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    loadSettings();


    const saveButton =
        document.getElementById("saveSettingsBtn");

    const resetButton =
        document.getElementById("resetSettingsBtn");

    const clearCurrentBillButton =
        document.getElementById("clearCurrentBillBtn");

    const clearSalesButton =
        document.getElementById("clearSalesBtn");

    const resetDataButton =
        document.getElementById("resetDataBtn");


    if (saveButton) {
        saveButton.addEventListener(
            "click",
            saveSettings
        );
    }

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            resetSettings
        );
    }

    if (clearCurrentBillButton) {
        clearCurrentBillButton.addEventListener(
            "click",
            clearCurrentBill
        );
    }

    if (clearSalesButton) {
        clearSalesButton.addEventListener(
            "click",
            clearSalesHistory
        );
    }

    if (resetDataButton) {
        resetDataButton.addEventListener(
            "click",
            resetDemoData
        );
    }


    // Change theme immediately when selected
    document
        .querySelectorAll('input[name="theme"]')
        .forEach((radio) => {

            radio.addEventListener("change", () => {
                applyTheme(radio.value);
            });

        });

});