//检测浏览器是否支持CSS动画
//https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support
function checkSupport() {
  let supported = false;
  let domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
  let elm = document.createElement('div');

  if (elm.style.animationName !== undefined) {
    supported = true;
  }

  if (supported === false) {
    for (let i = 0, len = domPrefixes.length; i < len; i++) {
      if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
        supported = true;
        break;
      }
    }
  }

  return supported;
}

const cssanimations = checkSupport();
const animationEnd =
  'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

export default function (node, animateName, otherEndClasses) {
  if (cssanimations) {
    node
      .addClass('animated ' + animateName)
      .one(animationEnd, function () {
        node.removeClass('animated ' + animateName);
        if (otherEndClasses) {
          node.addClass(otherEndClasses);
        }
      });
  } else if (otherEndClasses) {
    node.addClass(otherEndClasses);
  }
}
