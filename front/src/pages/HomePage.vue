<template>
  <q-card class="my-card large-screen-only">
    <q-parallax
      src="https://f.hellowork.com/blogdumoderateur/2023/05/Chiffres-Instagram.jpg"
      :height="150"
    />
  </q-card>

  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            v-for="post in posts"
            :key="post.id"
            bordered
            class="card-post q-mb-md"
            flat
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img
                    src="https://media.licdn.com/dms/image/D4D03AQGua6hmpzWLWw/profile-displayphoto-shrink_200_200/0/1673018382306?e=2147483647&v=beta&t=MjwkMHVPm7YXs1Gog2VezIfTFh-sUR4Yp2H1Pdt_dK0"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section class="col-9">
                <q-item-label class="text-bold">william.rbl</q-item-label>
                <q-item-label caption> {{ post.location }} </q-item-label>
              </q-item-section>

              <q-item-section>
                <div style="text-align: right">
                  <q-icon
                    name="eva-more-vertical-outline"
                    size="sm"
                    style="cursor: pointer"
                  >
                    <q-menu>
                      <q-list>
                        <q-item
                          clickable
                          v-close-popup
                          @click="checkPostDeletion(post.id)"
                        >
                          <q-item-section>
                            <q-item-label>Delete Post</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="editCaption(post.id)"
                        >
                          <q-item-section>
                            <q-item-label>Edit Caption</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-icon>
                </div>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-img :src="post.imageUrl" />
            <q-card-section>
              <div>
                {{ post.caption }}
                <q-btn flat dense @click="editCaption(post.id)">
                  <q-icon name="eva-edit-2-outline" size="15px" />
                </q-btn>
              </div>
              <div class="text-caption text-grey">
                {{ niceDate(post.date) }}
              </div>
            </q-card-section>
          </q-card>
        </template>

        <template v-else-if="!posts.length && !loadingPosts">
          <h5 class="text-center text-grey">No posts yet.</h5>
        </template>

        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="fade"
              />
            </q-card-section>
          </q-card>
        </template>
      </div>

      <div class="col-4 large-screen-only">
        <br />
        <q-item-label class="text-bold text-grey-8">My profile</q-item-label>
        <br />
        <q-item>
          <q-item-section avatar>
            <q-avatar size="48px">
              <img
                src="https://media.licdn.com/dms/image/D4D03AQGua6hmpzWLWw/profile-displayphoto-shrink_200_200/0/1673018382306?e=2147483647&v=beta&t=MjwkMHVPm7YXs1Gog2VezIfTFh-sUR4Yp2H1Pdt_dK0"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">william.rbl</q-item-label>
            <q-item-label caption> William RABOLIN </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";

export default {
  name: "HomePage",
  data() {
    return {
      isFixed: false,
      posts: [],
      loadingPosts: false,
      newcaption: "",
    };
  },

  computed: {
    niceDate() {
      return (value) => {
        return date.formatDate(value, "D MMMM YYYY HH:mm");
      };
    },
  },
  created() {
    this.getPosts();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollPosition = window.scrollY;
      const threshold = 145;
      if (scrollPosition > threshold) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    getPosts() {
      this.loadingPosts = true;
      this.$axios
        .get(`${process.env.API}/posts`)
        .then((response) => {
          this.posts = response.data;
          this.loadingPosts = false;
        })
        .catch((err) => {
          this.$q.dialog({
            title: "Error",
            message: "Could not download posts",
          });
          this.loadingPosts = false;
        });
    },

    checkPostDeletion(id) {
      this.$q
        .dialog({
          title: "Post is about to be deleted",
          message: "Are you sure you want to delete this post ?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.deletePost(id);
        })
        .onCancel(() => {
          console.log("Deletion canceled");
        });
    },

    deletePost(id) {
      this.$axios
        .post(`${process.env.API}/deletepost`, { id })
        .then(() => {
          this.posts = this.posts.filter((post) => post.id !== id);
          console.log(`Post ${id} deleted successfully`);
          this.$q.notify({
            message: "Post deleted !",
            color: "red",
            position: "bottom",
            actions: [
              {
                label: "OK",
                color: "white",
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
        });
    },

    editCaption(id) {
      this.newcaption = "";
      this.$q
        .dialog({
          title: "Caption edition",
          message: "Please enter a caption",
          prompt: {
            model: "",
            type: "text",
          },
          cancel: true,
          persistent: true,
        })
        .onOk((newcaption) => {
          if (newcaption.length != 0) {
            this.$axios
              .post(`${process.env.API}/editcaption`, { id, newcaption })
              .then(() => {
                localStorage.setItem(
                  "notificationMessage",
                  "Caption changed !"
                );
                window.location.reload(true);
                console.log(`Caption of ${id} edited successfully`);
              });
          } else {
            this.$q.notify({
              message: "No caption entered, try again",
              color: "red",
              position: "bottom",
              actions: [
                {
                  label: "OK",
                  color: "white",
                },
              ],
            });
            this.editCaption(id);
          }
        })
        .onCancel(() => {
          console.log("Caption change canceled");
        });
    },
  },
  mounted() {
    // Check if there's a notification message in local storage
    const notificationMessage = localStorage.getItem("notificationMessage");
    if (notificationMessage) {
      // Display the notification
      this.$q.notify({
        message: notificationMessage,
        color: "orange",
        position: "bottom",
        actions: [
          {
            label: "OK",
            color: "white",
          },
        ],
      });
      // Clear the notification message from local storage
      localStorage.removeItem("notificationMessage");
    }
  },
};
</script>

<style lang="sass">
.card-post
  .q-img
    min-height:200px
    max-height:400px

.fixed-element
  position: relative
  transition: top 3s ease-out

.fixed
  position: fixed
  top: 100px
</style>
