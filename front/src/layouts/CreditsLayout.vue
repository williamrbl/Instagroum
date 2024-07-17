<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <div class="large-screen-only">
          <q-btn
            style="display: flex"
            dense
            flat
            :icon="cameraIcon"
            round
            size="18px"
            to="/camera"
            class="q-mr-sm"
            @mousedown="changeIconCamera"
          />
        </div>

        <q-separator vertical spaced class="large-screen-only" />

        <q-toolbar-title class="text-grand-hotel text-bold">
          Instagroum
        </q-toolbar-title>

        <div class="large-screen-only">
          <q-btn
            style="display: flex"
            dense
            flat
            :icon="homeIcon"
            round
            size="18px"
            to="/home"
            @mousedown="changeIconHome"
            class="large-screen-only"
          />
        </div>
        <div>
          <q-btn
            icon="eva-info-outline"
            style="display: flex"
            dense
            flat
            round
            size="18px"
            to="/credits"
          />
        </div>
        <div>
          <q-btn
            style="display: flex"
            dense
            flat
            icon="eva-log-out-outline"
            round
            size="18px"
            @click="confirmLogOut"
          />
        </div>

      </q-toolbar>
    </q-header>

    <q-footer class="q-pa-lg">
      <q-item-section class="text-grand-hotel constrain" style="font-size: 20px;">® Instagroum, a mediocre copy of Instagram</q-item-section>
      <div style="text-align: right" class="constrain">
        <q-item-section class="text-grand-hotel" style="font-size: 20px;">2024</q-item-section>
      </div>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
let deferredPrompt;

export default {
  name: "MainLayout",

  data() {
    return {
      cameraIcon: "eva-camera-outline",
      homeIcon: "eva-home-outline",
      isIconChanged: false,
      showAppInstallBanner: false,
    };
  },

  mounted() {
    let neverShowAppBanner = this.$q.localStorage.getItem("neverShowAppBanner");
    if (!neverShowAppBanner) {
      window.addEventListener("beforeinstallprompt", (e) => {
        console.log("beforeinstallprompt event fired");
        e.preventDefault();
        deferredPrompt = e;
        setTimeout(() => {
          this.showAppInstallBanner = true;
        }, 3000);
      });
    }
  },
  methods: {
    changeIconCamera() {
      this.cameraIcon = "eva-camera";
      this.isIconChanged = true;

      setTimeout(() => {
        if (this.isIconChanged) {
          this.cameraIcon = "eva-camera-outline";
          this.isIconChanged = false;
        }
      }, 150);
    },

    changeIconHome() {
      this.homeIcon = "eva-home";
      this.isIconChanged = true;

      setTimeout(() => {
        if (this.isIconChanged) {
          this.homeIcon = "eva-home-outline";
          this.isIconChanged = false;
        }
      }, 150);
    },

    installApp() {
      this.showAppInstallBanner = false;

      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome == "accepted") {
          console.log("User accepted the install prompt");
          this.neverShowAppBanner();
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    },

    neverShowAppBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppBanner", true);
    },

    confirmLogOut() {
      this.$q
        .dialog({
          title: "Log out",
          message: "Are you sure you want to log out ?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$router.push("/");
        })
        .onCancel(() => {
          console.log("Logout canceled");
        });
    },
  },
};
</script>

<style lang="sass">
.q-footer
  .q-tab__icon
    font-size: 30px

.q-toolbar
  justify-content: space-between
  height: 77px

.q-toolbar__title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center

.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 77px

.q-footer
  background: linear-gradient(to right, #515BD4, #8134AF,#DD2A7B, #FEDA77, #F58529)
  display: flex
  justify-content: center
  align-items: center
  height:18px

</style>
