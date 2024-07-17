<template>
  <q-page class="constrain-more q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
        v-show="!imageCaptured"
        ref="camvideo"
        class="full-width"
        autoplay
        playsinline
      />
      <canvas
        v-show="imageCaptured"
        ref="canvascapture"
        class="full-width"
        height="240"
      />
    </div>

    <div class="text-center q-pa-md">
      <q-btn
        @click="captureImage"
        v-if="hasCameraSupport"
        :disable="imageCaptured"
        round
        color="grey-10"
        icon="eva-camera"
        size="lg"
      />

      <q-file
        v-else
        outlined
        label="Choose an image"
        accept="image/*"
        v-model="imageUpload"
        @update:model-value="captureImageFallback"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>

      <div class="row justify-center q-ma-md">
        <q-input
          label="Caption *"
          v-model="post.caption"
          class="col col-sm-6"
          dense
        />
      </div>

      <div class="row justify-center q-ma-md">
        <q-input
          label="Location"
          v-model="post.location"
          :loading="locationLoading"
          class="col col-sm-6"
          dense
        >
          <template v-slot:append>
            <q-btn
              v-if="!locationLoading && locationSupported"
              dense
              flat
              icon="eva-navigation-2-outline"
              round
              @click="getLocation"
            />
          </template>
        </q-input>
      </div>

      <div class="row justify-center q-mt-lg">
        <q-btn
          unelevated
          rounded
          :disable="!post.caption"
          color="primary"
          label="Post Image"
          @click="addPost"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from "quasar";
import "md-gum-polyfill";

export default {
  name: "CameraPage",
  data() {
    return {
      post: {
        id: uid(),
        caption: "",
        location: "",
        photo: null,
        date: Date.now(),
      },
      imageCaptured: false,
      imageUpload: [],
      hasCameraSupport: true,
      locationLoading: false,
    };
  },

  computed: {
    locationSupported() {
      if ("geolocation" in navigator) return true;
      else return false;
    },
  },

  methods: {
    initCamera() {
      this.imageCaptured=false
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          this.$refs.camvideo.srcObject = stream;
        })
        .catch((error) => {
          this.hasCameraSupport = false;
        });
    },

    captureImage() {
      let video = this.$refs.camvideo;
      let canvas = this.$refs.canvascapture;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },

    captureImageFallback(file) {
      this.imageCaptured=false
      if (this.imageUpload) {
        console.log("file : ", file);

        this.post.photo = file;
        let canvas = this.$refs.canvascapture;
        let context = canvas.getContext("2d");

        var reader = new FileReader();
        reader.onload = (event) => {
          var img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            this.imageCaptured = true;
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file); // Read file as data URL
      }
    },

    disableCamera() {
      this.$refs.camvideo.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    },

    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    },

    getLocation() {
      this.locationLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (err) => {
          this.locationError();
        },
        { timeout: 7000 }
      );
    },

    getCityAndCountry(position) {
      let apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
      this.$axios
        .get(apiUrl)
        .then((result) => {
          this.locationSuccess(result);
        })
        .catch((err) => {
          this.locationError();
        });
    },

    locationSuccess(result) {
      this.post.location = result.data.address.town;
      if (result.data.address.country) {
        this.post.location += `, ${result.data.address.country}`;
      }
      this.locationLoading = false;
    },

    locationError() {
      this.$q.dialog({
        title: "Error",
        message: "Could not find your location",
      });
      this.locationLoading = false;
    },

    addPost() {
      this.$q.loading.show();
      let formData = new FormData();
      formData.append("id", this.post.id);
      formData.append("caption", this.post.caption);
      formData.append("location", this.post.location);
      formData.append("date", this.post.date);
      formData.append("file", this.post.photo, this.post.id + ".png");

      this.$axios
        .post(`${process.env.API}/createpost`, formData)
        .then((response) => {
          console.log("Response : ", response);
          this.$router.push("/home");
          this.$q.notify({
            message: "Post created !",
            color:"green",
            position:"bottom",
            actions: [
              {
                label: "Dismiss",
                color: "white",
              },
            ],
          });
          this.$q.loading.hide();
        })
        .catch((err) => {
          console.log("err : ", err);
          this.$q.dialog({
            title: "Error",
            message: "Sorry, could not create post !",
          });
        });
    },
  },

  mounted() {
    this.initCamera();
  },

  beforeUnmount() {
    if (this.hasCameraSupport) {
      this.disableCamera();
    }
  },
};
</script>

<style lang="sass">
.camera-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
