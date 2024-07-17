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

    <q-footer class="bg-white" bordered>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="banner-container bg-primary" v-if="showAppInstallBanner">
          <div class="constrain">
            <q-banner inline-actions dense class="bg-primary text-white">
              <template v-slot:avatar>
                <div>
                  <q-avatar
                    color="white"
                    icon="eva-camera-outline"
                    text-color="grey-10"
                    font-size="22px"
                    size="30px"
                  />
                </div>
              </template>
              <b>Install Instagroum ?</b>
              <template v-slot:action>
                <q-btn
                  flat
                  label="Yes"
                  dense
                  class="q-px-sm"
                  @click="installApp"
                />
                <q-btn
                  flat
                  label="Later"
                  dense
                  class="q-px-sm"
                  @click="showAppInstallBanner = false"
                />
                <q-btn
                  flat
                  label="Never"
                  dense
                  class="q-px-sm"
                  @click="neverShowAppBanner"
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>
      <q-tabs
        class="text-grey-10 small-screen-only"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab icon="eva-home-outline" to="/home" />
        <q-route-tab icon="eva-camera-outline" to="/camera" />
      </q-tabs>
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
</style>
