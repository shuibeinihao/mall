import angular from 'angular';
import $ from 'jquery';
import animate from './helper/_animate';
import areaFormat from './helper/_areaFormat';
import { CLICK_NAME } from './helper/_tap';

const module = angular.module('order', []);
const $areaChooser = $('#areaChooser');
const HIDDEN_CLASS = 'hidden';

module.controller('AllianzController', ['$scope', '$http', ($scope, $http) => {
  $scope.address = {};
  $scope.params = { amount: 1 };

  /* 地区选择 */
  $scope.showChooser = () => {
    $areaChooser.removeClass(HIDDEN_CLASS);
    $('#app').addClass('noscroll');
    animate($areaChooser, 'slideInRight');
  };

  $scope.hideChooser = () => {
    $('#app').removeClass('noscroll');
    animate($areaChooser, 'slideOutRight', HIDDEN_CLASS);
  };

  $scope.isFullfilled = () => {
    const address = $scope.address;
    return address.name && address.phoneNumber
      && address.district && address.address;
  };

  $scope.submit = () => {
    const address = $scope.address;
    if (!address.name) {
      $('#whoEl').focus();
      return;
    }

    if (!address.phoneNumber) {
      $('#telEl').focus();
      return;
    }

    if (!address.district) {
      $scope.showChooser();
      return;
    }

    if (!address.address) {
      $('#addressEl').focus();
      return;
    }

    const form = $('.js-form').get(0);
    const data = {
      address: `${address.province}${address.city}${address.district}${address.address}`,
      phone: address.phoneNumber,
      name: address.name,
      organization: form.organization.value,
      id: form.id.value,
      sign: form.sign.value
    };
    $http.post('/api/trade/gift/submit-gift', data)
      .then(res => {
        const result = res.data;
        if (result.success) {
          location.href = '/pickupgifts/ok';
        } else {
          if (result.retCode < 0) {
            location.href = '/pickupgifts/fail';
          } else {
            showError(result.retMsg);
          }
        }
      }, error => showReqError(error));
  };
}]);

module.directive('orderList', () =>
  ({
    restrict: 'ACE',
    link: ($scope, element) => {
      element.on(CLICK_NAME, '.js-action', evt => {
        $(evt.target).toggleClass('open')
          .next()
          .toggleClass('hidden')
          .prev()
          .get(0).scrollIntoView();
      });

      element.on(CLICK_NAME, '.js-target', evt => {
        const $target = $(evt.target);
        const text = $target.text();
        const $city = $target.parent().parent();
        const city = $city.find('> .js-action').text();
        const $province = $city.parent().parent();
        const province = $province.find('> .js-action').text();
        $scope.$apply(() => {
          let pcd = areaFormat(province, city, text);
          $scope.addressPcd = pcd;
          $scope.address.province = province;
          $scope.address.city = city;
          $scope.address.district = text;
          $scope.hideChooser();
        });
      });
    }
  })
);

$('.js-dialog-ok').on(CLICK_NAME, () => {
  $('.js-error-dialog').addClass(HIDDEN_CLASS);
});

function showReqError(err) {
  if (err.status < 0) {
    showError('网络错误，请稍后重试！');
  } else {
    showError('请求出错，请稍后重试！');
  }
}

function showError(error) {
  $('.js-error-dialog')
    .removeClass(HIDDEN_CLASS)
    .find('.js-error-msg')
    .html(error);
}

angular.bootstrap(document.getElementById('app'), ['order']);
