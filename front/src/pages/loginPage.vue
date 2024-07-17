<template>
  <q-layout view="lHh Lpr lFf">
    <div
      class="q-gutter-lg column items-center justify-center"
      style="height: 100vh"
    >
      <div class="q-gutter-md" style="max-width: 300px; text-align: center">
        <h1 class="title-font">Instagroum</h1>
        <div>
          <q-input
            outlined
            rounded
            standout="bg-grey-4 text-grey-8"
            v-model="username"
            label="Username"
            @keydown.enter="login"
          />

          <br />
          <q-input
            outlined
            rounded
            standout="bg-grey-4 text-grey-8"
            v-model="password"
            type="password"
            label="Password"
            @keydown.enter="login"
          />
          <br />
          <q-btn rounded flat dense class="full-width bg-grey-3" @click="login"
            >Login</q-btn
          >
        </div>
        <br />
        <br />

        <q-btn rounded style="width: 70%" to="/createAccount"
          >Create Account</q-btn
        >
        <q-btn rounded style="width: 70%" to="/passwordForgotten"
          >I forgot my password</q-btn
        >
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import HomePage from "./HomePage.vue";

defineOptions({
  name: "loginPage",
  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    async getAccounts() {
      try {
        const response = await this.$axios.get(
          `${process.env.API}/getaccounts`
        );
        this.accounts = response.data; // Assuming the response data contains the accounts
        return this.accounts;
      } catch (err) {
        this.$q.dialog({
          title: "Error",
          message: "Could not get accounts",
        });
        throw err; // Rethrow the error to handle it in the calling function
      }
    },

    async login() {
      const enteredUsername = this.username;
      const enteredPassword = this.password;

      try {
        const accountsList = await this.getAccounts();
        console.log(accountsList);

        const accountFound = accountsList.some(
          (account) =>
            account.username === enteredUsername &&
            account.password === enteredPassword
        );

        if (accountFound) {
          this.$router.push("/home");
          console.log("Login info: ", enteredUsername, enteredPassword);
        } else {
          this.$q.dialog({
            title: "Error",
            message: "Invalid username or password",
          });
        }
      } catch (err) {
        console.error("Failed to get accounts:", err);
      }
    },
  },
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

.title-font {
  font-size: 50px;
  font-family: "Grand Hotel", "Roboto", "Helvetica Neue", "Helvetica", "Arial",
    "sans-serif";
  font-weight: 700;
}

.custom-input input[type="text"] {
  color: var(--q-color-grey-7);
}

/*
@media (max-width: 575.98px) {
  .q-footer {
    display: none;
  }}
*/
</style>
