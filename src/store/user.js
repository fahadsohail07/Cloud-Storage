import { create } from "zustand";

const User = create((set) => ({
  Userlogged: "loading",
  user: null,

  fetch: async () => {
    console.log(localStorage.getItem("droppy_user"));
    const user = JSON.parse(localStorage.getItem("droppy_user"));
    console.log(user);
    if (!!user && !!user.token) {
      set({ user: user });
      set({ Userlogged: "valid" });
      return;
    }
    set({ user: null });
    set({ Userlogged: "invalid" });
  },

  signedOut: () => {
    set((state) => ({ Userlogged: "invalid" }));
    set((state) => ({ user: null }));
    localStorage.removeItem("droppy_user");
  },
  setUser: (user) => {
    set((state) => ({ user: user }));
    set({ Userlogged: "valid" });
    localStorage.setItem("droppy_user", JSON.stringify(user));
  },
}));

User.getState().fetch();
export default User;
