import { SignIn } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/admin-auth";

export default function AdminSignInPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-xl text-ink">Administration non configurée</h1>
          <p className="mt-3 text-sm text-ink-soft">
            L&apos;authentification (Clerk) n&apos;est pas encore configurée pour cette
            démonstration. Consultez docs/DEPLOYMENT.md.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#a23e28",
            colorBackground: "#fffefa",
            borderRadius: "4px",
          },
        }}
      />
    </div>
  );
}
