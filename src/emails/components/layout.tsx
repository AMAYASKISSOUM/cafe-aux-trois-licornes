import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import { BUSINESS } from "@/lib/business";

const colors = {
  ink: "#241a14",
  inkSoft: "#55453a",
  parchment: "#f6f0e4",
  paper: "#fffefa",
  line: "#e7ddc9",
  rust: "#a23e28",
};

export function EmailLayout({
  previewText,
  children,
}: {
  previewText: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: colors.parchment, fontFamily: "Georgia, 'Times New Roman', serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ backgroundColor: colors.paper, maxWidth: 480, margin: "0 auto", border: `1px solid ${colors.line}`, borderRadius: 6 }}>
          <Section style={{ padding: "28px 32px 20px" }}>
            <Text style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.inkSoft, margin: 0 }}>
              Café
            </Text>
            <Text style={{ fontSize: 22, fontWeight: 700, color: colors.ink, margin: "2px 0 0" }}>
              Aux Trois Licornes
            </Text>
          </Section>
          <Hr style={{ borderColor: colors.line, margin: 0 }} />
          <Section style={{ padding: "28px 32px" }}>{children}</Section>
          <Hr style={{ borderColor: colors.line, margin: 0 }} />
          <Section style={{ padding: "20px 32px" }}>
            <Text style={{ fontSize: 12, color: colors.inkSoft, margin: "0 0 4px", fontFamily: "Arial, sans-serif" }}>
              {BUSINESS.address.street}, {BUSINESS.address.city} ({BUSINESS.address.region}) {BUSINESS.address.postalCode}
            </Text>
            <Text style={{ fontSize: 12, color: colors.inkSoft, margin: 0, fontFamily: "Arial, sans-serif" }}>
              {BUSINESS.phoneDisplay} · {BUSINESS.email}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailTextStyles = {
  body: { fontSize: 15, lineHeight: "24px", color: colors.ink, fontFamily: "Arial, sans-serif", margin: "0 0 16px" },
  label: { fontSize: 11, letterSpacing: 1, textTransform: "uppercase" as const, color: colors.inkSoft, fontFamily: "Arial, sans-serif", margin: "0 0 2px" },
  value: { fontSize: 15, color: colors.ink, fontFamily: "Arial, sans-serif", margin: "0 0 14px", fontWeight: 600 },
  heading: { fontSize: 20, color: colors.ink, margin: "0 0 16px" },
};

export { colors };
