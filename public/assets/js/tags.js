define(["jquery"],function(t){"use strict";t="default"in t?t.default:t,t(document).ready(function(){t(".home-products-box").click(function(){var a=t(this).attr("data-link"),c=t(this).attr("data-tagId"),d=t(this).attr("data-productId");a?xksTrack.track("MobileMall:Tag_Products:Product:Click",{productLink:a,tagId:c}):xksTrack.track("MobileMall:Tag_Products:Product:Click",{productId:d,tagId:c})})})});