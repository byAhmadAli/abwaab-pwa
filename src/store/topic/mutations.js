export const updateTopicState = (state, payload) => {
  state.data = payload;
};

export const updateTopicPhotosState = (state, payload) => {
  state.photos = payload;
};

export const updateTopicLoadingState = (state, payload) => {
  state[payload.key] = payload.value;
};

export const updateTopicShowCommentsState = (state, payload) => {
  state.showComments = payload;
};

export const reset = (state) => {
  state.data = {};
  state.loading = true;
  state.photos = [];
  state.loadingPhotos = true;
  state.comments = [];
  state.loadingComments = true;
};
