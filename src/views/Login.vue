<template>
  <section class="bg-gray-400">
    <div class="flex items-center justify-center h-screen">
      <div
        class="rounded-lg shadow-lg w-full max-w-md bg-gray-800 border-gray-700"
      >
        <div class="p-6 text-white">
          <h1 class="text-xl font-bold md:text-2xl py-2 mb-2">
            Sign in to your account
          </h1>
          <div
            v-if="show_alert"
            class="text-white text-center font-bold p-4 mb-4 rounded-lg"
            :class="alert_variant"
          >
            {{ alert_msg }}
          </div>
          <form class="space-y-6" @submit.prevent="login">
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
              Sign In
            </button>
            <p class="text-sm font-light text-gray-400">
              Don’t have an account yet?
              <router-link
                to="/register"
                class="font-medium hover:underline text-blue-500"
                >Sign up</router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useAuthStore } from "../stores/modules/useAuth";
  import { reactive, ref } from "vue";
  import { useRouter } from "vue-router";

  const form = reactive({
    email: "",
    password: "",
  });

  const show_alert = ref<boolean>(false);
  const alert_variant = ref<string>("bg-blue-500");
  const alert_msg = ref<string>("Please wait! We are logging you in");

  const auth = useAuthStore();
  const router = useRouter();

  async function login() {
    show_alert.value = true;
    alert_variant.value = "bg-blue-500";
    alert_msg.value = "Please wait! We are logging you in.";

    try {
      await auth.signInUser(form);
    } catch (error) {
      show_alert.value = true;
      alert_variant.value = "bg-red-500";
      alert_msg.value = "Invalid login details.";
      return;
    }
    alert_variant.value = "bg-green-500";
    alert_msg.value = "Success! You are now logged in.";
    router.push({ path: "/home" });
  }
</script>
