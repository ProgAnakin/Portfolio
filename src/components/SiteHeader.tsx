import { profile } from '../data/profile';

/**
 * The impatient-recruiter escape hatch: a fixed strip of plain text links so
 * nobody has to explore a drawing to find the work, the background or a way
 * to get in touch.
 */
export function SiteHeader({ onPrintReceipt }: { onPrintReceipt: () => void }) {
  const link =
    'text-paper-500 hover:text-paper-100 focus-visible:text-paper-100 transition-colors cursor-pointer';

  return (
    <div className="border-ink-600/70 bg-ink-800/85 fixed inset-x-0 top-0 z-40 border-b backdrop-blur-sm print:hidden">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <p className="font-till text-paper-300 truncate text-[0.58rem] tracking-[0.16em] uppercase sm:text-[0.64rem]">
          {profile.name}
          <span className="text-paper-500 hidden sm:inline"> — sales &amp; product</span>
        </p>

        <nav aria-label="Primary">
          <ul className="font-till flex items-center gap-3 text-[0.58rem] tracking-[0.14em] uppercase sm:gap-5 sm:text-[0.64rem]">
            <li>
              <a href="#projects" className={link}>
                Projects
              </a>
            </li>
            <li>
              <a href="#about" className={link}>
                About
              </a>
            </li>
            <li>
              <a href="#contact" className={link}>
                Contact
              </a>
            </li>
            <li>
              <button type="button" onClick={onPrintReceipt} className={`${link} text-amber-300`}>
                Receipt
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
