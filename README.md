### LS CACHE

- 利用浏览器缓存机制，缓存静态资源（css,js），等第二次请求时，直接从本地文件中中读取资源

- 首次加载的情况下 会动态加载js 并将内容存到localStorage
- 非首次加载 会从localStorage中取出来执行？ 或者 插入到模板中？
- 关键点是设计一套缓存更新机制。对缓存的js增加后缀(时间戳或hash等)来设置独一无二的版本标识。
- 每次RD同步传一份资源的配置文件(或者FE自己维护)，FE根据配置文件和缓存中的文件进行版本标识。从而决定是利用缓存还是重新请求。

### useage

1. 模板中同步一份配置文件

```
window.__LS__MAP = {
    'js/vue.js': 'https://j1.58cdn.com.cn/git/hrg-innovate/pc-super-employer-home/static/js/vue.chunk_v20190808162950.js'//资源地址
}
```

2. 初始化

```
import LSCacheFiles from 'ls-cache-files'
LSCacheFiles.init()
```