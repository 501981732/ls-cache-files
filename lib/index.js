"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.object.values");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * 利用localstorage 缓存js css文件
 * 同步配置信息
 * window.__LS_MAP = {'vue':''}
 * 暂不考虑加载顺序
 * 首次加载的情况下 会动态加载js 并将内容存到localStorage
 * 非首次加载 会从localStorage中取出来执行？ 或者 插入到模板中？
 */

/**
 * 关键点是设计一套缓存更新机制。对缓存的js增加后缀(时间戳或hash等)来设置独一无二的版本标识。
 * 每次后端同步传一份资源的配置文件，FE根据配置文件和缓存中的文件进行版本标识。从而决定是利用缓存还是重新请求。
 *
 */
// window.__LS__MAP = {
//     'main': 'https://j1.58cdn.com.cn/git/hrg-innovate/pc-super-employer-home/static/js/main.chunk_v20190808162950.js',
// }
// useage 
// import LSCacheFiles from './xx';
// LSCacheFiles.init()
// import 'whatwg-fetch'
// import 'core-js/fn/promise';
// import "@babel/polyfill";
// import "core-js/stable";
// import "regenerator-runtime/runtime";
;
var PREFIX = '__LS__';
var localStorage = window.localStorage;

function isType(type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === "[object ".concat(type, "]");
  };
}

var isArray = isType('Array');

function analysisFile(path) {
  if (path) {
    var toArr = path.split('/');
    var fileName = toArr[toArr.length - 1];
    var fileNameToArr = fileName.split('.');

    if (fileName && fileNameToArr) {
      return {
        name: fileName,
        hash: fileNameToArr[fileNameToArr.length - 2],
        type: fileNameToArr[fileNameToArr.length - 1]
      };
    }
  } // if (path) {
  //     let toArr = path.split('.')
  //     return toArr[toArr.length - 1]
  // }


  return {};
}
/**
 * 动态插入文件 自动判断js css
 * @Author   wangmeng
 * @DateTime 2019-08-16
 * @param    {[type]}   path [description]
 */


function insertFile(path) {
  var head = document.getElementsByTagName('HEAD')[0];
  var link;
  var type = analysisFile(path) && analysisFile(path).type;

  if (type === "js") {
    link = document.createElement("script");
    link.type = "text/javascript";
    link.charset = 'utf-8';
    link.id = PREFIX + analysisFile(path).name;
    link.src = path;
  } else {
    link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.id = PREFIX + analysisFile(path).name;
    link.href = path;
  }

  head.appendChild(link);
}
/**
 * 将请求的js css内容插入到模板上
 * @Author   wangmeng
 * @DateTime 2019-08-16
 * @param    {[type]}   text [description]
 * @return   {[type]}        [description]
 */


function insertFileText(url, text) {
  var head = document.getElementsByTagName('HEAD')[0];
  var link;
  var type = analysisFile(url) && analysisFile(url).type;

  if (type === "js") {
    link = document.createElement("script");
    link.type = "text/javascript";
    link.id = PREFIX + analysisFile(url).name;
    link.innerHTML = text; // or
    // eval(text)
  } else {
    link = document.createElement("style");
    link.type = "text/css";
    link.id = PREFIX + analysisFile(url).name;
    link.innerHTML = text;
  }

  head.appendChild(link);
}
/**
 * 下载文件
 * @param {string} url 
 * @return {promise} 
 */


function loadFile(url) {
  return new Promise(function (reslove, reject) {
    var xhr;

    if (window.ActiveXObject) {
      // eslint-disable-next-line no-undef
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    }

    if (xhr) {
      // todo 跨域支持
      // c.58cdn.com.cn不支持跨域-> img.58.com.cn
      xhr.open('GET', url);
      xhr.send();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            var text = xhr.responseText;
            reslove(text);
          } else {
            reject(xhr);
          }
        }
      };
    }
  });
}

function init() {}

var LS_CACHE_FILES =
/*#__PURE__*/
function () {
  function LS_CACHE_FILES() {
    (0, _classCallCheck2.default)(this, LS_CACHE_FILES);
  }

  (0, _createClass2.default)(LS_CACHE_FILES, [{
    key: "init",
    value: function init() {
      var values = Object.values;

      var __LS__MAP = window.__LS__MAP || {};

      !!values(__LS__MAP) && values(__LS__MAP).forEach(function (path) {
        var prefixPath = PREFIX + path;

        if (localStorage) {
          var LS_value = localStorage.getItem(prefixPath); // 请求数据 + 插入数据 + 缓存数据

          if (!LS_value) {
            loadFile(path).then(function (res) {
              insertFileText(path, res);
              localStorage.setItem(prefixPath, res);
            }).catch(function (err) {
              console.log(err); // throw new Error(err)
            });
          } else {
            insertFileText(path, LS_value);
            return;
          }
        } else {
          insertFile(path);
          return;
        }
      });
    }
  }]);
  return LS_CACHE_FILES;
}();

var _default = new LS_CACHE_FILES();

exports.default = _default;