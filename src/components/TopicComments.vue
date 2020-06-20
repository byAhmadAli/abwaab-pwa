<template>
  <h1>hello</h1>
</template>

<script>
import { cancelToken } from '../boot/axios';

export default {
  name: 'TopicComments',
  data() {
    return {
      source: null,
    };
  },
  methods: {
    async fetchTopicById(id) {
      this.source = cancelToken.source();

      this.$store.commit('topic/updateTopicLoadingState', { key: 'loadingComments', value: true });
      await this.$request.get(`/posts/${id}/comments`, {
        cancelToken: this.source.token,
      })
        .then((res) => {
          console.log(res);
          this.$store.commit('topic/updateTopicLoadingState', { key: 'loadingComments', value: false });
        }).catch((err) => {
          this.$store.commit('topic/updateTopicLoadingState', { key: 'loadingComments', value: false });
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
  async mounted() {
    await this.fetchTopicById(this.$route.params.id);
  },
  beforeDestroy() {
    this.$store.commit('topic/updateTopicShowCommentsState', false);
    if (this.source) {
      this.source.cancel('Your cancellation message');
    }
  },
};
</script>
