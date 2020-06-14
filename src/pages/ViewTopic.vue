<template>
  <q-page class="q-pt-lg">
    <div class="text-center">
      <q-spinner
        v-if="loading"
        color="primary"
        size="5.5em"
        :thickness="2"
      />
    </div>
    <div class="fit row wrap justify-center items-start content-start"  v-if="!isEmptyData">
      <div class="col-8 self-center">
        <h2>{{topic.title}}</h2>
        <div class="text-center" v-if="loadingPhotos && !loading">
          <q-spinner
            color="primary"
            size="5.5em"
            :thickness="2"
          />
        </div>
        <div v-else>
          <q-carousel
            swipeable
            animated
            arrows
            v-model="slide"
            :fullscreen.sync="fullscreen"
            infinite
            v-if="hasPhotos"
          >
            <q-carousel-slide
              v-for="photo in photos"
              :key="photo.id"
              :name="photo.id"
              :img-src="photo.url"
            />
            <template v-slot:control>
              <q-carousel-control
                position="bottom-right"
                :offset="[18, 18]"
              >
                <q-btn
                  push round dense color="white" text-color="primary"
                  :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  @click="fullscreen = !fullscreen"
                />
              </q-carousel-control>
            </template>
          </q-carousel>
        </div>
        <p class="q-pt-lg">
          <span v-for="n in 15" :key="n">{{topic.body}}</span>
        </p>
      </div>
    </div>
    <div class="text-center" v-else>
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        />
      </p>
      <p class="text-faded">
        Sorry, nothing here...<strong>(404)</strong>
      </p>
      <q-btn
        color="primary"
        style="width:200px;"
        to="/"
        label="Go back"
      />
    </div>
  </q-page>
</template>

<script>
import Axios from 'axios';

export default {
  name: 'ViewTopic',
  data() {
    return {
      loading: true,
      loadingPhotos: true,
      topic: {},
      photos: [],
      slide: 1,
      fullscreen: false,
    };
  },
  methods: {
    fetchTopicById(id) {
      this.loading = true;
      this.topic = {};
      Axios.get(`/api/posts/${id}`)
        .then((res) => {
          this.topic = res.data;
          this.loading = false;
          Axios.get(`/api/posts/${id}/photos`)
            .then((photosRes) => {
              this.photos = photosRes.data;
              this.loadingPhotos = false;
            })
            .catch((err) => {
              this.loadingPhotos = false;
              this.$q.notify({
                message: `${err.response.status} - Error`,
                caption: err.response.statusText,
                type: 'negative',
                position: 'bottom-right',
              });
            });
        })
        .catch((err) => {
          this.loading = false;
          this.$q.notify({
            message: `${err.response.status} - Error`,
            caption: err.response.statusText,
            type: 'negative',
            position: 'bottom-right',
          });
        });
    },
  },
  computed: {
    isEmptyData() {
      return (Object.keys(this.topic).length === 0 && this.topic.constructor === Object)
      && !this.loading;
    },
    hasPhotos() {
      return this.photos.length > 0;
    },
  },
  mounted() {
    this.fetchTopicById(this.$route.params.id);
  },
};
</script>
