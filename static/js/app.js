document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop() || "dashboard.html";
  document.querySelectorAll("[data-page]").forEach(link => {
    const target = `${link.dataset.page === "billing" ? "billing" : link.dataset.page}.html`;
    if (current === target || (current === "index.html" && link.dataset.page === "dashboard")) {
      link.classList.add("active");
    }
  });

  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }
});
