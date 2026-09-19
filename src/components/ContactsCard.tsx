import { contacts } from '../data/profile';

/** The note by the telephone. Same card in the room and in the drawing. */
export function ContactsCard() {
  return (
    <div className="bg-paper-100 text-ink-900 relative w-[15rem] -rotate-[1.6deg] p-3 shadow-[0_10px_24px_rgba(12,10,9,0.7)]">
      <p className="font-till border-ink-900/25 mb-2 border-b pb-1.5 text-[0.6rem] tracking-[0.16em] uppercase">
        Ask for Costanzo
      </p>
      <ul className="space-y-1.5">
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.href ? (
              <a
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                className="decoration-accent hover:text-accent block text-sm underline decoration-2 underline-offset-2"
              >
                <span className="font-till mr-1.5 text-[0.6rem] tracking-[0.12em] uppercase opacity-60">
                  {contact.label}
                </span>
                <span className="break-all">{contact.value}</span>
              </a>
            ) : (
              <p className="block text-sm opacity-70">
                <span className="font-till mr-1.5 text-[0.6rem] tracking-[0.12em] uppercase opacity-70">
                  {contact.label}
                </span>
                <span>{contact.value}</span>
              </p>
            )}
          </li>
        ))}
      </ul>
      <span aria-hidden="true" className="bg-accent absolute -top-1.5 left-8 size-3 rounded-full" />
    </div>
  );
}
