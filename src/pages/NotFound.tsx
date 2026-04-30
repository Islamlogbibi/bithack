import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ position: "fixed", top: "1rem", right: "1rem" }}>
        <select
          aria-label={t("common.language", "Langue")}
          value={language}
          onChange={(e) => setLanguage(e.target.value as "fr" | "en" | "ar")}
          style={{ padding: "0.4rem 0.6rem", borderRadius: "0.5rem" }}
        >
          <option value="fr">{t("language.fr", "Francais")}</option>
          <option value="en">{t("language.en", "English")}</option>
          <option value="ar">{t("language.ar", "العربية")}</option>
        </select>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            fontSize: "8rem",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
            color: "var(--color-text)",
          }}
        >
          {t("notfound.title", "Page Not Found")}
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            marginBottom: "2rem",
            maxWidth: "400px",
          }}
        >
          {t("notfound.description", "The page you are looking for does not exist or has been moved.")}
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            background: "var(--color-primary)",
            color: "#fff",
            borderRadius: "0.5rem",
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {t("notfound.back", "Back to Home")}
        </Link>
      </motion.div>
    </div>
  );
}
