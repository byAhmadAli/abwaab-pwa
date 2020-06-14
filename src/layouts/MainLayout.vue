<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="list"
          aria-label="list"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="300"
      :breakpoint="700"
      elevated
      content-class="bg-grey-1 doc-left-drawer"
    >
      <q-input
        square
        clearable
        clear-icon="close"
        filled
        standout bottom-slots
        color="primary"
        v-model="searchModel"
        label="Find a topic"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label
            header
            class="text-grey-8"
          >
            Topics
          </q-item-label>

          <TopicsList
            v-for="link in essentialLinks"
            :key="link.id"
            :title="link.title"
            :link="'/posts/'+link.id"
          />
        </q-list>
      </q-scroll-area>
      <q-btn
        fixed
        push
        color="primary"
        round
        icon="create"
        class="fixed"
        size="lg"
        style="right: 18px; bottom: 18px"
      >
        <q-tooltip anchor="center left" self="center right">Compose</q-tooltip>
      </q-btn>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script>
import Axios from 'axios';

export default {
  name: 'MainLayout',

  components: {
    TopicsList: () => import('components/TopicsList'),
  },

  data() {
    return {
      searchModel: '',
      leftDrawerOpen: false,
      essentialLinks: [],
    };
  },
  created() {
    Axios.get('/api/posts')
      .then((res) => {
        this.essentialLinks = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
