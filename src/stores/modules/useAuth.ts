import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "../firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref();

    async function createUser(values: { email: string; password: string }) {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      user.value = userCredential.user;
    }

    async function signInUser(values: { email: string; password: string }) {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      user.value = userCredential.user;

      localStorage.setItem("token", userCredential.user?.accessToken);
      localStorage.setItem("uid", userCredential.user?.uid);
    }

    async function signOutUser() {
      const auth = getAuth();
      await signOut(auth);
      user.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
    }

    return {
      user,
      createUser,
      signInUser,
      signOutUser,
    };
  },
  {
    persist: true,
  },
);
