import { find } from 'lodash';

function commitTimeout(f) {
  if (process.client) {
    setTimeout(() => {
      f();
    }, 100);
  } else {
    f();
  }
}

export default options => ({
  namespaced: true,
  state: () => ({
    options,
    page: undefined,
  }),
  actions: {
    publishPage({ state }, { page } = {}) {
      const _page = page || state.page;
      _page.pageType = _page.pageType || 'page';

      const pageTypePlugin = find(
        this.$whppt.plugins,
        plugin => plugin.pageType && plugin.pageType.name === _page.pageType
      );

      if (!pageTypePlugin || !pageTypePlugin.pageType) return;

      return pageTypePlugin.pageType.publishPage(this.$whppt.context, { page: _page }).then(() => {
        this.$toast.global.editorSuccess('Page Published');
      });
    },
    savePage({ commit, state }, page) {
      const _page = page || state.page;
      _page.pageType = _page.pageType || 'page';

      const pageTypePlugin = find(
        this.$whppt.plugins,
        plugin => plugin.pageType && plugin.pageType.name === _page.pageType
      );

      if (!pageTypePlugin || !pageTypePlugin.pageType) return;

      return pageTypePlugin.pageType.savePage(this.$whppt.context, { page: _page }).then(() => {
        commit('PAGE_LOADED', _page);

        this.$toast.global.editorSuccess('Page Saved');
      });
    },
    deletePage({ state }, { page } = {}) {
      const _page = page || state.page;
      _page.pageType = _page.pageType || 'page';

      const pageTypePlugin = find(
        this.$whppt.plugins,
        plugin => plugin.pageType && plugin.pageType.name === _page.pageType
      );

      if (!pageTypePlugin || !pageTypePlugin.pageType) return;

      return pageTypePlugin.pageType.deletePage(this.$whppt.context, { _id: _page._id }).then(() => {
        this.$toast.global.editorSuccess('Page Deleted');
      });
    },
    unpublishPage({ state }, { page } = {}) {
      const _page = page || state.page;
      _page.pageType = _page.pageType || 'page';

      const pageTypePlugin = find(
        this.$whppt.plugins,
        plugin => plugin.pageType && plugin.pageType.name === _page.pageType
      );

      if (!pageTypePlugin || !pageTypePlugin.pageType) return;

      return pageTypePlugin.pageType.unpublishPage(this.$whppt.context, { _id: _page._id }).then(() => {
        state.page.published = false;
        this.$toast.global.editorSuccess('Page Unpublished');
      });
    },
    loadPage({ commit }, { slug, pageType }) {
      const pageTypePlugin = find(this.$whppt.plugins, plugin => {
        const pluginCollection =
          plugin.pageType && plugin.pageType.collection
            ? plugin.pageType.collection.name
            : plugin.pageType
            ? plugin.pageType.name
            : undefined;

        return pluginCollection === pageType;
      });

      if (!pageTypePlugin || !pageTypePlugin.pageType) throw new Error('Page not found.');

      return pageTypePlugin.pageType.loadPage(this.$whppt.context, { slug }).then(page => {
        commitTimeout(() => commit('PAGE_LOADED', page));

        return page;
      });
    },
    checkSlug({ commit }, { slug, _id, pageType, collection }) {
      const pageTypePlugin = find(this.$whppt.plugins, plugin => plugin.pageType && plugin.pageType.name === pageType);

      if (!pageTypePlugin || !pageTypePlugin.pageType) return;

      return pageTypePlugin.pageType.checkSlug(this.$whppt.context, { slug, _id, collection }).then(slugExists => {
        return slugExists;
      });
    },
  },
  mutations: {
    PAGE_LOADED(state, page) {
      state.page = page;
    },
    PAGE_DELETED(state) {
      state.page = undefined;
    },
  },
});