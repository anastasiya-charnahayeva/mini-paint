<template>
  <header class="bg-gray-900">
    <nav class="container mx-auto p-4 flex justify-end text-white">
      <div class="flex-1">
        <router-link to="/" class="hover:text-blue-500"> Home </router-link>
      </div>
      <div class="flex-1">
        <router-link to="/paint" class="hover:text-blue-500">
          Paint
        </router-link>
      </div>
      <button class="hover:text-blue-500" @click="signOut">Sign Out</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
  import { useAuthStore } from "../stores/modules/useAuth";
  import { useRouter } from "vue-router";
  const { signOutUser } = useAuthStore();
  const router = useRouter();

  async function signOut() {
    await signOutUser();
    router.push({ path: "/login" });
  }
</script>
