import $ from 'jquery';
import Vue from 'vue';

const stop = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};

new Vue({
  el: '#carddetails',
  data: {
  },
  created(){
  },
  methods: {
    showDetails(evt){
      stop(evt);
      $(evt.target).toggleClass('icon_up');
      $(evt.target).parent().next('.details_con').slideToggle();
    },
  },
});

