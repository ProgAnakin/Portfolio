import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
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
  /** True once the till has printed. Stops the shop nagging about it. */
  receiptTaken: boolean;
  markReceiptTaken: () => void;
  /**
   * Whether the store directory is open.
   *
   * It lives here because two siblings need the same answer: the tag that
   * opens it, and the menu board it opens on top of. Both hang in the
   * right-hand corner — the directory by choice, the board because that is
   * where the counter is — and a sheet of paper landing squarely on a lit
   * panel reads as a collision. So the board steps back while the card is
   * out, which is what a second panel in one corner has to do.
   */
  directoryOpen: boolean;
  setDirectoryOpen: Dispatch<SetStateAction<boolean>>;
}

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [basketIds, setBasketIds] = useState<string[]>([]);
  const [receiptTaken, setReceiptTaken] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
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
      receiptTaken,
      markReceiptTaken: () => setReceiptTaken(true),
      directoryOpen,
      setDirectoryOpen,
    };
  }, [openId, basketIds, open, close, receiptTaken, directoryOpen]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside <ShopProvider>');
  return context;
}
