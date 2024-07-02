import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./useAuth";
import { store } from "../../firebase/index";
import type { DocumentData } from "firebase/firestore";
import { addDoc, getDocs, collection } from "firebase/firestore";

interface ImgData {
  email: string;
  uid: string;
  url: string;
  userId: string;
}

interface Owner {
  email: string;
  userId: string;
}

export const useImagesStore = defineStore("images", () => {
  const allImgs = ref<ImgData[]>([]);
  const imgsOwners = ref<Array<Owner>>([]);
  const chosenUser = ref("");

  const authStore = useAuthStore();
  const { user } = authStore;

  async function addImage(url: string) {
    try {
      const docRef = await addDoc(collection(store, "images"), {
        url: url,
        userId: user.uid,
        email: user.email,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function getImages() {
    const querySnapshot = await getDocs(collection(store, "images"));
    querySnapshot.forEach((doc: DocumentData) => {
      allImgs.value.push(doc.data());
    });
    updateOwners();
  }

  function updateOwners() {
    allImgs.value.forEach((image) => {
      const data = { userId: image.userId, email: image.email };
      if (!imgsOwners.value.some((el) => el.email === data.email)) {
        imgsOwners.value.push(data);
      }
    });
  }

  function getImg() {
    const filteredImgs = chosenUser.value
      ? allImgs.value.filter((img) => img.email === chosenUser.value)
      : allImgs.value;
    return filteredImgs;
  }

  function filterByUser() {
    if (chosenUser.value) {
      return getImg();
    }
  }

  return {
    getImg,
    addImage,
    getImages,
    chosenUser,
    imgsOwners,
    filterByUser,
  };
});
