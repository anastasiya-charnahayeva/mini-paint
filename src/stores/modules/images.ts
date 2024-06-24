import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./useAuth";
import { store } from "../../firebase/index";
import { addDoc, getDocs, collection } from "firebase/firestore";

export const useImagesStore = defineStore(
  "images",
  () => {
    const images = ref();

    const authStore = useAuthStore();
    const { user } = authStore;

    async function addImage(url: string) {
      try {
        const docRef = await addDoc(collection(store, "images"), {
          url: url,
          userId: user.uid,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

    async function getImages() {
      const userCredential = await getDocs(collection(store, "images"));
    }

    // async function filterByUser() {

    // }

    return {
      images,
      addImage,
      getImages,
      //   filterByUser,
    };
  },
  {
    persist: true,
  },
);
