document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productModal");
  const open = document.getElementById("addProductBtn");
  const close = document.getElementById("closeProductModal");
  const cancel = document.getElementById("cancelProductModal");
  const form = document.getElementById("productForm");

  const hide = () => modal?.classList.add("hidden");
  open?.addEventListener("click", () => modal?.classList.remove("hidden"));
  close?.addEventListener("click", hide);
  cancel?.addEventListener("click", hide);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Demo only: product form submitted. Backend/API will be connected later.");
    hide();
  });

  document.getElementById("productSearch")?.addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase();
    document.querySelectorAll("#productTable tr").forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    });
  });
});
