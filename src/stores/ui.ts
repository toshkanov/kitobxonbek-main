"use client";

import { create } from "zustand";

interface UiState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isCommandPaletteOpen: boolean;
  setMobileMenu: (open: boolean) => void;
  setSearch: (open: boolean) => void;
  setCommandPalette: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCommandPaletteOpen: false,
  setMobileMenu: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setSearch: (isSearchOpen) => set({ isSearchOpen }),
  setCommandPalette: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
}));
