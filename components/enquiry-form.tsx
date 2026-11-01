"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Loader2, ShieldAlert } from "lucide-react";
import { useRef, useState } from "react";
import { practice } from "@/lib/practice";
import { cn } from "@/lib/utils";

type Fields = {
  name: string;
  contactMethod: "Telephone" | "Email" | "WhatsApp";
  contact: string;
  preferred: "Any time" | "Morning" | "Afternoon";
  message: string;
  consent: boolean;
  company: string;
};

const initial: Fields = {
  name: "",
  contactMethod: "Telephone",
  contact: "",
  preferred: "Any time",
  message: "",
  consent: false,
  company: "",
};

const methods: Fields["contactMethod"][] = ["Telephone", "Email", "WhatsApp"];

export function EnquiryForm() {
  const [fields, setFields] = useState<Fields>(initial);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const reduce = useReducedMotion();

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setNotice(null);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const next: Record<string, string> = {};
    if (fields.name.trim().length < 2) next.name = "Please tell us your name.";
    if (fields.contact.trim().length < 6)
      next.contact =
        fields.contactMethod === "Email"
          ? "Please check that email address."
          : "Please check that telephone number.";
    if (!fields.consent)
      next.consent = "Please confirm that the practice may use these details to respond.";

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setState("sending");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, startedAt: startedAt.current }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        errors?: Record<string, string>;
        error?: string;
      };

      if (data.ok) {
        setState("sent");
        setFields(initial);
        return;
      }

      setState("idle");
      if (data.errors) setErrors(data.errors);
      setNotice(data.error ?? "We could not send that enquiry. Please call the practice.");
    } catch {
      setState("idle");
      setNotice(
        "We could not reach the practice server. Please call 011 842 7651 or email chrisscrcross2013@gmail.com.",
      );
    }
  }

  if (state === "sent") {
    return (
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-[1.25rem] border border-charcoal/10 bg-white p-7"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-[1.125rem] font-medium tracking-[-0.02em] text-forest">
          Enquiry received
        </h3>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-charcoal/68">
          Thank you — the practice will respond using the contact details you
          provided. This is an enquiry, not a confirmed appointment; the practice
          will confirm your date and time directly.
        </p>
        <p className="mt-4 text-[11.5px] leading-relaxed text-charcoal/55">
          If your concern is urgent, please contact Life Roseacres Hospital or
          your nearest emergency department rather than waiting for a reply.
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            startedAt.current = Date.now();
          }}
          className="mt-5 text-[0.8125rem] font-medium text-forest underline decoration-forest/25 underline-offset-4 hover:decoration-forest"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="h-full rounded-[1.25rem] border border-charcoal/10 bg-white p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[1.0625rem] font-normal tracking-[-0.02em] text-charcoal">
            Appointment enquiry
          </h3>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-charcoal/62">
            Takes under a minute. Fields marked * are required.
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-mint px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-forest sm:block">
          POPIA
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label="Full name"
          htmlFor="enq-name"
          error={errors.name}
          required
        >
          <input
            id="enq-name"
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "enq-name-error" : undefined}
            placeholder="Your name and surname"
            className={inputClass(Boolean(errors.name))}
          />
        </Field>

        <fieldset>
          <legend className="mb-1.5 block text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/45">
            How should we reach you? *
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferred contact method">
            {methods.map((method) => {
              const selected = fields.contactMethod === method;
              return (
                <label
                  key={method}
                  className={cn(
                    "cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.6875rem] font-medium transition-colors duration-300",
                    selected
                      ? "border-forest bg-forest text-white"
                      : "border-forest/15 text-charcoal/68 hover:border-forest/35 hover:text-forest",
                  )}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={selected}
                    onChange={() => update("contactMethod", method)}
                    className="sr-only"
                  />
                  {method}
                  {method === "WhatsApp" && (
                    <span className="ml-1 text-[0.5625rem] uppercase tracking-[0.1em] opacity-70">
                      pending
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <Field
          label={fields.contactMethod === "Email" ? "Email address" : "Telephone number"}
          htmlFor="enq-contact"
          error={errors.contact}
          required
        >
          <input
            id="enq-contact"
            name="contact"
            type={fields.contactMethod === "Email" ? "email" : "tel"}
            inputMode={fields.contactMethod === "Email" ? "email" : "tel"}
            autoComplete={fields.contactMethod === "Email" ? "email" : "tel"}
            value={fields.contact}
            onChange={(e) => update("contact", e.target.value)}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? "enq-contact-error" : undefined}
            placeholder={
              fields.contactMethod === "Email" ? "you@example.com" : "e.g. 082 000 0000"
            }
            className={inputClass(Boolean(errors.contact))}
          />
        </Field>

        <Field label="Preferred time of day" htmlFor="enq-preferred">
          <select
            id="enq-preferred"
            name="preferred"
            value={fields.preferred}
            onChange={(e) => update("preferred", e.target.value as Fields["preferred"])}
            className={inputClass(false)}
          >
            <option>Any time</option>
            <option>Morning</option>
            <option>Afternoon</option>
          </select>
        </Field>

        <Field
          label="Anything the practice should know?"
          htmlFor="enq-message"
          hint="Non-clinical only — do not include symptoms, results or medical details."
        >
          <textarea
            id="enq-message"
            name="message"
            rows={3}
            value={fields.message}
            onChange={(e) => update("message", e.target.value.slice(0, 800))}
            aria-describedby="enq-message-hint"
            placeholder="e.g. I would like to book a first consultation."
            className={cn(inputClass(false), "resize-none")}
          />
        </Field>

        {/* Honeypot — hidden from people, visible to naive bots */}
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
          <label htmlFor="enq-company">Company</label>
          <input
            id="enq-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={fields.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              name="consent"
              checked={fields.consent}
              onChange={(e) => update("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "enq-consent-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-charcoal/30 accent-forest"
            />
            <span className="text-[0.75rem] leading-relaxed text-charcoal/68">
              I agree that the practice may use these details to respond to my
              enquiry, in line with POPIA. *
            </span>
          </label>
          {errors.consent && (
            <p id="enq-consent-error" className="mt-1.5 text-[0.6875rem] text-[#8c3b2e]">
              {errors.consent}
            </p>
          )}
        </div>

        <p className="flex items-start gap-2 rounded-xl bg-ivory px-3 py-2.5 text-[0.6875rem] leading-relaxed text-charcoal/62">
          <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0 text-forest/60" aria-hidden="true" />
          Submitting this form does not constitute a confirmed appointment, and
          it is not a channel for urgent or clinical questions.
        </p>

        <AnimatePresence>
          {notice && (
            <motion.p
              initial={reduce ? undefined : { opacity: 0, height: 0 }}
              animate={reduce ? undefined : { opacity: 1, height: "auto" }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              role="alert"
              className="rounded-xl border border-[#c98a7a]/40 bg-[#fdf3ef] px-3 py-2.5 text-[0.75rem] leading-relaxed text-[#7d3627]"
            >
              {notice}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={state === "sending"}
          className="btn btn-forest group w-full justify-between disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending enquiry
            </>
          ) : (
            <>
              Send enquiry
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>

        <p className="text-center text-[0.6875rem] text-charcoal/55">
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
    "w-full rounded-xl border bg-ivory/60 px-3.5 py-2.5 text-[0.875rem] text-charcoal placeholder:text-charcoal/45",
    "transition-colors duration-300 focus:bg-white focus:outline-none",
    hasError
      ? "border-[#c98a7a] focus:border-[#a8543f]"
      : "border-charcoal/10 focus:border-forest",
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
        className="mb-1.5 block text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/45"
      >
        {label} {required && "*"}
      </label>
      {children}
      {hint && (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[0.6875rem] leading-relaxed text-charcoal/55">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[0.6875rem] text-[#8c3b2e]">
          {error}
        </p>
      )}
    </div>
  );
}
