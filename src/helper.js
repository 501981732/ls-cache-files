function testCanLocalStorage() {
    const mod = 'modernizr';
    const localStorage = window.localStorage;
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
};

function isType(type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === `[object ${type}]`
    }
}

const isArray = isType('Array')

function analysisFile (path) {
    if (path) {
        let toArr = path.split('/')
        let fileName = toArr[toArr.length - 1]
        let fileNameToArr = fileName.split('.')
        if (fileName && fileNameToArr) {
            return {
                name: fileName,
                hash: fileNameToArr[fileNameToArr.length - 2],
                type: fileNameToArr[fileNameToArr.length - 1],
            }
        }
    }
    // if (path) {
    //     let toArr = path.split('.')
    //     return toArr[toArr.length - 1]
    // }
    return {}
}
const domUtils = {
    PREFIX: '__LS__',
    /**
     * 动态插入文件 自动判断js css
     * @Author   wangmeng
     * @DateTime 2019-08-16
     * @param    {[type]}   path [description]
     */
    insertFile: function (path) {
        let head = document.getElementsByTagName('HEAD')[0];
        let link;
        let type = analysisFile(path) && analysisFile(path).type
        if (type === "js") {
            link = document.createElement("script");
            link.type = "text/javascript";
            link.charset = 'utf-8';
            link.id = this.PREFIX + analysisFile(path).name;
            link.src = path;
        } else {
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.id = this.PREFIX + analysisFile(path).name;
            link.href = path;
        }
        head.appendChild(link);
    },
    /**
     * 将请求的js css内容插入到模板上
     * @Author   wangmeng
     * @DateTime 2019-08-16
     * @param    {[type]}   text [description]
     * @return   {[type]}        [description]
     */
    insertFileText: function (url, text) {
        let head = document.getElementsByTagName('HEAD')[0];
        let link;
        let type = analysisFile(url) && analysisFile(url).type
        if (type === "js") {
            link = document.createElement("script");
            link.type = "text/javascript";
            link.id = this.PREFIX + analysisFile(url).name;
            link.innerHTML = text;
            // or
            // eval(text)
        } else {
            link = document.createElement("style");
            link.type = "text/css";
            link.id = this.PREFIX + analysisFile(url).name;
            link.innerHTML = text;
        }
        head.appendChild(link);
    },

    /**
     * 下载文件
     * @param {string} url 
     * @return {promise} 
     */
    loadFile: function (url) {
        return new Promise((reslove, reject) => {
            let xhr;
            if (window.ActiveXObject) {
                // eslint-disable-next-line no-undef
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }
            if (xhr) {
                // todo 跨域支持
                // c.58cdn.com.cn不支持跨域-> img.58.com.cn
                xhr.open('GET', url)
                xhr.send()
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            let text = xhr.responseText;
                            reslove(text)
                        } else {
                            reject(xhr)
                        }
                    }
                }
            }
        })
    }
}


module.exports = {
    isType,
    isArray,
    testCanLocalStorage,
    domUtils
}
