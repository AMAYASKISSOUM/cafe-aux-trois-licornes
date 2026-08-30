"use client";

import { useEffect } from "react";

// Root-level fallback for when the [locale] layout itself fails to render.
// Deliberately dependency-free (no design-system imports, no next-intl) so
// it can't fail for the same reason the rest of the app just did.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f6f0e4",
          color: "#241a14",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <p style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#7a5424" }}>
            Café Aux Trois Licornes
          </p>
          <h1 style={{ fontSize: 28, margin: "12px 0" }}>
            Une erreur est survenue / Something went wrong
          </h1>
          <p style={{ color: "#55453a", lineHeight: 1.6 }}>
            Veuillez réessayer, ou nous appeler au (819) 205-6622.
            <br />
            Please try again, or call us at (819) 205-6622.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              height: 44,
              padding: "0 24px",
              backgroundColor: "#a23e28",
              color: "#f6f0e4",
              border: "none",
              borderRadius: 4,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Réessayer / Try again
          </button>
        </div>
      </body>
    </html>
  );
}
