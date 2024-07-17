<template>
  <q-layout view="lHh Lpr lFf">
    <div
      class="q-gutter-lg column items-center justify-center"
      style="height: 100vh"
    >
      <div class="q-gutter-md" style="max-width: 300px; text-align: center">
        <h1 class="title-font">Instagroum</h1>
        <h4 class="text-grand-hotel" style="font-size: 25px">Password reset</h4>
        <br />

        <q-input
          rounded
          standout="bg-grey-4 text-grey-8"
          v-model="email.recipient"
          label="Email Address"
          @keydown.enter="checkEmail"
        />

        <br />
        <q-btn rounded style="width: 100%" @click="checkEmail"
          >Send Password Reset Link</q-btn
        >
        <q-btn rounded style="width: 70%" to="/">Back</q-btn>
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: "PasswordForget",
  data() {
    return {
      username: "",
      emailreset: "",
      email: {
        recipient: "",
        subject: "Instagroum Password Reset",
        message: "",
        html: "",
      },
    };
  },
  watch: {
    username: {
      handler(newUsername) {
        this.updateEmailHtml(newUsername);
      },
      immediate: true, // This triggers the handler immediately after component creation
    },
  },
  methods: {
    async checkEmail() {
      try {
        this.accountsList = await this.getAccounts();
      } catch (err) {
        console.error("Failed to get accounts:", err);
      }

      if (
        this.accountsList.length > 0 &&
        this.email.recipient.includes("@") &&
        this.email.recipient.includes(".")
      ) {
        const userExists = this.accountsList.some(
          (account) => account.email === this.email.recipient
        );
        if (userExists) {
          const user = this.accountsList.find(
            (account) => account.email === this.email.recipient
          );
          this.username = user.username;
          this.$q
            .dialog({
              title: "Password Forgotten",
              message: `Send password reset to : ${this.email.recipient} ?`,
              cancel: true,
              persistent: true,
            })
            .onOk(() => {
              this.sendEmail();
            })
            .onCancel(() => {
              console.log("Email sending cancelled");
            })
            .onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            });
        } else {
          this.$q.dialog({
            title: "Email not found",
            message: `The entered email (${this.email.recipient}) was not found in our database`,
          });
        }
      } else if (this.email.recipient.length == 0) {
        this.$q.dialog({
          title: "No email entered",
          message: "Please enter an email",
        });
      } else if (
        !this.email.recipient.includes("@") ||
        !this.email.recipient.includes(".")
      ) {
        this.$q.dialog({
          title: "Not an email",
          message: "Please enter a valid email to reset your password",
        });
      }
    },

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

    async sendEmail() {
      try {
        const response = await fetch(`${process.env.API}/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.email),
        });
        if (response.ok) {
          this.$router.push("/");
          alert("Email sent successfully");
        } else {
          alert("Failed to send email");
        }
      } catch (error) {
        alert("An error occurred: " + error.message);
      }
    },

    updateEmailHtml(username) {
      this.email.html = `
        <img src="https://f.hellowork.com/blogdumoderateur/2023/05/Chiffres-Instagram.jpg" alt="Instagram Image" style="width:100%;height:120px; object-fit: cover;">
        <br>
        <p> Hello ${username || "there"},
        <br>
        <p>You requested a password reset for Instagroum. If you did not, please ignore this email.</p>
        <br>
        <p>Your temporary password is: XXXXXXXXXXXXXXX</p>
        <br>
        <h8>Instagroum, a mediocre copy of Instagram</h8>
        <h9>;)</h9>
      `;
    },
  },
};
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

/*
@media (max-width: 575.98px) {
  .q-footer {
    display: none;
  }}
*/
</style>
