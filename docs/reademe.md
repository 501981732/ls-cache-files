## LS_cashe库

### 利用localstorage缓存静态文件

### babel源文件
https://blog.meathill.com/js/some-tips-of-babel-preset-env-config.html
1. package.json

```
  "scripts": {
    "prod": "webpack --mode=production",
    "dev": "webpack --mode=development",
    "babel": "babel src -d lib --copy-files",
    "prepublish": "babel src -d lib --copy-files & webpack --mode=production"
  },
```

2. .babelrc

npm install --save @babel/polyfill
npm install --save @babel/preset-env
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime

```
{
  "presets": [
    [
      "@babel/preset-env",
    ]
  ],
    "plugins": ["@babel/plugin-transform-runtime"]
}
```

1. **polyfill** 由于用到了promise Object.keys 等 需要垫片,写SDK最好用es3等，尽量减少垫片的使用，使包越小越好


#### 方式1

    - "useBuiltIns": "usage" 不需要再入口文件再单独引入polyfill
>  When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed  Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead.

**也是最佳方案**

    ```
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage",
            "corejs": 3
          }
        ]
      ],
        "plugins": ["@babel/plugin-transform-runtime"]
    }
    ```

### 方式2

```
    - "useBuiltIns": "entry"
    - 然后在入口手动引入 import "@babel/polyfill";
```

### 方式3

> @babel/polyfill 是对 core-js的封装，引用了core-js的内容和生成器（regenerator-runtime)。 v7.4之后，这个仓库就被废弃了，希望用户自己选择使用哪个兼容库。

之前
```
import "@babel/polyfill";
```
之后改为

```
import "core-js/stable";
import "regenerator-runtime/runtime";
```
但是并未发现是按需加载，打包之后仍然很大，so**目前@babel/preset-env + useBuiltIns: 'usage' 仍然是最好的选择**

##### core-js2 core-js3 区别

 >core-js 2 封版于 1.5 年之前，所以里面只有对 1.5 年之前 feature 的 polyfill，最近 1.5 年新增的 feature 都不支持，也就存在因为新功能没有 polyfill 于是在旧浏览器里失败的风险。

### 报错问题

```
 Cannot assign to read only property 'exports' of object '#<Object>'
```
webpack打包后总是出现这种问题,google的答案大都是 (You can't mix import and module.exports)[https://github.com/webpack/webpack/issues/4039],
但是本身并未发现这种问题，之后全部改为es6语法模块后ok，但是通过script导出的全局变量会是 LSCacheFiles.default，多一层.
改为commonjs语法后排查问题，发现不babel的话没问题，so问题出在babel配置项。之前babelrc

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
      }
    ]
  ],
    "plugins": ["@babel/plugin-transform-runtime"]
}
```
[babel-preset-env](https://babeljs.io/docs/en/babel-preset-env)配置项目中发现modules字段有umd的配置,改为umd，配合webpack中的 libraryTarget: 'umd'搞定。