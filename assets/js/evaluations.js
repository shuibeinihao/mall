import $ from 'jquery';
import LazyLoad from 'lazyload';
import 'jsonlylightbox';
import {replyEvaluations} from './helper/_replyEvaluations';

$(() => {
  new LazyLoad();
  var lightBox = new Lightbox();
  lightBox.load();
});

//点击回复按钮回复评论
replyEvaluations();



