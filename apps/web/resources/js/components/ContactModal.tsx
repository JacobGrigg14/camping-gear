import { site } from "@basecamp/shared";
import { useEffect, useRef, useState } from "react";

/** Sets the content's staggered fade-in order (see .contact-rise in app.css). */
const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Length of the exit animation (contact-out in app.css). */
const CLOSE_MS = 220;

/** Fired by `openContact()`; the modal lives once in the site layout. */
const OPEN_EVENT = "open-contact";

/** Opens the contact popup from anywhere (footer, legal pages, …). */
export function openContact() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * Contact popup. A native <dialog> (focus trap, Escape, inert page behind it) with the
 * animations in app.css under "Contact dialog". Also opens for /#contact links.
 */
export function ContactModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  /** Bumped on every open/close so a stale close can't shut a reopened dialog. */
  const closeId = useRef(0);

  useEffect(() => {
    const open = () => {
      const el = dialog.current;
      if (!el) return;
      closeId.current++;
      delete el.dataset.state;
      if (el.open) return;
      el.showModal();
    };
    const openFromHash = () => {
      if (location.hash === "#contact") open();
    };
    openFromHash();
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener("hashchange", openFromHash);
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  /**
   * Plays the exit animation, then closes the dialog for real. Waits for whichever comes first,
   * the animation finishing or a timeout, since hidden tabs may never report the animation's end.
   */
  function close() {
    const el = dialog.current;
    if (!el?.open || el.dataset.state === "closing") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    el.dataset.state = "closing";
    const id = ++closeId.current;
    const done = () => id === closeId.current && finishClose();
    void Promise.all(el.getAnimations().map((a) => a.finished)).then(done, done);
    setTimeout(done, CLOSE_MS + 80);
  }

  function finishClose() {
    const el = dialog.current;
    if (!el) return;
    closeId.current++;
    el.close();
    delete el.dataset.state;
    setCopied(false);
    if (location.hash === "#contact") history.replaceState(history.state, "", location.pathname + location.search);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.contactEmail);
      setCopied(true);
    } catch {
      // Clipboard blocked; the mailto link still works.
    }
  }

  return (
    <dialog
      ref={dialog}
      id="contact-dialog"
      aria-labelledby="contact-title"
      className="contact-dialog"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      // A click on the dialog element itself (not the card) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="overflow-hidden rounded-t-2xl border-b-4 border-bark-700 bg-canvas-50 shadow-2xl sm:rounded-2xl">
        <div className="relative h-40 overflow-hidden bg-forest-900 text-canvas-50">
          <span
            className="contact-sun absolute top-12 right-16 h-14 w-14 rounded-full bg-ember-500"
            aria-hidden="true"
          />
          <svg
            className="absolute inset-x-0 bottom-0 h-24 w-full"
            viewBox="0 0 400 96"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon
              className="contact-ridge contact-ridge-back"
              points="0,96 0,58 70,16 130,62 200,8 270,56 330,22 400,60 400,96"
              fill="#2f4430"
            />
            <polygon
              className="contact-ridge contact-ridge-front"
              points="0,96 0,80 90,44 160,86 240,40 320,82 400,52 400,96"
              fill="#3f5a3c"
            />
          </svg>
          <div className="relative px-6 pt-6">
            <p
              className="contact-rise text-xs font-semibold tracking-[0.2em] text-ember-500 uppercase"
              style={stagger(0)}
            >
              Contact
            </p>
            <h2 id="contact-title" className="contact-rise mt-1 text-3xl font-extrabold" style={stagger(1)}>
              Get in touch
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full text-2xl leading-none text-canvas-200 transition hover:rotate-90 hover:bg-forest-800 hover:text-canvas-50"
          >
            ×
          </button>
        </div>

        <div className="space-y-5 px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="contact-rise leading-relaxed text-bark-700" style={stagger(2)}>
            A question about a product, a broken link, a gear idea or a privacy request? Send us a note and we&apos;ll
            get back to you.
          </p>

          <div
            className="contact-rise flex items-center gap-2 rounded-lg border border-canvas-200 bg-white p-2 pl-4"
            style={stagger(3)}
          >
            <a
              href={`mailto:${site.contactEmail}`}
              className="min-w-0 flex-1 truncate font-semibold text-forest-700 hover:text-ember-600"
            >
              {site.contactEmail}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="shrink-0 rounded-md border border-canvas-300 px-3 py-1.5 text-sm font-semibold text-bark-700 transition hover:bg-canvas-100"
              aria-live="polite"
            >
              {copied ? <span className="contact-pop inline-block text-forest-700">Copied ✓</span> : "Copy"}
            </button>
          </div>

          <a
            href={`mailto:${site.contactEmail}`}
            className="contact-rise group flex items-center justify-center gap-2 rounded-md bg-ember-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-ember-600"
            style={stagger(4)}
          >
            Email us
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>

          <p className="contact-rise text-sm text-bark-500" style={stagger(5)}>
            We don&apos;t sell gear ourselves, so for orders, shipping or returns please contact the retailer you bought
            from.
          </p>
        </div>
      </div>
    </dialog>
  );
}
