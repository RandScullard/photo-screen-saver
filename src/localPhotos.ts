import { Photo } from "./photo"

export function getPhotos(): Promise<Photo[]>
{
   const api = (window as any).api

   // If we're running in the browser (testing in webpack-dev-server, for example) window.api won't
   // be defined. It is only defined when Electron runs the script in preload.ts, and that script
   // calls contextBridge.exposeInMainWorld.
   if(typeof api === "undefined")
      throw new Error("The localPhotos module only works when running in Electron.")

   const photos = api.getLocalPhotos()
   return Promise.resolve(photos)
}
