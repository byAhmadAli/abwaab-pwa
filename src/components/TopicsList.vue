<template>
  <q-item
    clickable
    tag="router-link"
    :to="link"
  >

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'TopicsList',
  props: {
    title: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      default: '#',
    },
  },
};
</script>
