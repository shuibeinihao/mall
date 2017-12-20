import $ from 'jquery';
import Vue from 'vue';

new Vue({
  el: '#heartCodeOk',
  data: {
    heartCodeTime: 3,
    state: '',
  },
  created(){
    this.state = $('#heartCodeOk').attr('data-state');
    let _this = this;
    let timer = setInterval(() => {
      if(_this.heartCodeTime > 0){
        _this.heartCodeTime--;
        if(_this.heartCodeTime === 0){
          location.href = '/gp/me?state=' + _this.state;
          clearInterval(timer);
        }
      }
    }, 1000);
  },
  methods: {
  }
});

