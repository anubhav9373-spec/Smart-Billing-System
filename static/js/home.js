// ============================================
// SmartBill Premium Home Page
// ============================================


// --------------------------------------------
// Navbar scroll effect
// --------------------------------------------

const navbar = document.getElementById("landingNavbar");

window.addEventListener("scroll", () => {

    if (!navbar) {
        return;
    }

    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


// --------------------------------------------
// Mobile menu
// --------------------------------------------

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const landingNav =
    document.getElementById("landingNav");


if (mobileMenuButton && landingNav) {

    mobileMenuButton.addEventListener("click", () => {

        landingNav.classList.toggle("open");

        const isOpen =
            landingNav.classList.contains("open");

        mobileMenuButton.textContent =
            isOpen ? "✕" : "☰";

    });


    landingNav
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener("click", () => {

                landingNav.classList.remove("open");

                mobileMenuButton.textContent = "☰";

            });

        });

}


// --------------------------------------------
// Active navigation
// --------------------------------------------

const navLinks =
    document.querySelectorAll(
        '.landing-nav a[href^="#"]'
    );


const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const observer =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach((link) => {
                    link.classList.remove("active");
                });

                const currentLink =
                    document.querySelector(
                        `.landing-nav a[href="#${entry.target.id}"]`
                    );

                if (currentLink) {
                    currentLink.classList.add("active");
                }

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );


sections.forEach((section) => {
    observer.observe(section);
});


// --------------------------------------------
// Scroll reveal
// --------------------------------------------

const revealElements =
    document.querySelectorAll(
        ".feature-card, .step-card, .preview-card, .why-point"
    );


revealElements.forEach((element) => {
    element.classList.add("reveal");
});


const revealObserver =
    new IntersectionObserver(
        (entries, observerInstance) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");

                observerInstance.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach((element) => {
    revealObserver.observe(element);
});


// --------------------------------------------
// Newsletter
// --------------------------------------------

const newsletterForm =
    document.getElementById("newsletterForm");

const newsletterEmail =
    document.getElementById("newsletterEmail");

const newsletterMessage =
    document.getElementById("newsletterMessage");


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (!newsletterEmail.value.trim()) {
                return;
            }

            newsletterMessage.textContent =
                "Thanks! You're on the list.";

            newsletterEmail.value = "";

        }
    );

}