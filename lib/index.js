require("core-js/modules/es.array.map");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.index = mod.exports;
  }
})(this, function () {
  "use strict";

  // import * as helper from './helper.js'
  var helper = require('./helper');
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
  // require("core-js/stable");
  // require("regenerator-runtime/runtime")


  function LS_CACHE_FILES() {}

  LS_CACHE_FILES.prototype = {
    __LS__MAP: window.__LS__MAP || {},
    // prefix: '',
    init: function init() {
      var _this = this;

      if (this.__LS__MAP.list && helper.isArray(this.__LS__MAP.list)) {
        this.__LS__MAP.list.map(function (item) {
          var prefixPath = helper.domUtils.PREFIX + item.url;
          var LS_value = localStorage.getItem(prefixPath); // 检查localstorage是否可用 不可用 ajax加载

          if (!helper.testCanLocalStorage) {
            console.error('sorry, you can not use this sdk!');
            helper.domUtils.insertFile(url);
          } // 不需要更新的话 直接本地读取


          if (!_this.needUpdate()) {
            console.log('you are useing this LS_CACHE_FILES！');
            console.log('localstorage key:', prefixPath);

            if (LS_value) {
              helper.domUtils.insertFileText(item.url, LS_value);
              return;
            } else {
              // 请求文件 缓存本地
              _this.loadFileAndCache();

              return;
            }
          } // 判断是否存在存储文件 
          // 判断当前版本


          _this.checkFileAndCache(item.url, item.version);
        });

        localStorage.setItem('__LS__version', JSON.stringify(this.__LS__MAP.version));
      }
    },

    /**
     * 
     * 1.判断本地是否有存储该文件
     * 2.判断版本是否相同
     * 之后决定请求文件还是直接使用缓存
     * @param {*} url 
     * @param {*} version 
     */
    checkFileAndCache: function checkFileAndCache(url, version) {
      var prefixPath = helper.domUtils.PREFIX + url;
      var LS_value = localStorage.getItem(prefixPath);

      if (!LS_value) {
        // 请求文件 缓存本地
        this.loadFileAndCache(url, version);
        return;
      } else {
        // 不需要更新
        if (JSON.parse(localStorage.getItem(prefixPath + "_version") == version)) {
          helper.domUtils.insertFileText(url, LS_value);
          return;
        } else {
          // 请求文件 更新缓存本地
          this.loadFileAndCache(url, version);
        }
      }
    },

    /**
     * 请求文件并缓存
     * @param {*} url 
     * @param {*} version 
     */
    loadFileAndCache: function loadFileAndCache(url, version) {
      var prefixPath = helper.domUtils.PREFIX + url;
      helper.domUtils.loadFile(url).then(function (res) {
        helper.domUtils.insertFileText(url, res);
        localStorage.setItem(prefixPath, res);
        localStorage.setItem(prefixPath + "_version", JSON.stringify(version));
      }).catch(function (err) {
        console.log(err); // throw new Error(err)
      });
    },

    /**
     * 检查已经使用的localstorage容量
     */
    checkUsedSpace: function checkUsedSpace() {
      var localStorageLength = localStorage.length;
      var localStorageSize = 0;

      for (var i = 0; i < localStorageLength; i++) {
        var key = localStorage.key(i);
        localStorageSize += localStorage.getItem(key).length;
      }

      return localStorageSize;
    },

    /**
     * 检查localstorage是否可用
     */
    checkCanLocalStorage: function () {
      return helper.testCanLocalStorage();
    }(),

    /**
     * 检查是否需要更新 根据 配置文件来决定是否全量更新
     * @param {*} flag 
     */
    needUpdate: function needUpdate(flag) {
      if (flag !== undefined) {
        return flag;
      }

      if (this.__LS__MAP.version) {
        return JSON.parse(localStorage.getItem('__LS__version')) !== this.__LS__MAP.version;
      }

      return true;
    }
  };
  module.exports = new LS_CACHE_FILES();
});