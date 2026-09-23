document.addEventListener("DOMContentLoaded", () => {

  const currentPath =
    window.location.pathname.replace(/\/$/, "") || "/";


  document.querySelectorAll("[data-page]").forEach(link => {

    const page =
      link.dataset.page;


    const routes = {
      dashboard: "/",
      products: "/products",
      billing: "/billing",
      sales: "/sales",
      analytics: "/analytics",
      settings: "/settings"
    };


    if (routes[page] === currentPath) {
      link.classList.add("active");
    }

  });


  const toggle =
    document.getElementById("menuToggle");

  const sidebar =
    document.getElementById("sidebar");


  if (toggle && sidebar) {

    toggle.addEventListener("click", () => {

      sidebar.classList.toggle("mobile-open");

    });

  }

});