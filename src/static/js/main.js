(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var loginForm=document.getElementById("loginForm"),NICKNAME="nickname",LOGGED_IN="logged-in",LOGGED_OUT="logged-out",login=function(e){document.body.className=LOGGED_IN,window.socket=io(),window.socket.emit(window.events.setNickname,{nickname:e})},nickname=localStorage.getItem(NICKNAME);nickname?login(nickname):document.body.className=LOGGED_OUT;var onFormSubmit=function(e){e.preventDefault();var n=loginForm.querySelector("input"),o=n.value;n.value="",localStorage.setItem(NICKNAME,o),login(o)};loginForm&&loginForm.addEventListener("submit",onFormSubmit);

},{}],2:[function(require,module,exports){
"use strict";require("./login");

},{"./login":1}]},{},[2]);
