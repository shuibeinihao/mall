define(["jquery"],function(t){"use strict";function n(t){return t&&t.__esModule?t.default:t}function e(t,n){return n={exports:{}},t(n,n.exports),n.exports}function r(n){n.title!==ae.title&&(t(".js-name").text(n.title[0]),t(".js-toggle").text(n.title[1])),n.area!==ae.area&&t(".js-area").html(n.area.name+"&nbsp;("+n.area.code+")"),n.type!==ae.type&&(n.type===ie?(t(".js-sign-wrapper").html('<button class="login-codegen ui-touchable js-sign-code">获取验证码</button>'),t(".js-tip").html("未注册心开始账户的手机号，登录时将自动注册。"),t(".js-password").attr("placeholder","请输入验证码")):(t(".js-sign-wrapper").html(""),t(".js-tip").html("如果忘记密码，请选择快捷登录进行登录，然后找回或修改码。"),t(".js-password").attr("placeholder","请输入密码"))),ae=n}function o(t){t.preventDefault(),t.stopPropagation(),pt(ce,"bounceOutDown","hidden")}function i(n){var e=t(".js-dialog");e.find(".js-dialog-msg").text(n),e.removeClass("hidden")}function a(){t(".js-dialog").addClass("hidden")}function c(){var t=void 0,n=120,e=function(){n--,le.text(n+"秒后重新获取"),n<0&&(de=!1,clearInterval(t),le.text("重新获取"),ue.val().trim()&&le.prop("disabled",!1))};le.prop("disabled",!0),le.text(n+"秒后重新获取"),de=!0,t=setInterval(e,1e3)}t="default"in t?t.default:t;var u=e(function(t){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)}),s=e(function(t){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)}),f=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t},l=function(t,n,e){if(f(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}},p=function(t){return"object"==typeof t?null!==t:"function"==typeof t},d=function(t){if(!p(t))throw TypeError(t+" is not an object!");return t},h=function(t){try{return!!t()}catch(t){return!0}},v=!h(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}),m=u.document,y=p(m)&&p(m.createElement),g=function(t){return y?m.createElement(t):{}},_=!v&&!h(function(){return 7!=Object.defineProperty(g("div"),"a",{get:function(){return 7}}).a}),b=function(t,n){if(!p(t))return t;var e,r;if(n&&"function"==typeof(e=t.toString)&&!p(r=e.call(t)))return r;if("function"==typeof(e=t.valueOf)&&!p(r=e.call(t)))return r;if(!n&&"function"==typeof(e=t.toString)&&!p(r=e.call(t)))return r;throw TypeError("Can't convert object to primitive value")},j=Object.defineProperty,w=v?Object.defineProperty:function(t,n,e){if(d(t),n=b(n,!0),d(e),_)try{return j(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t},S={f:w},k=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}},O=v?function(t,n,e){return S.f(t,n,k(1,e))}:function(t,n,e){return t[n]=e,t},x=function(t,n,e){var r,o,i,a=t&x.F,c=t&x.G,f=t&x.S,p=t&x.P,d=t&x.B,h=t&x.W,v=c?s:s[n]||(s[n]={}),m=v.prototype,y=c?u:f?u[n]:(u[n]||{}).prototype;c&&(e=n);for(r in e)(o=!a&&y&&void 0!==y[r])&&r in v||(i=o?y[r]:e[r],v[r]=c&&"function"!=typeof y[r]?e[r]:d&&o?l(i,u):h&&y[r]==i?function(t){var n=function(n,e,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,r)}return t.apply(this,arguments)};return n.prototype=t.prototype,n}(i):p&&"function"==typeof i?l(Function.call,i):i,p&&((v.virtual||(v.virtual={}))[r]=i,t&x.R&&m&&!m[r]&&O(m,r,i)))};x.F=1,x.G=2,x.S=4,x.P=8,x.B=16,x.W=32,x.U=64,x.R=128;var T=x,M={}.hasOwnProperty,P=function(t,n){return M.call(t,n)},E={}.toString,I=function(t){return E.call(t).slice(8,-1)},C=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==I(t)?t.split(""):Object(t)},A=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t},L=function(t){return C(A(t))},N=Math.ceil,F=Math.floor,R=function(t){return isNaN(t=+t)?0:(t>0?F:N)(t)},U=Math.min,D=function(t){return t>0?U(R(t),9007199254740991):0},W=Math.max,J=Math.min,B=function(t,n){return t=R(t),t<0?W(t+n,0):J(t,n)},G=u["__core-js_shared__"]||(u["__core-js_shared__"]={}),z=function(t){return G[t]||(G[t]={})},K=0,$=Math.random(),q=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++K+$).toString(36))},H=z("keys"),V=function(t){return H[t]||(H[t]=q(t))},Q=function(t){return function(n,e,r){var o,i=L(n),a=D(i.length),c=B(r,a);if(t&&e!=e){for(;a>c;)if((o=i[c++])!=o)return!0}else for(;a>c;c++)if((t||c in i)&&i[c]===e)return t||c||0;return!t&&-1}}(!1),X=V("IE_PROTO"),Y=function(t,n){var e,r=L(t),o=0,i=[];for(e in r)e!=X&&P(r,e)&&i.push(e);for(;n.length>o;)P(r,e=n[o++])&&(~Q(i,e)||i.push(e));return i},Z="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),tt=Object.keys||function(t){return Y(t,Z)},nt=Object.getOwnPropertySymbols,et={f:nt},rt={}.propertyIsEnumerable,ot={f:rt},it=function(t){return Object(A(t))},at=Object.assign,ct=!at||h(function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach(function(t){n[t]=t}),7!=at({},t)[e]||Object.keys(at({},n)).join("")!=r})?function(t,n){for(var e=it(t),r=arguments.length,o=1,i=et.f,a=ot.f;r>o;)for(var c,u=C(arguments[o++]),s=i?tt(u).concat(i(u)):tt(u),f=s.length,l=0;f>l;)a.call(u,c=s[l++])&&(e[c]=u[c]);return e}:at;T(T.S+T.F,"Object",{assign:ct});var ut=s.Object.assign,st=e(function(t){t.exports={default:ut,__esModule:!0}}),ft=n(st),lt=function(){var t=!1,n="Webkit Moz O ms Khtml".split(" "),e=document.createElement("div");if(void 0!==e.style.animationName&&(t=!0),!1===t)for(var r=0,o=n.length;r<o;r++)if(void 0!==e.style[n[r]+"AnimationName"]){t=!0;break}return t}(),pt=function(t,n,e){lt?t.addClass("animated "+n).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){t.removeClass("animated "+n),e&&t.addClass(e)}):e&&t.addClass(e)},dt=s.JSON||(s.JSON={stringify:JSON.stringify}),ht=function(t){return dt.stringify.apply(dt,arguments)},vt=e(function(t){t.exports={default:ht,__esModule:!0}}),mt=n(vt),yt=O,gt={},_t=v?Object.defineProperties:function(t,n){d(t);for(var e,r=tt(n),o=r.length,i=0;o>i;)S.f(t,e=r[i++],n[e]);return t},bt=u.document&&document.documentElement,jt=V("IE_PROTO"),wt=function(){},St=function(){var t,n=g("iframe"),e=Z.length;for(n.style.display="none",bt.appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),St=t.F;e--;)delete St.prototype[Z[e]];return St()},kt=Object.create||function(t,n){var e;return null!==t?(wt.prototype=d(t),e=new wt,wt.prototype=null,e[jt]=t):e=St(),void 0===n?e:_t(e,n)},Ot=e(function(t){var n=z("wks"),e=u.Symbol,r="function"==typeof e;(t.exports=function(t){return n[t]||(n[t]=r&&e[t]||(r?e:q)("Symbol."+t))}).store=n}),xt=S.f,Tt=Ot("toStringTag"),Mt=function(t,n,e){t&&!P(t=e?t:t.prototype,Tt)&&xt(t,Tt,{configurable:!0,value:n})},Pt={};O(Pt,Ot("iterator"),function(){return this});var Et=function(t,n,e){t.prototype=kt(Pt,{next:k(1,e)}),Mt(t,n+" Iterator")},It=V("IE_PROTO"),Ct=Object.prototype,At=Object.getPrototypeOf||function(t){return t=it(t),P(t,It)?t[It]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?Ct:null},Lt=Ot("iterator"),Nt=!([].keys&&"next"in[].keys()),Ft=function(){return this},Rt=function(t,n,e,r,o,i,a){Et(e,n,r);var c,u,s,f=function(t){if(!Nt&&t in h)return h[t];switch(t){case"keys":case"values":return function(){return new e(this,t)}}return function(){return new e(this,t)}},l=n+" Iterator",p="values"==o,d=!1,h=t.prototype,v=h[Lt]||h["@@iterator"]||o&&h[o],m=v||f(o),y=o?p?f("entries"):m:void 0,g="Array"==n?h.entries||v:v;if(g&&(s=At(g.call(new t)))!==Object.prototype&&Mt(s,l,!0),p&&v&&"values"!==v.name&&(d=!0,m=function(){return v.call(this)}),a&&(Nt||d||!h[Lt])&&O(h,Lt,m),gt[n]=m,gt[l]=Ft,o)if(c={values:p?m:f("values"),keys:i?m:f("keys"),entries:y},a)for(u in c)u in h||yt(h,u,c[u]);else T(T.P+T.F*(Nt||d),n,c);return c},Ut=function(t){return function(n,e){var r,o,i=String(A(n)),a=R(e),c=i.length;return a<0||a>=c?t?"":void 0:(r=i.charCodeAt(a),r<55296||r>56319||a+1===c||(o=i.charCodeAt(a+1))<56320||o>57343?t?i.charAt(a):r:t?i.slice(a,a+2):o-56320+(r-55296<<10)+65536)}}(!0);Rt(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=Ut(n,e),this._i+=t.length,{value:t,done:!1})});var Dt=function(t,n){return{value:n,done:!!t}};Rt(Array,"Array",function(t,n){this._t=L(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,Dt(1)):"keys"==n?Dt(0,e):"values"==n?Dt(0,t[e]):Dt(0,[e,t[e]])},"values");gt.Arguments=gt.Array;for(var Wt=Ot("toStringTag"),Jt=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],Bt=0;Bt<5;Bt++){var Gt=Jt[Bt],zt=u[Gt],Kt=zt&&zt.prototype;Kt&&!Kt[Wt]&&O(Kt,Wt,Gt),gt[Gt]=gt.Array}var $t,qt,Ht,Vt=Ot("toStringTag"),Qt="Arguments"==I(function(){return arguments}()),Xt=function(t,n){try{return t[n]}catch(t){}},Yt=function(t){var n,e,r;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=Xt(n=Object(t),Vt))?e:Qt?I(n):"Object"==(r=I(n))&&"function"==typeof n.callee?"Arguments":r},Zt=function(t,n,e,r){if(!(t instanceof n)||void 0!==r&&r in t)throw TypeError(e+": incorrect invocation!");return t},tn=function(t,n,e,r){try{return r?n(d(e)[0],e[1]):n(e)}catch(n){var o=t.return;throw void 0!==o&&d(o.call(t)),n}},nn=Ot("iterator"),en=Array.prototype,rn=function(t){return void 0!==t&&(gt.Array===t||en[nn]===t)},on=Ot("iterator"),an=s.getIteratorMethod=function(t){if(void 0!=t)return t[on]||t["@@iterator"]||gt[Yt(t)]},cn=e(function(t){var n={},e={},r=t.exports=function(t,r,o,i,a){var c,u,s,f,p=a?function(){return t}:an(t),h=l(o,i,r?2:1),v=0;if("function"!=typeof p)throw TypeError(t+" is not iterable!");if(rn(p)){for(c=D(t.length);c>v;v++)if((f=r?h(d(u=t[v])[0],u[1]):h(t[v]))===n||f===e)return f}else for(s=p.call(t);!(u=s.next()).done;)if((f=tn(s,h,u.value,r))===n||f===e)return f};r.BREAK=n,r.RETURN=e}),un=Ot("species"),sn=function(t,n){var e,r=d(t).constructor;return void 0===r||void 0==(e=d(r)[un])?n:f(e)},fn=function(t,n,e){var r=void 0===e;switch(n.length){case 0:return r?t():t.call(e);case 1:return r?t(n[0]):t.call(e,n[0]);case 2:return r?t(n[0],n[1]):t.call(e,n[0],n[1]);case 3:return r?t(n[0],n[1],n[2]):t.call(e,n[0],n[1],n[2]);case 4:return r?t(n[0],n[1],n[2],n[3]):t.call(e,n[0],n[1],n[2],n[3])}return t.apply(e,n)},ln=u.process,pn=u.setImmediate,dn=u.clearImmediate,hn=u.MessageChannel,vn=0,mn={},yn=function(){var t=+this;if(mn.hasOwnProperty(t)){var n=mn[t];delete mn[t],n()}},gn=function(t){yn.call(t.data)};pn&&dn||(pn=function(t){for(var n=[],e=1;arguments.length>e;)n.push(arguments[e++]);return mn[++vn]=function(){fn("function"==typeof t?t:Function(t),n)},$t(vn),vn},dn=function(t){delete mn[t]},"process"==I(ln)?$t=function(t){ln.nextTick(l(yn,t,1))}:hn?(qt=new hn,Ht=qt.port2,qt.port1.onmessage=gn,$t=l(Ht.postMessage,Ht,1)):u.addEventListener&&"function"==typeof postMessage&&!u.importScripts?($t=function(t){u.postMessage(t+"","*")},u.addEventListener("message",gn,!1)):$t="onreadystatechange"in g("script")?function(t){bt.appendChild(g("script")).onreadystatechange=function(){bt.removeChild(this),yn.call(t)}}:function(t){setTimeout(l(yn,t,1),0)});var _n={set:pn,clear:dn},bn=_n.set,jn=u.MutationObserver||u.WebKitMutationObserver,wn=u.process,Sn=u.Promise,kn="process"==I(wn),On=Ot("species"),xn=Ot("iterator"),Tn=!1;try{var Mn=[7][xn]();Mn.return=function(){Tn=!0},Array.from(Mn,function(){throw 2})}catch(t){}var Pn,En,In,Cn=_n.set,An=function(){var t,n,e,r=function(){var r,o;for(kn&&(r=wn.domain)&&r.exit();t;){o=t.fn,t=t.next;try{o()}catch(r){throw t?e():n=void 0,r}}n=void 0,r&&r.enter()};if(kn)e=function(){wn.nextTick(r)};else if(jn){var o=!0,i=document.createTextNode("");new jn(r).observe(i,{characterData:!0}),e=function(){i.data=o=!o}}else if(Sn&&Sn.resolve){var a=Sn.resolve();e=function(){a.then(r)}}else e=function(){bn.call(u,r)};return function(r){var o={fn:r,next:void 0};n&&(n.next=o),t||(t=o,e()),n=o}}(),Ln=u.TypeError,Nn=u.process,Fn=u.Promise,Nn=u.process,Rn="process"==Yt(Nn),Un=function(){},Dn=!!function(){try{var t=Fn.resolve(1),n=(t.constructor={})[Ot("species")]=function(t){t(Un,Un)};return(Rn||"function"==typeof PromiseRejectionEvent)&&t.then(Un)instanceof n}catch(t){}}(),Wn=function(t,n){return t===n||t===Fn&&n===In},Jn=function(t){var n;return!(!p(t)||"function"!=typeof(n=t.then))&&n},Bn=function(t){return Wn(Fn,t)?new Gn(t):new En(t)},Gn=En=function(t){var n,e;this.promise=new t(function(t,r){if(void 0!==n||void 0!==e)throw Ln("Bad Promise constructor");n=t,e=r}),this.resolve=f(n),this.reject=f(e)},zn=function(t){try{t()}catch(t){return{error:t}}},Kn=function(t,n){if(!t._n){t._n=!0;var e=t._c;An(function(){for(var r=t._v,o=1==t._s,i=0;e.length>i;)!function(n){var e,i,a=o?n.ok:n.fail,c=n.resolve,u=n.reject,s=n.domain;try{a?(o||(2==t._h&&Hn(t),t._h=1),!0===a?e=r:(s&&s.enter(),e=a(r),s&&s.exit()),e===n.promise?u(Ln("Promise-chain cycle")):(i=Jn(e))?i.call(e,c,u):c(e)):u(r)}catch(t){u(t)}}(e[i++]);t._c=[],t._n=!1,n&&!t._h&&$n(t)})}},$n=function(t){Cn.call(u,function(){var n,e,r,o=t._v;if(qn(t)&&(n=zn(function(){Rn?Nn.emit("unhandledRejection",o,t):(e=u.onunhandledrejection)?e({promise:t,reason:o}):(r=u.console)&&r.error&&r.error("Unhandled promise rejection",o)}),t._h=Rn||qn(t)?2:1),t._a=void 0,n)throw n.error})},qn=function(t){if(1==t._h)return!1;for(var n,e=t._a||t._c,r=0;e.length>r;)if(n=e[r++],n.fail||!qn(n.promise))return!1;return!0},Hn=function(t){Cn.call(u,function(){var n;Rn?Nn.emit("rejectionHandled",t):(n=u.onrejectionhandled)&&n({promise:t,reason:t._v})})},Vn=function(t){var n=this;n._d||(n._d=!0,n=n._w||n,n._v=t,n._s=2,n._a||(n._a=n._c.slice()),Kn(n,!0))},Qn=function(t){var n,e=this;if(!e._d){e._d=!0,e=e._w||e;try{if(e===t)throw Ln("Promise can't be resolved itself");(n=Jn(t))?An(function(){var r={_w:e,_d:!1};try{n.call(t,l(Qn,r,1),l(Vn,r,1))}catch(t){Vn.call(r,t)}}):(e._v=t,e._s=1,Kn(e,!1))}catch(t){Vn.call({_w:e,_d:!1},t)}}};Dn||(Fn=function(t){Zt(this,Fn,"Promise","_h"),f(t),Pn.call(this);try{t(l(Qn,this,1),l(Vn,this,1))}catch(t){Vn.call(this,t)}},Pn=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},Pn.prototype=function(t,n,e){for(var r in n)e&&t[r]?t[r]=n[r]:O(t,r,n[r]);return t}(Fn.prototype,{then:function(t,n){var e=Bn(sn(this,Fn));return e.ok="function"!=typeof t||t,e.fail="function"==typeof n&&n,e.domain=Rn?Nn.domain:void 0,this._c.push(e),this._a&&this._a.push(e),this._s&&Kn(this,!1),e.promise},catch:function(t){return this.then(void 0,t)}}),Gn=function(){var t=new Pn;this.promise=t,this.resolve=l(Qn,t,1),this.reject=l(Vn,t,1)}),T(T.G+T.W+T.F*!Dn,{Promise:Fn}),Mt(Fn,"Promise"),function(t){var n="function"==typeof s[t]?s[t]:u[t];v&&n&&!n[On]&&S.f(n,On,{configurable:!0,get:function(){return this}})}("Promise"),In=s.Promise,T(T.S+T.F*!Dn,"Promise",{reject:function(t){var n=Bn(this);return(0,n.reject)(t),n.promise}}),T(T.S+!0*T.F,"Promise",{resolve:function(t){if(t instanceof Fn&&Wn(t.constructor,this))return t;var n=Bn(this);return(0,n.resolve)(t),n.promise}}),T(T.S+T.F*!(Dn&&function(t,n){if(!n&&!Tn)return!1;var e=!1;try{var r=[7],o=r[xn]();o.next=function(){return{done:e=!0}},r[xn]=function(){return o},t(r)}catch(t){}return e}(function(t){Fn.all(t).catch(Un)})),"Promise",{all:function(t){var n=this,e=Bn(n),r=e.resolve,o=e.reject,i=zn(function(){var e=[],i=0,a=1;cn(t,!1,function(t){var c=i++,u=!1;e.push(void 0),a++,n.resolve(t).then(function(t){u||(u=!0,e[c]=t,--a||r(e))},o)}),--a||r(e)});return i&&o(i.error),e.promise},race:function(t){var n=this,e=Bn(n),r=e.reject,o=zn(function(){cn(t,!1,function(t){n.resolve(t).then(e.resolve,r)})});return o&&r(o.error),e.promise}});var Xn=s.Promise,Yn=e(function(t){t.exports={default:Xn,__esModule:!0}}),Zn=n(Yn),te=function(n,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"GET",o=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],i=arguments[4];return new Zn(function(a,c){t.ajax({method:r,url:n,headers:i,async:o,contentType:"application/json",dataType:"json",data:mt(e),success:a,error:function(t){try{c(JSON.parse(t.responseText))}catch(n){c({error:!0,message:"解析JSON出错: "+t.responseText})}}})})},ne="ontouchstart"in window,ee=ne?"touchstart":"click",re=window.location;t(function(){ne&&t("a.js-a").on(ee,function(t){t.preventDefault(),t.stopPropagation(),re.href=t.currentTarget.href})});var oe=ee,ie=1,ae={type:ie,title:["快捷登录","密码登录"],area:{code:"+86",name:"中国"}},ce=t(".js-area-pane"),ue=t(".js-loginId"),se=t(".js-password"),fe=t(".js-login-btn"),le=t(".js-sign-code"),pe={"CSRF-Token":t(".js-csrf").val()},de=!1;t(document).on("keydown",function(t){27===t.keyCode&&a()}).on(oe,".js-area",function(){ce.removeClass("hidden"),pt(ce,"bounceInUp")}).on(oe,".js-back",o).on(oe,".js-locale",function(n){var e=t(n.currentTarget),i=e.data("locale-code"),a=e.data("locale-name");r(ft({},ae,{area:{code:i,name:a}})),o(n)}).on(oe,".js-toggle",function(){r(ft({},ae,{type:ae.type===ie?2:ie,title:[].concat(ae.title.reverse())})),ae.type===ie?xksTrack.track("MobileMall:Login/SignUp:Change_Mode:Click",{loginType:"password"}):xksTrack.track("MobileMall:Login/SignUp:Change_Mode:Click",{loginType:"sms"})}).on(oe,".js-dialog-ok",a).on("input blur keyup",".js-input",function(){var t=!!ue.val().trim();fe.prop("disabled",!(t&&se.val().trim())),de||le.prop("disabled",!t)}).on(oe,".js-sign-code",function(t){t.preventDefault(),t.stopPropagation(),te("/user/sendphonevalidation",{phone:ue.val().trim(),area:ae.area.code},"POST",!0,pe).then(c,function(t){if(t.phone)return void i("手机号码不正确");i("发送短信出错："+t.message)})}).on("submit",".js-form",function(t){t.preventDefault(),fe.prop("disabled",!0).html("登录中&#8230;");var n=t.target;te(n.action,{type:ae.type,loginId:ue.val().trim(),password:se.val().trim(),area:ae.area.code},"POST",!0,pe).then(function(t){if(ae.type===ie?xksTrack.track("MobileMall:Login/SignUp:Submit",{state:"success",loginType:"sms"}):xksTrack.track("MobileMall:Login/SignUp:Submit",{state:"success",loginType:"password"}),mixpanel){fe.html("登录成功");var n=new Date(t.userCreatedDate);mixpanel.identify(t.userId),mixpanel.people.set({"u-username":t.userInfo.nickName,$name:t.userInfo.nickName,$created:n.toISOString()}),t.userPrivateInfo.phone&&mixpanel.people.set({"u-phone":t.userPrivateInfo.phone,$phone:t.userPrivateInfo.phone})}setTimeout(function(){location.href=t.redirect||"/"},1e3)}).catch(function(t){ae.type===ie?xksTrack.track("MobileMall:Login/SignUp:Submit",{state:"fail",loginType:"sms"}):xksTrack.track("MobileMall:Login/SignUp:Submit",{state:"fail",loginType:"password"}),fe.prop("disabled",!1).html("登录"),i(t.message?t.message:t.loginId?"手机号码不正确！":t.password?"密码不正确！":"请求出错！")})}),mixpanel&&mixpanel.track("MobileMall: Login/SignUp: View")});