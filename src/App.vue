<script setup lang="ts"></script>

<template>
  <Header v-if="user"></Header>
  <RouterView />
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { onMounted } from "vue";
  import { useAuthStore } from "./stores/modules/useAuth";
  import Header from "./components/Header.vue";

  const authStore = useAuthStore();
  const { setCurrentUser, stateUpdate } = authStore;
  const { user } = storeToRefs(authStore);

  onMounted(() => {
    stateUpdate();
  });
</script>
