import Vue from 'vue';
import components from './lib';
import WhpptLink from './lib/content/WhpptLink';
import Anchor from './lib/content/Anchor';

const options = JSON.parse(`<%= JSON.stringify(options) %>`);
const { componentPrefix = 'W' } = options;

// manually add in whppt-link to avoid prefix
Vue.component('whppt-link', WhpptLink);
Vue.component('Anchor', Anchor);

for (const name in components) {
  Vue.component(`${componentPrefix}${name}`, {
    extends: components[name],
  });
}

// const types = {
//   Book: {
//     pageType: 'book',
//     components: [],
//     pageSetting: {}, // component for page settings tab
//   },
// };
