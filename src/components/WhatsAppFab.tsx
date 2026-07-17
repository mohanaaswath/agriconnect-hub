import { BUSINESS } from "@/lib/constants";
import { waLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={waLink(`Hello ${BUSINESS.name}, I have a question.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-success text-primary-foreground shadow-glow flex items-center justify-center hover:scale-105 transition"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M20.5 3.5A12 12 0 0 0 3.3 19l-1.3 4.8 5-1.3a12 12 0 0 0 13.6-19zm-8.5 18a10 10 0 0 1-5-1.3l-.4-.2-3 .8.8-2.9-.2-.4A10 10 0 1 1 22 12a10 10 0 0 1-10 9.5zm5.5-7c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0-1.3-.5-2.5-1.5a9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.5.2-.4c.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2c0 1.3 1 2.6 1.1 2.7s2 3 4.8 4.2c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4s.3-1.2.2-1.3z" />
      </svg>
    </a>
  );
}
