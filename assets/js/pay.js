import angular from 'angular';
import $ from 'jquery';

const module = angular.module('pay', []);

module.controller('PayController',
  ['$scope', '$http',
    function ($scope, $http) {
      $scope.alipay = function (orderId) {
        $http
          .get(`/api/trade/get-alipay-url/${orderId}`)
          .success(result => {
            $('body').append(result.data);
          });
      };
    }]
);

angular.bootstrap(document.getElementById('app'), ['pay']);
