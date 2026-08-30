"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Minus, Phone, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { formatHour } from "@/lib/hours";
import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/cn";
import { getAvailableSlotsAction, submitReservationAction } from "@/app/[locale]/reservation/actions";

const fieldClass =
  "h-12 w-full rounded-[var(--radius-sm)] border border-line bg-paper px-4 text-sm text-ink placeholder:text-ink-faint focus-visible:border-ink";
const labelClass = "text-xs font-medium uppercase tracking-wide text-ink-faint";

export function ReservationForm({
  locale,
  today,
  maxDate,
  initialMaxPartySize,
}: {
  locale: "fr" | "en";
  today: string;
  maxDate: string;
  initialMaxPartySize: number;
}) {
  const t = useTranslations("reservationPage");
  const [date, setDate] = useState(today);
  const [partySize, setPartySize] = useState(2);
  const [maxPartySize, setMaxPartySize] = useState(initialMaxPartySize);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsPending, startSlotsTransition] = useTransition();
  const [slotsRequested, setSlotsRequested] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");

  const [submitPending, startSubmitTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [result, setResult] = useState<
    | { status: "success"; id: string; date: string; time: string; partySize: number; name: string; email: string }
    | { status: "error"; code: string }
    | null
  >(null);

  useEffect(() => {
    if (!date) return;
    startSlotsTransition(async () => {
      setTime(null);
      setSlotsRequested(true);
      const res = await getAvailableSlotsAction(date, partySize);
      setSlots(res.slots);
      setMaxPartySize(res.maxPartySize);
    });
  }, [date, partySize]);

  const timeLabel = (hhmm: string) => formatHour(hhmm, locale);

  const dateLabelForSuccess = useMemo(() => {
    if (result?.status !== "success") return "";
    const [y, m, d] = result.date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(locale === "fr" ? "fr-CA" : "en-CA", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [result, locale]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) return;
    setFieldErrors({});

    startSubmitTransition(async () => {
      const res = await submitReservationAction(
        { date, time, partySize, fullName, email, phone, notes, consent, company },
        locale
      );
      if (res.success) {
        setResult({ status: "success", id: res.id ?? "", date, time, partySize, name: fullName, email });
      } else {
        setFieldErrors(res.fieldErrors ?? {});
        setResult({ status: "error", code: res.error ?? "server" });
      }
    });
  }

  if (result?.status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[var(--radius-md)] border border-line bg-paper p-8">
        <h2 className="font-display text-2xl text-ink">{t("successHeading")}</h2>
        <p className="max-w-md text-ink-soft">
          {t("successBody", {
            name: result.name,
            count: result.partySize,
            date: dateLabelForSuccess,
            time: timeLabel(result.time),
            email: result.email,
          })}
        </p>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setFullName("");
            setEmail("");
            setPhone("");
            setNotes("");
            setConsent(false);
            setTime(null);
          }}
          className={buttonVariants({ variant: "secondary" })}
        >
          {t("newRequest")}
        </button>
      </div>
    );
  }

  if (result?.status === "error" && result.code === "demo") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[var(--radius-md)] border border-line bg-paper p-8">
        <h2 className="font-display text-2xl text-ink">{t("errorDemoHeading")}</h2>
        <p className="max-w-md text-ink-soft">{t("errorDemoBody", { phone: BUSINESS.phoneDisplay })}</p>
        <a href={`tel:${BUSINESS.phone}`} className={buttonVariants({})}>
          <Phone className="h-4 w-4" aria-hidden />
          {t("callUs")}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <fieldset className="flex flex-col gap-6">
        <legend className="font-display text-xl text-ink">{t("whenHeading")}</legend>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="res-date" className={labelClass}>
              {t("dateLabel")}
            </label>
            <input
              id="res-date"
              type="date"
              required
              min={today}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span id="party-size-label" className={labelClass}>
              {t("partySizeLabel")}
            </span>
            <div className="flex h-12 items-center justify-between rounded-[var(--radius-sm)] border border-line bg-paper px-2">
              <button
                type="button"
                aria-label="-"
                disabled={partySize <= 1}
                onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-30"
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <span aria-labelledby="party-size-label" className="text-sm font-medium text-ink">
                {partySize}
              </span>
              <button
                type="button"
                aria-label="+"
                disabled={partySize >= maxPartySize}
                onClick={() => setPartySize((n) => Math.min(maxPartySize, n + 1))}
                className="flex h-9 w-9 items-center justify-center text-ink disabled:opacity-30"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>{t("timeLabel")}</span>
          {slotsPending ? (
            <p className="text-sm text-ink-faint">{t("timeLoading")}</p>
          ) : !slotsRequested ? (
            <p className="text-sm text-ink-faint">{t("selectDatePrompt")}</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-ink-faint">{t("noSlots")}</p>
          ) : (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("timeLabel")}>
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={time === slot}
                  onClick={() => setTime(slot)}
                  className={cn(
                    "h-10 rounded-[var(--radius-sm)] border px-4 text-sm transition-colors",
                    time === slot
                      ? "border-petrol bg-petrol text-parchment"
                      : "border-line text-ink-soft hover:border-ink hover:text-ink"
                  )}
                >
                  {timeLabel(slot)}
                </button>
              ))}
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-6">
        <legend className="font-display text-xl text-ink">{t("detailsHeading")}</legend>

        <div className="flex flex-col gap-2">
          <label htmlFor="res-name" className={labelClass}>
            {t("fullNameLabel")}
          </label>
          <input
            id="res-name"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={fieldClass}
          />
          {fieldErrors.fullName && <p className="text-xs text-error">{fieldErrors.fullName}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="res-email" className={labelClass}>
              {t("emailLabel")}
            </label>
            <input
              id="res-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
            />
            {fieldErrors.email && <p className="text-xs text-error">{fieldErrors.email}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="res-phone" className={labelClass}>
              {t("phoneLabel")}
            </label>
            <input
              id="res-phone"
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={fieldClass}
            />
            {fieldErrors.phone && <p className="text-xs text-error">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="res-notes" className={labelClass}>
            {t("notesLabel")}
          </label>
          <textarea
            id="res-notes"
            rows={3}
            placeholder={t("notesPlaceholder")}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={cn(fieldClass, "h-auto resize-none py-3")}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span>
            {t("consentLabel")}{" "}
            <Link href="/confidentialite" className="underline decoration-brass/40 underline-offset-2 hover:text-ink">
              {t("privacyLink")}
            </Link>
          </span>
        </label>
      </fieldset>

      {result?.status === "error" && result.code !== "validation" && (
        <p role="alert" className="text-sm text-error">
          {t(
            result.code === "rate-limited"
              ? "errorRateLimited"
              : result.code === "unavailable"
                ? "errorUnavailable"
                : result.code === "full"
                  ? "errorFull"
                  : "errorServer"
          )}
        </p>
      )}
      {result?.status === "error" && result.code === "validation" && (
        <p role="alert" className="text-sm text-error">
          {t("errorValidation")}
        </p>
      )}

      <button
        type="submit"
        disabled={!time || submitPending}
        className={buttonVariants({ className: "self-start" })}
      >
        {submitPending ? t("submittingLabel") : t("submitLabel")}
      </button>
    </form>
  );
}
