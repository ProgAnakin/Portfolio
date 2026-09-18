import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { projects, type Project } from '../data/projects';

interface ShopState {
  /** The product sheet currently open, if any. */
  openProject: Project | null;
  open: (id: string) => void;
  close: () => void;
  /**
   * The basket: every project opened during this visit, in the order it was
   * opened. This is what the till prints — the receipt is a record of what the
   * visitor actually picked up, not a brochure.
   */
  basket: Project[];
  /** Seconds spent in the shop, sampled when the receipt is printed. */
  timeInShop: () => number;
}

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [basketIds, setBasketIds] = useState<string[]>([]);
  const arrivedAt = useRef(Date.now());

  const open = useCallback((id: string) => {
    setOpenId(id);
    setBasketIds((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const close = useCallback(() => setOpenId(null), []);

  const value = useMemo<ShopState>(() => {
    const byId = (id: string) => projects.find((project) => project.id === id);
    return {
      openProject: openId ? (byId(openId) ?? null) : null,
      open,
      close,
      basket: basketIds.map(byId).filter((p): p is Project => Boolean(p)),
      timeInShop: () => Math.round((Date.now() - arrivedAt.current) / 1000),
    };
  }, [openId, basketIds, open, close]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside <ShopProvider>');
  return context;
}
