"use client";

/**
 * Animated Drawer — Spectrum UI / 21st.dev (arihantcodes).
 * Installed via: npx shadcn@latest add @spectrumui/animated-drawer
 * (21st URL requires API_KEY_21ST; Spectrum registry works without it.)
 */

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";
import useMeasure from "react-use-measure";
import { motion } from "motion/react";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import {
  BannedIcon,
  DangerIcon,
  FaceIDIcon,
  LockIcon,
  PassIcon,
  PhraseIcon,
  RecoveryPhraseIcon,
  ShieldIcon,
  WarningIcon,
} from "@/shared/demo";

export function AnimatedDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("default");
  const [elementRef, bounds] = useMeasure();

  useEffect(() => {
    if (!isOpen) setView("default");
  }, [isOpen]);

  const content = useMemo(() => {
    switch (view) {
      case "default":
        return (
          <div>
            <div className="flex w-full items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                Wallet Settings
              </h2>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X
                  className="text-neutral-600 dark:text-neutral-400"
                  size={18}
                />
              </Button>
            </div>

            <div className="mt-6 flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => setView("key")}
                className="flex w-full items-center gap-2 rounded-2xl bg-neutral-100 px-4 py-3.5 font-medium text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <LockIcon />
                View Private Key
              </button>
              <button
                type="button"
                onClick={() => setView("pharse")}
                className="flex w-full items-center gap-2 rounded-2xl bg-neutral-100 px-4 py-3.5 font-medium text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <PassIcon />
                View Recovery Phrase
              </button>
              <button
                type="button"
                onClick={() => setView("remove")}
                className="flex w-full items-center gap-2 rounded-2xl bg-red-50 px-4 py-3.5 font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <WarningIcon />
                Remove Wallet
              </button>
            </div>
          </div>
        );
      case "remove":
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <DangerIcon />
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X
                  className="text-neutral-600 dark:text-neutral-400"
                  size={18}
                />
              </Button>
            </div>
            <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Remove Wallet?
            </h2>
            <p className="text-lg font-light text-neutral-500 dark:text-neutral-400">
              This action cannot be undone. Make sure you&apos;ve backed up your
              recovery phrase before proceeding. You&apos;ll lose access to all
              funds if you don&apos;t have a backup.
            </p>
            <div className="flex items-center justify-start gap-4">
              <Button
                onClick={() => setView("default")}
                className="h-12 w-36 rounded-3xl bg-neutral-200 text-lg text-neutral-900 transition-colors hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setView("default")}
                className="h-12 w-36 rounded-3xl bg-red-500 text-lg text-white transition-colors hover:bg-red-600"
              >
                Remove
              </Button>
            </div>
          </div>
        );
      case "pharse":
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <RecoveryPhraseIcon />
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X
                  className="text-neutral-600 dark:text-neutral-400"
                  size={18}
                />
              </Button>
            </div>
            <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Recovery Phrase
            </h2>
            <p className="text-lg font-light text-neutral-500 dark:text-neutral-400">
              Your recovery phrase is the master key to your wallet. Write it
              down and store it securely. Anyone with this phrase can access
              your funds.
            </p>
            <div className="space-y-5 border-t border-neutral-200 text-lg text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              <div className="mt-5 flex items-center gap-4">
                <ShieldIcon />
                <h3>Store it in a secure location</h3>
              </div>
              <div className="flex items-center gap-4">
                <PhraseIcon />
                <h3>Never share with anyone</h3>
              </div>
              <div className="flex items-center gap-4">
                <BannedIcon />
                <h3>We cannot recover it for you</h3>
              </div>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Button
                onClick={() => setView("default")}
                className="h-12 w-36 rounded-3xl bg-neutral-200 text-lg text-neutral-900 transition-colors hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setView("default")}
                className="flex h-12 w-42 items-center gap-3 rounded-3xl bg-sky-400 text-lg text-white transition-colors hover:bg-sky-500"
              >
                <FaceIDIcon />
                Show Phrase
              </Button>
            </div>
          </div>
        );
      case "key":
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <RecoveryPhraseIcon />
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                <X
                  className="text-neutral-600 dark:text-neutral-400"
                  size={18}
                />
              </Button>
            </div>
            <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
              Private Key
            </h2>
            <p className="text-lg font-light text-neutral-500 dark:text-neutral-400">
              Your private key is a cryptographic key that proves ownership of
              your wallet. Treat it with the same security as your bank account
              details.
            </p>
            <div className="space-y-5 border-t border-neutral-200 text-lg text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              <div className="mt-5 flex items-center gap-4">
                <ShieldIcon />
                <h3>Store it in a secure location</h3>
              </div>
              <div className="flex items-center gap-4">
                <PhraseIcon />
                <h3>Never share with anyone</h3>
              </div>
              <div className="flex items-center gap-4">
                <BannedIcon />
                <h3>We cannot recover it for you</h3>
              </div>
            </div>
            <div className="flex items-center justify-start gap-4">
              <Button
                onClick={() => setView("default")}
                className="h-12 w-36 rounded-3xl bg-neutral-200 text-lg text-neutral-900 transition-colors hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setView("default")}
                className="flex h-12 w-42 items-center gap-3 rounded-3xl bg-sky-400 text-lg text-white transition-colors hover:bg-sky-500"
              >
                <FaceIDIcon />
                Show Key
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [view]);

  return (
    <>
      <Button
        className="mt-5 rounded-full border border-neutral-200 bg-white px-6 py-2 font-medium text-black transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 md:font-medium"
        onClick={() => setIsOpen(true)}
      >
        Click Me To Open Drawer
      </Button>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
          <Drawer.Overlay
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <Drawer.Content
            asChild
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-white outline-none md:mx-auto md:w-full dark:bg-neutral-900"
          >
            <motion.div
              animate={{
                height: bounds.height > 0 ? bounds.height : "auto",
              }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            >
              <div className="p-6" ref={elementRef}>
                {content}
              </div>
            </motion.div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
