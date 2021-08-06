(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var _sockets=require("./sockets"),loginForm=document.getElementById("loginForm"),NICKNAME="nickname",LOGGED_IN="logged-in",LOGGED_OUT="logged-out",login=function(e){document.body.className=LOGGED_IN;var o=io();(0,_sockets.initSocket)(o),o.emit(window.events.setNickname,{nickname:e})},nickname=localStorage.getItem(NICKNAME);nickname?login(nickname):document.body.className=LOGGED_OUT;var onFormSubmit=function(e){e.preventDefault();var o=loginForm.querySelector("input"),n=o.value;o.value="",localStorage.setItem(NICKNAME,n),login(n)};loginForm&&loginForm.addEventListener("submit",onFormSubmit);

},{"./sockets":4}],2:[function(require,module,exports){
"use strict";require("./sockets"),require("./login"),require("./notifications");

},{"./login":1,"./notifications":3,"./sockets":4}],3:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.handleDisconnectedUser=exports.handleNewUser=void 0;var notifications=document.querySelector(".notifications"),USER_IN="notification--user-in",USER_OUT="notification--user-out",showNotification=function(e,n){var t=document.createElement("div");t.innerText=e,t.classList.add(n),notifications.appendChild(t)},handleNewUser=function(e){var n=e.nickname;return showNotification("".concat(n," just joined!!"),USER_IN)};exports.handleNewUser=handleNewUser;var handleDisconnectedUser=function(e){var n=e.nickname;return showNotification("".concat(n," just left!!"),USER_OUT)};exports.handleDisconnectedUser=handleDisconnectedUser;

},{}],4:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.initSocket=exports.getSocket=void 0;var _notifications=require("./notifications"),socket=null,getSocket=function(){return socket};exports.getSocket=getSocket;var setSocket=function(e){return socket=e},initSocket=function(e){var t=window.events;setSocket(e),socket.on(t.newUser,_notifications.handleNewUser),socket.on(t.disconnectedUser,_notifications.handleDisconnectedUser)};exports.initSocket=initSocket;

},{"./notifications":3}]},{},[2]);
