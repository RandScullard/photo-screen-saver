import fs from "fs"
import { contextBridge } from "electron"
import { LOCAL_FOLDER_PATH } from "./constants"
import { Photo } from "./photo"

contextBridge.exposeInMainWorld("api", { getLocalPhotos })

function getLocalPhotos(): Photo[]
{
   let folderPath = LOCAL_FOLDER_PATH
   if(!folderPath.endsWith("/"))
      folderPath += "/"

   const fileNames = fs.readdirSync(folderPath)

   const photos = fileNames
      .filter(fn => fn.match(/\.(jpg|jpeg)$/i) != null)
      .map(fn => ({
         url: `file:///${folderPath}${fn}`,
         title: "",
         attribution: "",
      }))

   return photos
}
