const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");

const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyXkI7OUDEM3kGV54jrQ9c0boFqNgV6LvQaL5oh9SAqOcxsx0JmWtFXmgZJwKq8LWHsRg/exec";

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = leadForm.querySelector('button[type="submit"]');
    const formData = new FormData(leadForm);
    const payload = new URLSearchParams();

    if (formData.get("website")) return;

    if (GOOGLE_SHEET_WEB_APP_URL.includes("PASTE_YOUR")) {
      formStatus.textContent = "Form storage is not connected yet. Add your Google Apps Script Web App URL in script.js.";
      formStatus.className = "form-status is-error";
      return;
    }

    formData.set("submitted_at", new Date().toISOString());
    formData.set("source_page", window.location.href);
    formData.forEach((value, key) => {
      payload.append(key, value);
    });

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      });

      leadForm.reset();
      formStatus.textContent = "Thanks. Your project brief has been submitted successfully.";
      formStatus.className = "form-status is-success";
    } catch (error) {
      formStatus.textContent = "Something went wrong. Please try again or contact me on WhatsApp.";
      formStatus.className = "form-status is-error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Project Brief";
    }
  });
}
