/*
 * Lib.js is used to store logic for general app wide utility functions.
 */
var tools = (function() {
  'use strict';

  /*
   *  ajaxCall - Provides basic ajax functionality
   *  options {object}:
   *    verb {string} - http action verb
   *    url {string} - url to make ajax call to
   *    successCallBack {function} - callback funciton on ajax success
   *    failCallBack {function} - callback function on ajax fail
   */
  function ajaxCall(options) {
    var verb = options.verb || 'GET';
    var url = options.url || '';
    var successCB = options.successCallBack || function() {};
    var failCB = options.failCallBack || function() {};
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      return false;
    }

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          successCB(JSON.parse(httpRequest.responseText));
        } else {
          failCB();
        }
      }

    };
    httpRequest.open(verb, url);
    httpRequest.send();
  }

  /*
   *  debounce - Provides simple debounce functionality
   *  func {object} - function to add debounce to
   *  wait {integer} - milliseconds to wait
   */
  function debounce(func, wait) {
    var timeout;

    return function () {
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        func(args);
      }, wait);
    };
  }

  return {
    ajaxCall: ajaxCall,
    debounce: debounce
  };
})();
