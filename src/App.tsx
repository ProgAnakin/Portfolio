import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GrainOverlay } from './components/GrainOverlay';
import { ProductSheet } from './components/ProductSheet';
import { ReadableIndex } from './components/ReadableIndex';
import { Receipt } from './components/Receipt';
import { ReceiptNudge } from './components/ReceiptNudge';
import { ShopMenu } from './components/ShopMenu';
import { SceneDefs } from './components/shop/SceneDefs';
import { ShopStage } from './components/ShopStage';
import { ShopProvider, useShop } from './state/ShopContext';

function Shop() {
  const { openProject, close, basket, timeInShop, markReceiptTaken } = useShop();
  const [receipt, setReceipt] = useState<{ seconds: number } | null>(null);

  // Printing is what settles the visit, so it is also what stops the shop
  // asking about it on the way out.
  const printReceipt = () => {
    markReceiptTaken();
    setReceipt({ seconds: timeInShop() });
  };

  return (
    <>
      <a
        href="#projects"
        className="bg-paper-100 text-ink-900 font-till sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:px-3 focus:py-2 focus:text-xs focus:uppercase"
      >
        Skip to the projects
      </a>

      <ShopMenu onPrintReceipt={printReceipt} />

      <main>
        <ShopStage onPrintReceipt={printReceipt} />
        <ReadableIndex />
      </main>

      <ReceiptNudge onPrint={printReceipt} />

      <AnimatePresence>
        {openProject && <ProductSheet key="sheet" project={openProject} onClose={close} />}
      </AnimatePresence>

      <AnimatePresence>
        {receipt && (
          <Receipt
            key="receipt"
            basket={basket}
            seconds={receipt.seconds}
            onClose={() => setReceipt(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <SceneDefs />
      <Shop />
      <GrainOverlay />
    </ShopProvider>
  );
}
