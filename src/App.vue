<script setup lang="ts"></script>

<template>
  <Header v-if="user"></Header>
  <RouterView />
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { onMounted } from "vue";
  import { useAuthStore } from "./stores/modules/useAuth";
  import { onAuthStateChanged } from "firebase/auth";
  import { fbAuth } from "./firebase/index";
  import Header from "./components/Header.vue";

  const authStore = useAuthStore();
  const { setCurrentUser } = authStore;
  const { user } = storeToRefs(authStore);

  onMounted(() => {
    onAuthStateChanged(fbAuth, (user) => {
      setCurrentUser(user);
    });
  });
</script>
