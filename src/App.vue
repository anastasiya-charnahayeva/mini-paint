<script setup lang="ts"></script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";

  import { useAuthStore } from "./stores/modules/useAuth";

  import { onAuthStateChanged } from "firebase/auth";
  import fbAuth from "./firebase/index";

  const authStore = useAuthStore();

  const { setCurrentUser } = authStore;

  onMounted(() => {
    onAuthStateChanged(fbAuth, (user) => {
      setCurrentUser(user);
    });
  });
</script>
