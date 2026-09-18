import { motion, useReducedMotion } from 'framer-motion';
import { Modal } from './Modal';
import { statusLabel, type Project } from '../data/projects';
import { tintVars } from '../lib/tints';
import { productArt } from './shop/products';

/** The spec card you get handed when you pick a product off the shelf. */
export function ProductSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const prefersReduced = useReducedMotion();
  const Art = productArt[project.shape];
  const soldOut = project.status === 'out-of-stock';

  return (
    <Modal onClose={onClose} labelledBy="sheet-heading">
      <motion.article
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        className="bg-ink-700 border-ink-500 relative border shadow-[0_24px_60px_rgba(12,10,9,0.75)]"
      >
        {/* Header: the product, lit, next to its label. */}
        <div className="border-ink-500 flex items-end gap-5 border-b px-6 pt-7 pb-5 sm:px-8">
          <div
            className="relative flex w-20 shrink-0 items-end justify-center sm:w-24"
            style={tintVars(project.brand.base, !soldOut)}
            aria-hidden="true"
          >
            <div className="from-amber-400/22 absolute inset-x-0 -top-6 h-24 bg-gradient-to-b to-transparent blur-md" />
            <Art lit={!soldOut} className="relative block h-24 w-auto sm:h-28" />
          </div>

          <div className="min-w-0 pb-1">
            <p
              className={[
                'font-till text-[0.58rem] tracking-[0.2em] uppercase',
                soldOut ? 'text-accent' : 'text-amber-300',
              ].join(' ')}
            >
              {statusLabel[project.status]}
            </p>
            <h2 id="sheet-heading" className="font-sign text-paper-100 mt-1 text-3xl sm:text-4xl">
              {project.name}
            </h2>
            <p className="text-paper-500 mt-1 text-sm">{project.tagline}</p>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          <p className="text-paper-300 leading-relaxed">{project.description}</p>

          <div>
            <h3 className="font-till text-paper-500 text-[0.58rem] tracking-[0.2em] uppercase">
              My role
            </h3>
            <p className="text-paper-300 mt-1.5">{project.role}</p>
          </div>

          <div>
            <h3 className="font-till text-paper-500 text-[0.58rem] tracking-[0.2em] uppercase">
              Stack
            </h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="font-till border-ink-500 text-paper-300 border px-2 py-1 text-[0.62rem] tracking-[0.06em]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {project.links.length > 0 && (
            <div>
              <h3 className="font-till text-paper-500 text-[0.58rem] tracking-[0.2em] uppercase">
                Links
              </h3>
              <ul className="mt-2 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-300 decoration-amber-300/50 hover:text-accent hover:decoration-accent underline decoration-2 underline-offset-4 transition-colors"
                    >
                      {link.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Put it back on the shelf"
          className="text-paper-500 hover:text-paper-100 absolute top-3 right-3 cursor-pointer p-2 text-lg leading-none transition-colors"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </motion.article>
    </Modal>
  );
}
