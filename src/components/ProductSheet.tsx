import { motion, useReducedMotion } from 'framer-motion';
import { Modal } from './Modal';
import { ProjectDetail } from './ProjectDetail';
import type { Project } from '../data/projects';

/**
 * The spec sheet you get handed when you pick a product off the shelf.
 *
 * The sheet itself is `ProjectDetail` — the same markup the casebook lays out
 * flat further down the page. This is the modal around it: the way in, the way
 * out, and the animation between.
 */
export function ProductSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const prefersReduced = useReducedMotion();

  return (
    <Modal onClose={onClose} labelledBy="sheet-heading">
      <motion.article
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        className="bg-ink-700 border-ink-500 relative overflow-hidden border shadow-[0_24px_60px_rgba(12,10,9,0.8)]"
      >
        <ProjectDetail project={project} as="h2" headingId="sheet-heading" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Put it back on the shelf"
          className="absolute top-3 right-3 cursor-pointer p-2 text-lg leading-none opacity-70 transition-opacity hover:opacity-100"
          style={{ color: project.brand.paper }}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </motion.article>
    </Modal>
  );
}
