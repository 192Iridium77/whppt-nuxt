import Vue from 'vue';
import SimpleComponentClickHandler from './_simpleComponentClickHandler';

export default ({ store, app: { $whppt }, menuIsInState, MENUSTATES }) => {
  Vue.directive('whppt-list', {
    bind(el, binding) {
      const property = el.getAttribute('data-property');
      const value = { value: binding.value.data, property, addNew: binding.value.addNew };

      el.whppthandler = SimpleComponentClickHandler({
        store,
        menuIsInState,
        MENUSTATES,
        name: 'list',
        el,
        value,
      });
      el.addEventListener('click', el.whppthandler);
      el.addEventListener('mouseover', function(e) {
        if (!menuIsInState(store, MENUSTATES.SELECT)) return;
        $whppt.mouseoverComponent(el);
      });
      el.addEventListener('mouseout', function(e) {
        $whppt.mouseoutComponent(el);
      });
    },
    unbind(el, binding) {
      el.removeEventListener('click', el.whppthandler);
      delete el.whppthandler;
    },
    update(el, binding) {
      const property = el.getAttribute('data-property');
      el.removeEventListener('click', el.whppthandler);
      const value = { value: binding.value.data, property, addNew: binding.value.addNew };
      el.whppthandler = SimpleComponentClickHandler({
        store,
        menuIsInState,
        MENUSTATES,
        name: 'list',
        el,
        value,
      });
      el.addEventListener('click', el.whppthandler);
    },
  });
};