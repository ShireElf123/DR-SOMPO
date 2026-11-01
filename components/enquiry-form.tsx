"use client";

import { m } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ArrowUpRight, CalendarCheck, Check, Clock, Loader2, Phone, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { allServices, practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

/**
 * Appointment request.
 *
 * Deliberately not a "booking" flow: no calendar is invented, no slot is ever
 * presented as confirmed. What it does do — and what a Framer template gets
 * credit for — is let a patient express *when* they want to be seen, without a
 * phone call. The requested window is forwarded to the practice, who confirm
 * the actual time.
 *
 * It also knows the practice's timezone: if you open it at 02:00 in Pretoria it
 * says so plainly and leads with the callback instead of pretending to be live.
 */

type Slot = "Early morning" | "Late morning" | "Early afternoon" | "Late afternoon";

const SLOTS: { value: Slot; label: string; time: string }[] = [
  { value: "Early morning", label: "Early", time: "08:00 – 10:00" },
  { value: "Late morning", label: "Late morning", time: "10:00 – 12:00" },
  { value: "Early afternoon", label: "Early arvo", time: "13:00 – 15:00" },
  { value: "Late afternoon", label: "Late arvo", time: "15:00 – 16:30" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Next 10 weekdays, skipping weekends, as ISO date strings. */
function upcomingWeekdays(count = 10): string[] {
  const out: string[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (out.length < count) {
    if (cursor.getDay() !== 0 && cursor.getDay() !== 6) {
      out.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

/** Practice hours in Africa/Johannesburg, evaluated on the visitor's clock. */
function useCallingWindow() {
  const [state, setState] = useState<{ open: boolean; localTime: string }>({
    open: false,
    localTime: "",
  });

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-ZA", {
        timeZone: "Africa/Johannesburg",
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
        hour12: false,
      }).formatToParts(now);

      const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
      const hour = Number(get("hour"));
      const weekday = get("weekday");
      const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
      const open = isWeekday && hour >= 8 && hour < 17;

      setState({
        open,
        localTime: `${get("hour")}:${get("minute")}`,
      });
    };

    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return state;
}

export function EnquiryForm({ defaultService = "" }: { defaultService?: string }) {
  const [name, setName] = useState("");
  const [contactMethod, setContactMethod] = useState<"Telephone" | "Email" | "WhatsApp">(
    "Telephone",
  );
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<Slot | "">("");
  const [service, setService] = useState(defaultService);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");

  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const startedAt = useRef(Date.now());
  const reduce = useReducedMotion();
  const calling = useCallingWindow();
  const days = useMemo(() => upcomingWeekdays(10), []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please tell us your name.";
    if (contact.trim().length < 6)
      next.contact =
        contactMethod === "Email" ? "Please check that email address." : "Please check that number.";
    if (slot && !date) next.date = "Please choose a day for that time.";
    if (date && !slot) next.slot = "Please choose a time for that day.";
    if (!consent) next.consent = "Please confirm the practice may use these details.";

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setState("sending");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contactMethod,
          contact,
          preferred: "Any time",
          preferredDate: date,
          preferredSlot: slot,
          service,
          message,
          consent,
          company,
          startedAt: startedAt.current,
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        errors?: Record<string, string>;
        error?: string;
      };

      if (data.ok) {
        setState("sent");
        return;
      }

      setState("idle");
      if (data.errors) setErrors(data.errors);
      setNotice(data.error ?? "We could not send that request. Please call the practice.");
    } catch {
      setState("idle");
      setNotice(
        `We could not reach the practice server. Please call ${practice.phone} or email ${practice.email}.`,
      );
    }
  }

  if (state === "sent") {
    return (
      <m.div
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[1.35rem] bg-white p-6 ring-1 ring-charcoal/10 sm:p-8"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-forest">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-[1.25rem] font-light tracking-[-0.02em] text-forest">
          Request received
        </h3>
        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-soft">
          The practice will confirm your appointment directly, using the contact
          details you gave.
          {date && slot && (
            <>
              {" "}
              You asked for{" "}
              <span className="font-medium text-charcoal">
                {new Date(`${date}T12:00:00`).toLocaleDateString("en-ZA", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              , {slot.toLowerCase()}.
            </>
          )}
        </p>
        <p className="mt-3 max-w-md rounded-xl bg-ivory px-3 py-2.5 text-[11.5px] leading-relaxed text-ink-soft">
          This is a request, not a confirmed appointment. If the time does not
          suit the practice, they will offer the nearest alternative.
        </p>
        {!calling.open && (
          <p className="mt-3 flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-soft">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest/60" aria-hidden="true" />
            The practice is currently closed. Your request will be seen on the next
            working morning.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={practice.phoneHref} className="btn btn-forest">
            <span className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {practice.phone}
            </span>
            <i aria-hidden="true">
              <ArrowUpRight className="h-3 w-3" />
            </i>
          </a>
          <button
            type="button"
            onClick={() => {
              setState("idle");
              setName("");
              setContact("");
              setDate("");
              setSlot("");
              setMessage("");
              setConsent(false);
              startedAt.current = Date.now();
            }}
            className="btn btn-ghost"
          >
            Send another
            <i aria-hidden="true">
              <ArrowUpRight className="h-3 w-3" />
            </i>
          </button>
        </div>
      </m.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[1.35rem] bg-white p-5 ring-1 ring-charcoal/10 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-[1.0625rem] font-medium tracking-[-0.02em] text-charcoal">
            <CalendarCheck className="h-4 w-4 text-forest" aria-hidden="true" />
            Request an appointment
          </h3>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">
            Choose a day and time that suits you. The practice confirms the exact
            appointment with you.
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-mint px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-forest sm:block">
          POPIA
        </span>
      </div>

      {/* Live practice status — the small piece of intelligence that makes a
          website feel like it knows what time it is. */}
      <div
        className={cn(
          "mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-[11px] leading-relaxed",
          calling.open ? "bg-mint text-forest" : "bg-ivory text-ink-soft",
        )}
      >
        <span className="relative mt-1 flex h-1.5 w-1.5 shrink-0">
          {calling.open && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest/60 motion-reduce:hidden" />
          )}
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              calling.open ? "bg-forest" : "bg-ink-muted",
            )}
          />
        </span>
        <span>
          {calling.open ? (
            <>
              <span className="font-medium">The practice is open now.</span> Calling is
              the fastest way to be seen — {practice.phone}.
            </>
          ) : (
            <>
              <span className="font-medium">The practice is closed</span> (Mon–Fri,
              08:00–17:00 SAST). Leave a request and it will be answered the next
              working morning.
            </>
          )}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Full name" htmlFor="enq-name" error={errors.name} required>
          <input
            id="enq-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "enq-name-error" : undefined}
            placeholder="Your name and surname"
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        {/* Requested day */}
        <fieldset>
          <legend className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Preferred day <span className="normal-case tracking-normal">(optional)</span>
          </legend>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            {days.map((iso) => {
              const d = new Date(`${iso}T12:00:00`);
              const selected = date === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    setDate(selected ? "" : iso);
                    setErrors((p) => ({ ...p, date: "" }));
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "flex min-w-[3.1rem] shrink-0 flex-col items-center rounded-xl border px-2 py-2 transition-all duration-300",
                    selected
                      ? "border-forest bg-forest text-white"
                      : "border-charcoal/12 text-ink-soft hover:border-forest/40 hover:text-forest",
                  )}
                >
                  <span className="text-[9px] uppercase tracking-[0.1em] opacity-70">
                    {DAY_LABELS[d.getDay()]}
                  </span>
                  <span className="mt-0.5 text-[14px] font-medium tabular-nums leading-none">
                    {d.getDate()}
                  </span>
                  <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.08em] opacity-70">
                    {d.toLocaleDateString("en-ZA", { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.date && <p className="mt-1.5 text-[11px] text-[#8c3b2e]">{errors.date}</p>}
        </fieldset>

        {/* Requested time */}
        <fieldset>
          <legend className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Preferred time <span className="normal-case tracking-normal">(optional)</span>
          </legend>
          <div className="grid grid-cols-2 gap-1.5">
            {SLOTS.map((option) => {
              const selected = slot === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSlot(selected ? "" : option.value);
                    setErrors((p) => ({ ...p, slot: "" }));
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-xl border px-2.5 py-2 text-left transition-all duration-300",
                    selected
                      ? "border-forest bg-forest text-white"
                      : "border-charcoal/12 text-ink-soft hover:border-forest/40 hover:text-forest",
                  )}
                >
                  <span className="block text-[11.5px] font-medium leading-tight">
                    {option.label}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-[9.5px] tabular-nums",
                      selected ? "text-white/70" : "text-ink-muted",
                    )}
                  >
                    {option.time}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.slot && <p className="mt-1.5 text-[11px] text-[#8c3b2e]">{errors.slot}</p>}
        </fieldset>

        <Field label="What is the appointment for?" htmlFor="enq-service">
          <select
            id="enq-service"
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputClass(false)}
          >
            <option value="">General consultation — not sure yet</option>
            {allServices.map((item) => (
              <option key={item.id} value={item.title}>
                {item.title} ({item.groupLabel})
              </option>
            ))}
          </select>
        </Field>

        <fieldset>
          <legend className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            How should we confirm? *
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Contact method">
            {(["Telephone", "Email", "WhatsApp"] as const).map((method) => {
              const selected = contactMethod === method;
              return (
                <label
                  key={method}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors duration-300",
                    selected
                      ? "border-forest bg-forest text-white"
                      : "border-forest/15 text-ink-soft hover:border-forest/35 hover:text-forest",
                  )}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={selected}
                    onChange={() => setContactMethod(method)}
                    className="sr-only"
                  />
                  {method}
                  {method === "WhatsApp" && (
                    <span className="ml-1 text-[8.5px] uppercase tracking-[0.1em] opacity-70">
                      pending
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field
          label={contactMethod === "Email" ? "Email address" : "Telephone number"}
          htmlFor="enq-contact"
          error={errors.contact}
          required
        >
          <input
            id="enq-contact"
            name="contact"
            type={contactMethod === "Email" ? "email" : "tel"}
            inputMode={contactMethod === "Email" ? "email" : "tel"}
            autoComplete={contactMethod === "Email" ? "email" : "tel"}
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              setErrors((p) => ({ ...p, contact: "" }));
            }}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "enq-contact-error" : undefined}
            placeholder={contactMethod === "Email" ? "you@example.com" : "e.g. 082 000 0000"}
            className={inputClass(Boolean(errors.contact))}
          />
        </Field>

        <Field
          label="Anything else?"
          htmlFor="enq-message"
          hint="Non-clinical only — please do not include symptoms or results."
        >
          <textarea
            id="enq-message"
            name="message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 800))}
            aria-describedby="enq-message-hint"
            placeholder="e.g. First visit — I have a referral letter."
            className={cn(inputClass(false), "resize-none")}
          />
        </Field>

        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
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
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setErrors((p) => ({ ...p, consent: "" }));
              }}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "enq-consent-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-charcoal/30 accent-forest"
            />
            <span className="text-[11.5px] leading-relaxed text-ink-soft">
              I agree that the practice may use these details to respond, in line
              with POPIA. *
            </span>
          </label>
          {errors.consent && (
            <p id="enq-consent-error" className="mt-1.5 text-[11px] text-[#8c3b2e]">
              {errors.consent}
            </p>
          )}
        </div>

        <p className="flex items-start gap-2 rounded-xl bg-ivory px-3 py-2.5 text-[10.5px] leading-relaxed text-ink-soft">
          <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0 text-forest/60" aria-hidden="true" />
          A request is not a confirmed appointment, and this is not a channel for
          urgent or clinical questions.
        </p>

        {notice && (
          <p
            role="alert"
            className="rounded-xl border border-[#c98a7a]/40 bg-[#fdf3ef] px-3 py-2.5 text-[11.5px] leading-relaxed text-[#7d3627]"
          >
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "sending"}
          className="btn btn-forest group w-full justify-between disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "sending" ? (
            <>
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending request
              </span>
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </>
          ) : (
            <>
              Request this appointment
              <i aria-hidden="true">
                <ArrowUpRight className="h-3 w-3" />
              </i>
            </>
          )}
        </button>

        <p className="text-center text-[10.5px] text-ink-soft">
          Prefer to talk?{" "}
          <a
            href={practice.phoneHref}
            className="font-medium text-forest underline decoration-forest/25 underline-offset-2 hover:decoration-forest"
          >
            Call {practice.phone}
          </a>
        </p>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-ivory/60 px-3.5 py-2.5 text-[13px] text-charcoal placeholder:text-ink-muted",
    "transition-colors duration-300 focus:bg-white focus:outline-none",
    hasError ? "border-[#c98a7a] focus:border-[#a8543f]" : "border-charcoal/10 focus:border-forest",
  );
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
  children: React.ReactNode;
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
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[10.5px] leading-relaxed text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[11px] text-[#8c3b2e]">
          {error}
        </p>
      )}
    </div>
  );
}
