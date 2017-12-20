import $ from 'jquery';

const has_touch = 'ontouchstart' in window;
const click_name = has_touch ? 'touchstart' : 'click';
const location = window.location;

$(() => {
  if (has_touch) {
    $('a.js-a').on(click_name, evt => {
      evt.preventDefault();
      evt.stopPropagation();
      location.href = evt.currentTarget.href;
    });
  }
});

export const HAS_TOUCH = has_touch;
export const CLICK_NAME = click_name;

export function stopEvent(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  if (evt.stopImmediatePropagation) {
    evt.stopImmediatePropagation();
  }
}
