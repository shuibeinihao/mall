define(["angular","jquery"],function(t,e){"use strict";t="default"in t?t.default:t,e="default"in e?e.default:e,t.module("pay",[]).controller("PayController",["$scope","$http",function(t,a){t.alipay=function(t){a.get("/api/trade/get-alipay-url/"+t).success(function(t){e("body").append(t.data)})}}]),t.bootstrap(document.getElementById("app"),["pay"])});
