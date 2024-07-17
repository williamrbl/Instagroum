<template>
  <q-layout view="lHh Lpr lFf">
    <div class="q-gutter-lg column items-center justify-center">
      <h1 class="title-font">Instagroum</h1>
      <h4 class="text-grand-hotel" style="font-size: 25px">Create Account</h4>

      <div
        style="border: 1px solid black; border-radius: 9px; width: 70%"
        class="q-pa-md bg-grey-2"
      >
        <q-input
          rounded
          outlined
          standout="bg-grey-4 text-grey-8"
          label="Email"
          v-model="email"
          class="text-grey-7 q-py-md"
          style="width: 100%"
        />
        <q-input
          rounded
          outlined
          standout="bg-grey-4 text-grey-8"
          label="Username"
          v-model="username"
          class="text-grey-7 q-py-md"
          style="width: 100%"
        />
        <q-input
          rounded
          outlined
          standout="bg-grey-4 text-grey-8"
          label="Password"
          v-model="password"
          class="text-grey-7 q-py-md"
          style="width: 100%"
        />
        <q-input
          rounded
          outlined
          standout="bg-grey-4 text-grey-8"
          label="Confirm Password"
          v-model="passwordconfirm"
          class="text-grey-7 q-py-md"
          style="width: 100%"
        />
      </div>

      <div class="avatar-picker">
        <q-file
          outlined
          label="Choose an image"
          accept="image/*"
          v-model="avatar"
          @update:model-value="captureImageFallback"
        >
          <template v-slot:prepend>
            <q-icon name="eva-attach-outline" />
          </template>
        </q-file>

        <div v-show="imageCaptured" class="avatar-preview">
          <canvas ref="canvascapture" width="100" height="100" />
        </div>
      </div>

      <q-btn flat rounded @click="createAccount">Create account</q-btn>
      <q-btn rounded to="/">Back</q-btn>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: "CreateAccount",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordconfirm: "",
      avatar: null,
      imageCaptured: false,
    };
  },
  methods: {
    createAccount() {
      if (this.password == this.passwordconfirm) {
        this.$q.loading.show();
        let formData = new FormData();
        formData.append("email", this.email);
        formData.append("username", this.username);
        formData.append("password", this.password);
        formData.append("avatar", this.avatar);
        this.$axios
          .post(`${process.env.API}/createaccount`, formData)
          .then((res) => {
            console.log("Response : ", res);
          });
        this.$q.loading.hide();
      } else {
        this.$q.dialog({
          title: "Passwords are not matching",
          message: "Please enter matching passwords",
        });
      }
    },

    captureImageFallback(file) {
      this.imageCaptured = false;

      if (file) {
        let canvas = this.$refs.canvascapture;
        let context = canvas.getContext("2d");

        let reader = new FileReader();
        reader.onload = (event) => {
          let img = new Image();
          img.onload = () => {
            // Calculate the scaling factor to fit the image within 100x100
            let scale = Math.min(100 / img.width, 100 / img.height);
            let x = (100 - img.width * scale) / 2;
            let y = (100 - img.height * scale) / 2;

            // Clear the canvas before drawing
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the image scaled to fit within the canvas
            context.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              x,
              y,
              img.width * scale,
              img.height * scale
            );
            this.imageCaptured = true;
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file); // Read file as data URL
      }
    },
  },
};
</script>

<style scoped>
.title-font {
  font-size: 50px;
  font-family: "Grand Hotel", "Roboto", "Helvetica Neue", "Helvetica", "Arial",
    "sans-serif";
  font-weight: 700;
}

.q-input {
  width: 50%;
  color: grey-7;
}

.avatar-picker {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.avatar-preview {
  margin-left: 20px;
  border: 1px solid #ccc;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
