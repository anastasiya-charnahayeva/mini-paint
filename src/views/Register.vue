<template>
  <section class="bg-gray-900">
    <div class="flex items-center justify-center h-screen">
      <div
        class="rounded-lg shadow-lg w-full max-w-md bg-gray-800 border-gray-700"
      >
        <div class="p-6 text-white">
          <h1 class="text-xl font-bold md:text-2xl py-2 mb-2">
            Create account
          </h1>
          <div
            v-if="show_alert"
            class="text-white text-center font-bold p-4 mb-4 rounded-lg"
            :class="alert_variant"
          >
            {{ alert_msg }}
          </div>
          <form class="space-y-6" @submit.prevent="register">
            <div>
              <label for="name" class="block mb-2 text-sm font-medium">
                Your name</label
              >
              <input
                id="name"
                v-model="form.name"
                type="text"
                name="name"
                class="border text-sm rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Smith"
                required
              />
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium">
                Your email</label
              >
              <input
                id="email"
                v-model="form.email"
                type="email"
                name="email"
                class="border text-sm rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium"
                >Password</label
              >
              <input
                id="password"
                v-model="form.password"
                type="password"
                name="password"
                placeholder="••••••••"
                class="border text-sm rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Create an account
            </button>
            <p class="text-sm font-light text-gray-400">
              Already have an account?
              <router-link
                to="/"
                class="font-medium hover:underline text-blue-500"
                >Login here</router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { useAuthStore } from "../stores/modules/useAuth";
  import { reactive, ref } from "vue";
  import { useRouter } from "vue-router";

  const form = reactive({
    name: "",
    email: "",
    password: "",
  });

  const show_alert = ref<boolean>(false);
  const alert_variant = ref<string>("bg-blue-500");
  const alert_msg = ref<string>("Please wait! Your account is being created.");

  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const { createUser } = authStore;
  const router = useRouter();

  async function register() {
    show_alert.value = true;
    alert_variant.value = "bg-blue-500";
    alert_msg.value = "Please wait! Your account is being created.";

    try {
      await createUser(form);
    } catch (error) {
      show_alert.value = true;
      alert_variant.value = "bg-red-500";
      alert_msg.value = "An unexpected error occurred. Please try again later.";
      return;
    }
    alert_variant.value = "bg-green-500";
    alert_msg.value = "Success! Your account is created.";
    if (user.value) router.push({ path: "/" });
  }
</script>
