import { create } from "zustand";

const File = create((set) => ({
  updated: false,
  setUpdate: (update) => {
    set((state) => ({ updated: update }));
  },
}));

export default File;
