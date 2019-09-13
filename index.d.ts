// declare module 'ls-cache-files' {
//     const LSCacheFiles: Options;
//     export default LSCacheFiles;
//     interface Options {
//       init:() => void;
//       needUpdate:(flag?:boolean) => void;
//       loadFileAndCache: (url:string,v:string|number) => void;
//       checkFileAndCache: (url:string,v:string|number) => void; 
//     }
//   }

  declare const LSCacheFiles: ILSCacheFiles
 
  interface ILSCacheFiles {
    init:() => void;
    needUpdate:(flag?:boolean) => void;
    loadAndCacheFile: (url:string,v:string|number) => void;
    checkAndCacheFile: (url:string,v:string|number) => void; 
    checkCanLocalStorage: boolean;
    needUpdate: (flag?:boolean) => void;
  }
  export default LSCacheFiles