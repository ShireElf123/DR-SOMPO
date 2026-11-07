"use client";

import { m } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  Check,
  Loader2,
  Mail,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useHydrated } from "@/lib/use-hydrated";
import { addCalendarDays, formatAppointmentDate, isValidPreferredDate } from "@/lib/appointment-dates";
import {
  CONTACT_METHODS,
  isContactMethodAvailable,
  MAX,
  resolveService,
  SLOTS,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryFields,
} from "@/lib/enquiry";
import { allServices, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

const fields: Record<keyof EnquiryFields, { id: string; label: string }> = {
  name: { id: "enq-name", label: "Full name" },
  contactMethod: { id: "enq-method", label: "Contact method" },
  contact: { id: "enq-contact", label: "Contact details" },
  preferredDate: { id: "enq-date", label: "Preferred day" },
  preferredSlot: { id: "enq-slot", label: "Preferred time" },
  service: { id: "enq-service", label: "Service" },
  message: { id: "enq-message", label: "Your note" },
  consent: { id: "enq-consent", label: "Consent" },
};

function ContactLinks() {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <a href={practice.phoneHref} className="btn btn min-h-12">
        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
        {practice.phone}
        <i aria-hidden="true">
          <ArrowUpRight className="h-3 w-3" />
        </i>
      </a>
      <a href={`mailto:${practice.email}`} className="btn btn-ghost min-h-12">
        <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email the practice
        <i aria-hidden="true">
          <ArrowUpRight className="h-3 w-3" />
        </i>
      </a>
    </div>
  );
}

/** A request, never an available slot or a confirmed booking. The server supplies
 * one practice-date snapshot for SSR + hydration and a boolean delivery gate. */
export function EnquiryForm({
  defaultService = "",
  days,
  today,
  onlineEnabled,
}: {
  defaultService?: string;
  days: string[];
  today: string;
  onlineEnabled: boolean;
}) {
  const initialValues = (): EnquiryFields => ({
    name: "",
    contactMethod: "Telephone",
    contact: "",
    preferredDate: "",
    preferredSlot: "",
    service: resolveService(defaultService),
    message: "",
    consent: false,
  });
  const [values, setValues] = useState<EnquiryFields>(initialValues);
  const [company, setCompany] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const summary = useRef<HTMLDivElement>(null);
  const receipt = useRef<HTMLDivElement>(null);
  const deliveryNotice = useRef<HTMLParagraphElement>(null);
  const sending = useRef(false);
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  const selectedSlot = SLOTS.find((slot) => slot.value === values.preferredSlot);
  const selectedService = allServices.find((service) => service.id === values.service);

  useEffect(() => {
    if (hydrated && window.location.hash === "#appointment-request") {
      document.getElementById("appointment-request")?.focus({ preventScroll: true });
    }
  }, [hydrated]);

  useEffect(() => {
    if (!failedAttempts) return;
    summary.current?.focus({ preventScroll: true });
    summary.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [failedAttempts]);
  useEffect(() => {
    if (!notice) return;
    deliveryNotice.current?.focus({ preventScroll: true });
    deliveryNotice.current?.scrollIntoView({
      block: "center",
      behavior: "instant",
    });
  }, [notice]);
  useEffect(() => {
    if (state === "sent") {
      receipt.current?.focus({ preventScroll: true });
      receipt.current?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [state]);

  function update<K extends keyof EnquiryFields>(
    key: K,
    value: EnquiryFields[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }
  function chooseDate(date: string) {
    update("preferredDate", date);
    if (date && !isValidPreferredDate(date, today)) {
      setErrors((current) => ({ ...current, preferredDate: "Please choose a real date within the next 90 days." }));
    }
  }
  function showErrors(next: EnquiryErrors) {
    setErrors(next);
    setFailedAttempts((count) => count + 1);
  }

  async function onSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    if (!onlineEnabled || !hydrated || sending.current) return;
    const next = validateEnquiry(values, today);
    setNotice(null);
    if (Object.keys(next).length) {
      showErrors(next);
      return;
    }
    setErrors({});
    sending.current = true;
    setState("sending");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: EnquiryErrors;
      };
      if (response.ok && data.ok) {
        setState("sent");
        return;
      }
      setState("idle");
      if (data.errors && Object.keys(data.errors).length)
        showErrors(data.errors);
      else
        setNotice(
          data.error ??
            `We could not deliver your enquiry. Please call ${practice.phone}.`,
        );
    } catch {
      setState("idle");
      setNotice(
        `We could not reach the practice server. Please call ${practice.phone} or email ${practice.email}.`,
      );
    } finally {
      sending.current = false;
    }
  }

  if (state === "sent") {
    return (
      <m.div
        id="appointment-request"
        ref={receipt}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="scroll-mt-28 rounded-[1.35rem] bg-cream p-6 ring-1 ring-charcoal/10 sm:p-8"
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach text-ink">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-xl text-ink">Request received</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          Your enquiry has been sent to the practice. They will contact you to
          discuss availability.
          {values.preferredDate && values.preferredSlot && (
            <>
              {" "}
              You requested{" "}
              {formatAppointmentDate(values.preferredDate, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              , {values.preferredSlot.toLowerCase()}.
            </>
          )}
        </p>
        <p className="mt-3 rounded-xl bg-cream p-3 text-[12px] leading-relaxed text-ink-soft">
          This is not a confirmed appointment. Please contact the practice if
          you need to follow up; no response deadline is promised.
        </p>
        <ContactLinks />
        <button
          type="button"
          className="btn btn-ghost mt-4 min-h-12"
          onClick={() => {
            setState("idle");
            setValues(initialValues());
            setCompany("");
            setErrors({});
            setNotice(null);
            requestAnimationFrame(() =>
              document.getElementById("enq-name")?.focus(),
            );
          }}
        >
          Send another
          <i aria-hidden="true">
            <ArrowUpRight className="h-3 w-3" />
          </i>
        </button>
      </m.div>
    );
  }

  // Direct-contact mode is a local planner, not a submitting HTML form.
  // Its controls remain usable, but even a later JS failure cannot send them.
  const Container = onlineEnabled ? "form" : "section";
  const errorEntries = Object.entries(errors).filter(
    (entry): entry is [keyof EnquiryFields, string] =>
      Boolean(entry[1]) && Object.hasOwn(fields, entry[0]),
  );
  return (
    <Container
      id="appointment-request"
      tabIndex={-1}
      aria-labelledby="appointment-heading"
      data-enquiry-mode={onlineEnabled ? "online" : "direct"}
      {...(onlineEnabled
        ? { action: "/api/enquiry", method: "post", onSubmit, noValidate: true }
        : { role: "form" })}
      className="min-w-0 max-w-full scroll-mt-6 rounded-[1.35rem] bg-cream p-5 ring-1 ring-charcoal/10 sm:p-7"
    >
      <h3 id="appointment-heading" className="flex items-center gap-2 text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
        <CalendarCheck className="h-4 w-4 text-ink" aria-hidden="true" />
        Request an appointment
      </h3>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">
        Choose your preferences. These are not available slots; the practice
        confirms the exact appointment with you.
      </p>
      <p className="mt-4 rounded-xl bg-cream px-3 py-2.5 text-[12px] leading-relaxed text-ink-soft">
        Times are in South African Standard Time (SAST). Please confirm
        consulting hours and availability directly with the practice.
      </p>
      {!onlineEnabled && (
        <div className="mt-4 rounded-xl border border-ember/20 bg-blush/70 px-3 py-3 text-[12px] leading-relaxed text-ink-soft" data-direct-booking-notice>
          <p className="font-medium text-ink">Book directly with the practice</p>
          <p className="mt-1">
            The calendar and details below are available to plan your visit.
            Online sending is not connected yet: your draft stays on this page
            and is not submitted to the practice. Call or email to arrange your appointment.
          </p>
        </div>
      )}
      {!hydrated && (
        <p className="mt-3 text-[12px] text-ink-soft">
          The online form needs JavaScript to load. You can also{" "}
          <a className="underline" href={practice.phoneHref}>
            call {practice.phone}
          </a>{" "}
          or{" "}
          <a className="underline" href={`mailto:${practice.email}`}>
            email the practice
          </a>
          .
        </p>
      )}

      {errorEntries.length > 0 && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          aria-labelledby="enq-error-heading"
          className="mt-4 scroll-mt-28 rounded-xl border border-[#c98a7a] bg-[#fdf3ef] p-3 text-[13px] text-[#7d3627]"
        >
          <p id="enq-error-heading" className="font-medium">
            {onlineEnabled ? "Please check the following before sending:" : "Please check your appointment preferences:"}
          </p>
          <ul className="mt-2 list-inside list-disc">
            {errorEntries.map(([key]) => (
              <li key={key}>
                <a
                  className="underline underline-offset-2"
                  href={`#${fields[key].id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(fields[key].id)?.focus();
                  }}
                >
                  {fields[key].label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disabled in server HTML: a script failure cannot collect details or submit via GET. */}
      <fieldset
        disabled={!hydrated || state === "sending"}
        aria-label="Appointment details"
        className="mt-5 min-w-0 space-y-4"
      >
        <Field
          label="Full name"
          htmlFor="enq-name"
          error={errors.name}
          required={onlineEnabled}
        >
          <input
            id="enq-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={MAX.name}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "enq-name-error" : undefined}
            placeholder="Your name and surname"
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <fieldset
          id="enq-date"
          tabIndex={-1}
          className="min-w-0 scroll-mt-28"
          aria-invalid={Boolean(errors.preferredDate)}
          aria-describedby={errors.preferredDate ? "enq-date-error" : undefined}
        >
          <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Preferred day{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </legend>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto overscroll-x-contain px-1 pb-1 lg:flex-wrap lg:overflow-visible">
            {days.map((iso) => {
              const selected = values.preferredDate === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  data-date={iso}
                  onClick={() => chooseDate(selected ? "" : iso)}
                  aria-pressed={selected}
                  className={cn(
                    "relative flex min-w-[3.1rem] shrink-0 flex-col items-center rounded-xl border px-2 py-2 transition-colors duration-300",
                    selected
                      ? "border-ember bg-ember text-cream"
                      : "border-charcoal/12 text-ink-soft hover:border-ember/40 hover:text-ink",
                  )}
                >
                  <span className="text-[10px] uppercase tracking-[0.08em]">
                    {formatAppointmentDate(iso, { weekday: "short" })}
                  </span>
                  <span className="mt-0.5 text-[14px] font-medium tabular-nums leading-none">
                    {formatAppointmentDate(iso, { day: "numeric" })}
                  </span>
                  <span className="mt-0.5 text-[10px] uppercase tracking-[0.08em]">
                    {formatAppointmentDate(iso, { month: "short" })}
                  </span>
                  <span className="sr-only">{formatAppointmentDate(iso, { year: "numeric" })}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3">
            <label htmlFor="enq-other-date" className="mb-1.5 block text-[12px] font-medium text-ink-soft">
              Choose another date
            </label>
            <input
              id="enq-other-date"
              name="preferredDate"
              type="date"
              min={today}
              max={addCalendarDays(today, 90)}
              value={values.preferredDate}
              onChange={(event) => chooseDate(event.target.value)}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={`enq-date-hint${errors.preferredDate ? " enq-date-error" : ""}`}
              className={inputClass(Boolean(errors.preferredDate))}
            />
            <p id="enq-date-hint" className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
              Choose a preference within the next 90 days. Dates shown are not confirmed availability.
            </p>
          </div>
          <FieldError id="enq-date-error" error={errors.preferredDate} />
        </fieldset>

        <fieldset
          id="enq-slot"
          tabIndex={-1}
          className="min-w-0 scroll-mt-28"
          aria-invalid={Boolean(errors.preferredSlot)}
          aria-describedby={errors.preferredSlot ? "enq-slot-error" : undefined}
        >
          <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Preferred time{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </legend>
          <div className="grid grid-cols-2 gap-1.5">
            {SLOTS.map((option) => {
              const selected = values.preferredSlot === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    update("preferredSlot", selected ? "" : option.value)
                  }
                  aria-pressed={selected}
                  className={cn(
                    "min-h-12 rounded-xl border px-2.5 py-2 text-left transition-colors duration-300",
                    selected
                      ? "border-ember bg-ember text-cream"
                      : "border-charcoal/12 text-ink-soft hover:border-ember/40 hover:text-ink",
                  )}
                >
                  <span className="block text-[12px] font-medium leading-tight">
                    {option.label}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-[10px] tabular-nums",
                      selected ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {option.time}
                  </span>
                </button>
              );
            })}
          </div>
          <FieldError id="enq-slot-error" error={errors.preferredSlot} />
        </fieldset>

        <Field
          label="What is the appointment for?"
          htmlFor="enq-service"
          error={errors.service}
        >
          <select
            id="enq-service"
            name="service"
            value={values.service}
            onChange={(e) => update("service", e.target.value)}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "enq-service-error" : undefined}
            className={inputClass(Boolean(errors.service))}
          >
            <option value="">General consultation — not sure yet</option>
            {allServices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.groupLabel})
              </option>
            ))}
          </select>
        </Field>

        <div className="rounded-xl bg-blush/70 p-3.5" data-appointment-summary>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h4 className="text-[12px] font-medium text-ink">Your appointment preferences</h4>
            <button
              type="button"
              disabled={!values.preferredDate && !values.preferredSlot}
              className="min-h-11 text-[12px] text-ink underline underline-offset-4 disabled:cursor-default disabled:text-ink-muted disabled:no-underline"
              onClick={() => {
                setValues((current) => ({ ...current, preferredDate: "", preferredSlot: "" }));
                setErrors((current) => ({ ...current, preferredDate: undefined, preferredSlot: undefined }));
              }}
            >
              Clear date and time
            </button>
          </div>
          <div aria-live="polite" aria-atomic="true" className="space-y-1 text-[12px] leading-relaxed text-ink-soft">
            <p>{selectedService?.title ?? "General consultation — not sure yet"}</p>
            <p>{values.preferredDate && isValidPreferredDate(values.preferredDate, today)
              ? formatAppointmentDate(values.preferredDate, { weekday: "short", day: "numeric", month: "long", year: "numeric" })
              : "Date to agree with the practice"}</p>
            <p>{selectedSlot ? `${selectedSlot.label} · ${selectedSlot.time} SAST` : "Time to agree with the practice"}</p>
          </div>
          <p className="mt-2 text-[11px] text-ink-soft">A preference, not a reserved appointment.</p>
        </div>

        <fieldset
          id="enq-method"
          tabIndex={-1}
          className="min-w-0 scroll-mt-28"
          aria-describedby={
            errors.contactMethod ? "enq-method-error" : undefined
          }
        >
          <legend className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            How should the practice contact you? {onlineEnabled && "*"}
          </legend>
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Contact method"
            aria-invalid={Boolean(errors.contactMethod)}
          >
            {CONTACT_METHODS.map((method) => {
              const selected = values.contactMethod === method;
              const available = isContactMethodAvailable(method);
              return (
                <label
                  key={method}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-charcoal lg:min-h-0 lg:text-[11px]",
                    available
                      ? "cursor-pointer"
                      : "cursor-not-allowed border-dashed",
                    selected
                      ? "border-ember bg-ember text-cream"
                      : "border-ember/20 text-ink-soft",
                  )}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={selected}
                    disabled={!available}
                    onChange={() => update("contactMethod", method)}
                    className="sr-only"
                  />
                  {method}
                  {!available && (
                    <span className="ml-1 text-[10px]">not available yet</span>
                  )}
                </label>
              );
            })}
          </div>
          <FieldError id="enq-method-error" error={errors.contactMethod} />
        </fieldset>

        <Field
          label={
            values.contactMethod === "Email"
              ? "Email address"
              : "Telephone number"
          }
          htmlFor="enq-contact"
          error={errors.contact}
          required={onlineEnabled}
        >
          <input
            id="enq-contact"
            name="contact"
            type={values.contactMethod === "Email" ? "email" : "tel"}
            inputMode={values.contactMethod === "Email" ? "email" : "tel"}
            autoComplete={values.contactMethod === "Email" ? "email" : "tel"}
            maxLength={MAX.contact}
            value={values.contact}
            onChange={(e) => update("contact", e.target.value)}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "enq-contact-error" : undefined}
            placeholder={
              values.contactMethod === "Email"
                ? "you@example.com"
                : "e.g. 082 000 0000"
            }
            className={inputClass(Boolean(errors.contact))}
          />
        </Field>

        <Field
          label="Anything else?"
          htmlFor="enq-message"
          error={errors.message}
          hint="Non-clinical only — please do not include symptoms or results."
        >
          <textarea
            id="enq-message"
            name="message"
            rows={2}
            maxLength={MAX.message}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message
                ? "enq-message-hint enq-message-error"
                : "enq-message-hint"
            }
            placeholder="e.g. First visit — I have a referral letter."
            className={cn(inputClass(Boolean(errors.message)), "resize-none")}
          />
        </Field>
        <div
          aria-hidden="true"
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="enq-company">Company</label>
          <input
            id="enq-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div>
          {onlineEnabled && (
            <>
              <label className="flex min-h-11 cursor-pointer items-start gap-2.5 lg:min-h-0">
                <input
                  id="enq-consent"
                  type="checkbox"
                  name="consent"
                  checked={values.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={
                    errors.consent ? "enq-consent-error" : undefined
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-charcoal/30 accent-ember"
                />
                <span className="text-[13px] leading-relaxed text-ink-soft lg:text-[11px]">
                  I agree that my details may be sent to the practice and used to
                  respond to this enquiry. *
                </span>
              </label>
              <FieldError id="enq-consent-error" error={errors.consent} />
            </>
          )}
          <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
            <a
              href="/patient-info#privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-2"
            >
              How your enquiry is handled (opens a new tab)
            </a>
          </p>
        </div>
        <p className="flex items-start gap-2 rounded-xl bg-cream px-3 py-2.5 text-[12px] leading-relaxed text-ink-soft">
          <ShieldAlert
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink"
            aria-hidden="true"
          />
          A request is not a confirmed appointment, and this is not a channel
          for urgent or clinical questions.
        </p>
        {notice && (
          <p
            ref={deliveryNotice}
            tabIndex={-1}
            role="alert"
            className="rounded-xl border border-[#c98a7a]/40 bg-[#fdf3ef] px-3 py-2.5 text-[12px] leading-relaxed text-[#7d3627]"
          >
            {notice}
          </p>
        )}
        {onlineEnabled ? (
          <button
            type="submit"
            disabled={!hydrated || state === "sending"}
            className="btn btn min-h-12 w-full justify-between disabled:cursor-not-allowed disabled:opacity-70 lg:min-h-0"
          >
            {state === "sending" ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending request
              </span>
          ) : (
            "Request this appointment"
          )}
          <i aria-hidden="true">
            <ArrowUpRight className="h-3 w-3" />
          </i>
        </button>
        ) : (
          <div data-direct-booking-actions>
            <p className="text-[12px] leading-relaxed text-ink-soft">
              Ready to arrange your visit? Call or email the practice with your
              preferred date and time. Nothing has been sent from this page.
              Please do not include symptoms or results in an email.
            </p>
            <ContactLinks />
          </div>
        )}
      </fieldset>
      <p className="mt-4 text-center text-[12px] text-ink-soft">
        Prefer to talk?{" "}
        <a
          href={practice.phoneHref}
          className="font-medium text-ink underline underline-offset-2"
        >
          Call {practice.phone}
        </a>
      </p>
    </Container>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "min-h-12 w-full min-w-0 scroll-mt-28 rounded-xl border bg-cream/60 px-3.5 py-2.5 text-base text-ink placeholder:text-ink-muted lg:min-h-0 lg:text-[13px]",
    "transition-colors duration-300 focus:bg-cream focus:outline-none focus:ring-2 focus:ring-ember/30",
    hasError
      ? "border-[#c98a7a] focus:border-[#a8543f]"
      : "border-charcoal/10 focus:border-ember",
  );
}
function FieldError({ id, error }: { id: string; error?: string }) {
  return error ? (
    <p id={id} className="mt-1.5 text-[12px] text-[#8c3b2e]">
      {error}
    </p>
  ) : null;
}
function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft"
      >
        {label} {required && "*"}
      </label>
      {children}
      {hint && (
        <p
          id={`${htmlFor}-hint`}
          className="mt-1.5 text-[12px] leading-relaxed text-ink-soft"
        >
          {hint}
        </p>
      )}
      <FieldError id={`${htmlFor}-error`} error={error} />
    </div>
  );
}
