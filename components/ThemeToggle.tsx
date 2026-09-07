"use client";

export function ThemeToggle({ locale = "en" }: { locale?: string }) {
  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      aria-label={locale === "ar" ? "تبديل المظهر" : "Switch colour mode"}
      title={locale === "ar" ? "تبديل المظهر" : "Switch colour mode"}
      onClick={() => {
        const next =
          document.documentElement.dataset.theme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("atoi-theme", next);
        } catch {
          /* Theme still works when storage is unavailable. */
        }
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
