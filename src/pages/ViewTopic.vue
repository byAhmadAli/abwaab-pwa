<template>
  <q-page class="q-pt-lg">
    <div class="text-center">
      <q-spinner
        v-if="loadingTopicState"
        color="primary"
        size="5.5em"
        :thickness="2"
      />
    </div>
    <div class="fit row wrap justify-center items-start content-start"  v-if="!isEmptyData">
      <div class="col-8 self-center">
        <h2>{{topicDataState.title}}</h2>
        <div class="text-center" v-if="loadingPhotosState && !loadingTopicState">
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
              v-for="photo in topicPhotosState"
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
          <span v-for="n in 15" :key="n">{{topicDataState.body}}</span>
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
import { cancelToken } from '../boot/axios';

export default {
  name: 'ViewTopic',
  data() {
    return {
      slide: 1,
      fullscreen: false,
      source: null,
    };
  },
  methods: {
    async fetchTopicById(id) {
      this.source = cancelToken.source();
      this.$store.commit('topic/reset');

      await this.$request.get(`/posts/${id}`, {
        cancelToken: this.source.token,
      })
        .then(async (res) => {
          this.$store.commit('topic/updateTopicState', res.data);
          this.$store.commit('topic/updateTopicLoadingState', { key: 'loading', value: false });
          this.$store.commit('topic/updateTopicShowCommentsState', true);
        })
        .catch((err) => {
          this.$store.commit('topic/updateTopicLoadingState', { key: 'loading', value: false });
          if (this.$request.isCancel(err)) {
            console.log('Request canceled', err.message);
          } else {
            this.$q.notify({
              message: `${err.response.status} - Error`,
              caption: err.response.statusText,
              type: 'negative',
              position: 'bottom-right',
            });
          }
        });

      await this.$request.get(`/posts/${id}/photos`, {
        cancelToken: this.source.token,
      })
        .then((photosRes) => {
          this.$store.commit('topic/updateTopicPhotosState', photosRes.data);
          this.$store.commit('topic/updateTopicLoadingState', { key: 'loadingPhotos', value: false });
        })
        .catch((err) => {
          this.$store.commit('topic/updateTopicLoadingState', { key: 'loadingPhotos', value: false });
          if (this.$request.isCancel(err)) {
            console.log('Request canceled', err.message);
          } else {
            this.$q.notify({
              message: `${err.response.status} - Error`,
              caption: err.response.statusText,
              type: 'negative',
              position: 'bottom-right',
            });
          }
        });
    },
  },
  computed: {
    isEmptyData() {
      return (Object.keys(this.$store.state.topic.data).length === 0
      && this.$store.state.topic.data.constructor === Object)
      && !this.$store.state.topic.loading;
    },
    hasPhotos() {
      return this.$store.state.topic.photos.length > 0;
    },
    loadingPhotosState() {
      return this.$store.state.topic.loadingPhotos;
    },
    topicPhotosState() {
      return this.$store.state.topic.photos;
    },
    loadingTopicState() {
      return this.$store.state.topic.loading;
    },
    topicDataState() {
      return this.$store.state.topic.data;
    },
  },
  async mounted() {
    await this.fetchTopicById(this.$route.params.id);
  },
  beforeDestroy() {
    if (this.source) {
      this.source.cancel('Your cancellation message');
    }
  },
};
</script>
