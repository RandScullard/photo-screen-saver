// This product uses the Unsplash API but is not endorsed or certified by Unsplash.

import { createApi } from "unsplash-js"
import { UNSPLASH_API_KEY } from "./constants"
import { Photo } from "./photo"

const SEARCH_TERMS = "mountain ocean forest"

export async function getUnsplashPhotos(): Promise<Photo[]>
{
   if(!UNSPLASH_API_KEY)
      throw new Error("To use the unsplash module, you must set UNSPLASH_API_KEY in constants.ts.")

   const api = createApi({ accessKey: UNSPLASH_API_KEY })

   let photos = [] as Photo[]

   // This code supports loading multiple pages of search results, but querying each page counts
   // against your rate limit. You can use the initial value of totalPages to limit the number of
   // pages that will be loaded, while still returning enough photos to give you sufficient variety.
   let totalPages = 5
   let currPage = 1

   while(currPage <= totalPages)
   {
      const response = await api.search.getPhotos({
         query: SEARCH_TERMS,
         orientation: "landscape",
         orderBy: "latest",
         perPage: 30,
         page: currPage,
      })

      if(response.errors)
         throw new Error("Failed to load list of photos from Unsplash: " + response.errors.join("\n"))

      totalPages = Math.min(totalPages, response.response.total_pages)

      const currPhotos = response.response.results
         .map(photo => ({
            url: photo.urls.raw + "&auto=format&w=1920",
            width: photo.width,
            height: photo.height,
            title: photo.description ?? "Untitled",
            attribution: `by ${photo.user.name} on Unsplash`,
         }))
         .filter(photo => 
         {
            const aspectRatio = photo.width / photo.height
            return aspectRatio >= 1.5 && aspectRatio <= 1.9
         })

      photos = photos.concat(currPhotos)

      currPage++
   }

   return photos
}
