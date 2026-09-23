document.addEventListener("DOMContentLoaded", () => {

  const STORAGE_KEY = "smartbill_products";

  const defaultProducts = [
    {
      id: 1,
      name: "Rice",
      category: "Groceries",
      unit: "kg",
      price: 60,
      initialStock: 120,
      stock: 120,
      minStock: 20
    },
    {
      id: 2,
      name: "Sugar",
      category: "Groceries",
      unit: "kg",
      price: 45,
      initialStock: 100,
      stock: 85,
      minStock: 15
    },
    {
      id: 3,
      name: "Tea",
      category: "Beverages",
      unit: "pcs",
      price: 120,
      initialStock: 50,
      stock: 40,
      minStock: 10
    },
    {
      id: 4,
      name: "Biscuits",
      category: "Snacks",
      unit: "pcs",
      price: 30,
      initialStock: 20,
      stock: 8,
      minStock: 10
    },
    {
      id: 5,
      name: "Cooking Oil",
      category: "Groceries",
      unit: "litre",
      price: 150,
      initialStock: 30,
      stock: 25,
      minStock: 10
    },
    {
      id: 6,
      name: "Salt",
      category: "Groceries",
      unit: "kg",
      price: 20,
      initialStock: 10,
      stock: 3,
      minStock: 5
    }
  ];


  const productTable = document.getElementById("productTable");
  const searchInput = document.getElementById("productSearch");
  const categoryFilter = document.getElementById("categoryFilter");

  const modal = document.getElementById("productModal");
  const deleteModal = document.getElementById("deleteModal");

  const form = document.getElementById("productForm");

  const modalTitle = document.getElementById("productModalTitle");

  const productId = document.getElementById("productId");
  const productName = document.getElementById("productName");
  const productCategory = document.getElementById("productCategory");
  const productUnit = document.getElementById("productUnit");
  const productPrice = document.getElementById("productPrice");
  const productInitialStock = document.getElementById("productInitialStock");
  const productStock = document.getElementById("productStock");
  const productMinStock = document.getElementById("productMinStock");

  let products = loadProducts();
  let productToDelete = null;


  // -----------------------------
  // Storage
  // -----------------------------

  function loadProducts() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultProducts)
      );

      return [...defaultProducts];
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Invalid product storage:", error);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultProducts)
      );

      return [...defaultProducts];
    }
  }


  function saveProducts() {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(products)
    );

  }


  // -----------------------------
  // Stock status
  // -----------------------------

  function getStockStatus(product) {

    if (product.initialStock <= 0) {
      return {
        label: "No Stock",
        className: "danger-badge"
      };
    }

    const percentage =
      (product.stock / product.initialStock) * 100;


    if (percentage < 30) {
      return {
        label: "High Alert",
        className: "danger-badge"
      };
    }


    if (percentage < 40) {
      return {
        label: "Warning",
        className: "warning-badge"
      };
    }


    return {
      label: "Normal",
      className: "success-badge"
    };

  }


  // -----------------------------
  // Render products
  // -----------------------------

  function renderProducts() {

    const searchTerm =
      searchInput.value.trim().toLowerCase();

    const selectedCategory =
      categoryFilter.value;


    const filteredProducts = products.filter(product => {

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;

    });


    productTable.innerHTML = "";


    if (filteredProducts.length === 0) {

      productTable.innerHTML = `
        <tr>
          <td colspan="8" class="empty-state">
            No products found.
          </td>
        </tr>
      `;

      return;
    }


    filteredProducts.forEach((product, index) => {

      const status = getStockStatus(product);


      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>

        <td>
          <strong>${escapeHtml(product.name)}</strong>
        </td>

        <td>${escapeHtml(product.category)}</td>

        <td>${product.unit}</td>

        <td>₹${Number(product.price).toFixed(2)}</td>

        <td>
          ${Number(product.stock)} ${product.unit}
        </td>

        <td>
          <span class="badge ${status.className}">
            ${status.label}
          </span>
        </td>

        <td>

          <button
            class="icon-action"
            data-action="edit"
            data-id="${product.id}"
            title="Edit product"
          >
            ✎
          </button>

          <button
            class="icon-action danger-action"
            data-action="delete"
            data-id="${product.id}"
            title="Delete product"
          >
            ⌫
          </button>

        </td>
      `;


      productTable.appendChild(row);

    });

  }


  // -----------------------------
  // Category filter
  // -----------------------------

  function renderCategories() {

    const categories = [
      ...new Set(
        products.map(product => product.category)
      )
    ].sort();


    const currentValue = categoryFilter.value;


    categoryFilter.innerHTML = `
      <option value="all">All Categories</option>
    `;


    categories.forEach(category => {

      const option = document.createElement("option");

      option.value = category;
      option.textContent = category;

      categoryFilter.appendChild(option);

    });


    if (
      categories.includes(currentValue)
    ) {
      categoryFilter.value = currentValue;
    }

  }


  // -----------------------------
  // Modal
  // -----------------------------

  function openAddModal() {

    form.reset();

    productId.value = "";

    productUnit.value = "kg";

    modalTitle.textContent = "Add Product";

    document.getElementById("saveProductBtn").textContent =
      "Save Product";

    modal.classList.remove("hidden");

    productName.focus();

  }


  function openEditModal(id) {

    const product =
      products.find(item => item.id === id);

    if (!product) return;


    productId.value = product.id;

    productName.value = product.name;
    productCategory.value = product.category;
    productUnit.value = product.unit;
    productPrice.value = product.price;
    productInitialStock.value = product.initialStock;
    productStock.value = product.stock;
    productMinStock.value = product.minStock;


    modalTitle.textContent = "Edit Product";

    document.getElementById("saveProductBtn").textContent =
      "Update Product";


    modal.classList.remove("hidden");

  }


  function closeProductModal() {

    modal.classList.add("hidden");

  }


  // -----------------------------
  // Save product
  // -----------------------------

  form.addEventListener("submit", event => {

    event.preventDefault();


    const name =
      productName.value.trim();

    const category =
      productCategory.value.trim();

    const unit =
      productUnit.value;

    const price =
      Number(productPrice.value);

    const initialStock =
      Number(productInitialStock.value);

    const stock =
      Number(productStock.value);

    const minStock =
      Number(productMinStock.value);


    // Validation

    if (!name) {
      showToast("Product name is required.", true);
      return;
    }


    if (!category) {
      showToast("Category is required.", true);
      return;
    }


    if (!Number.isFinite(price) || price < 0) {
      showToast("Price cannot be negative.", true);
      return;
    }


    if (!Number.isFinite(initialStock) || initialStock < 0) {
      showToast("Initial stock cannot be negative.", true);
      return;
    }


    if (!Number.isFinite(stock) || stock < 0) {
      showToast("Current stock cannot be negative.", true);
      return;
    }


    if (!Number.isFinite(minStock) || minStock < 0) {
      showToast("Minimum stock cannot be negative.", true);
      return;
    }


    if (stock > initialStock) {
      showToast(
        "Current stock cannot exceed initial stock.",
        true
      );
      return;
    }


    const editingId =
      Number(productId.value);


    if (editingId) {

      const product =
        products.find(item => item.id === editingId);


      if (!product) {
        showToast("Product not found.", true);
        return;
      }


      product.name = name;
      product.category = category;
      product.unit = unit;
      product.price = price;
      product.initialStock = initialStock;
      product.stock = stock;
      product.minStock = minStock;


      showToast("Product updated successfully.");

    } else {

      const newProduct = {

        id: Date.now(),

        name,
        category,
        unit,
        price,
        initialStock,
        stock,
        minStock

      };


      products.push(newProduct);

      showToast("Product added successfully.");

    }


    saveProducts();

    renderCategories();
    renderProducts();

    closeProductModal();

  });


  // -----------------------------
  // Edit / Delete
  // -----------------------------

  productTable.addEventListener("click", event => {

    const button =
      event.target.closest("button[data-action]");

    if (!button) return;


    const id =
      Number(button.dataset.id);

    const action =
      button.dataset.action;


    if (action === "edit") {

      openEditModal(id);

    }


    if (action === "delete") {

      openDeleteModal(id);

    }

  });


  // -----------------------------
  // Delete
  // -----------------------------

  function openDeleteModal(id) {

    const product =
      products.find(item => item.id === id);

    if (!product) return;


    productToDelete = id;


    document.getElementById("deleteMessage").textContent =
      `Delete "${product.name}" from products?`;


    deleteModal.classList.remove("hidden");

  }


  function closeDeleteModal() {

    productToDelete = null;

    deleteModal.classList.add("hidden");

  }


  document
    .getElementById("confirmDelete")
    .addEventListener("click", () => {

      if (!productToDelete) return;


      products =
        products.filter(
          product => product.id !== productToDelete
        );


      saveProducts();

      renderCategories();
      renderProducts();

      closeDeleteModal();

      showToast("Product deleted.");

    });


  // -----------------------------
  // Search / filter
  // -----------------------------

  searchInput.addEventListener(
    "input",
    renderProducts
  );


  categoryFilter.addEventListener(
    "change",
    renderProducts
  );


  // -----------------------------
  // Buttons
  // -----------------------------

  document
    .getElementById("addProductBtn")
    .addEventListener(
      "click",
      openAddModal
    );


  document
    .getElementById("closeProductModal")
    .addEventListener(
      "click",
      closeProductModal
    );


  document
    .getElementById("cancelProductModal")
    .addEventListener(
      "click",
      closeProductModal
    );


  document
    .getElementById("closeDeleteModal")
    .addEventListener(
      "click",
      closeDeleteModal
    );


  document
    .getElementById("cancelDelete")
    .addEventListener(
      "click",
      closeDeleteModal
    );


  // -----------------------------
  // Toast
  // -----------------------------

  let toastTimer;


  function showToast(message, error = false) {

    const toast =
      document.getElementById("productToast");


    toast.textContent = message;

    toast.classList.remove(
      "hidden",
      "toast-error"
    );


    if (error) {
      toast.classList.add("toast-error");
    }


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

      toast.classList.add("hidden");

    }, 2500);

  }


  // -----------------------------
  // Security helper for table text
  // -----------------------------

  function escapeHtml(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  // Initial render

  renderCategories();
  renderProducts();

});