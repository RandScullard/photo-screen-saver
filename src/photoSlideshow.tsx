import { useEffect, useReducer } from "react"
import { Transition, TransitionGroup } from "react-transition-group"
import classNames from "classnames"
import { closeWindow, delay, getRandom, shuffle } from "./utils"
import { Photo } from "./photo"
import { getFlickrPhotos } from "./flickrPhotos"
import { getLocalPhotos } from "./localPhotos"
import styles from "./photoSlideshow.module.scss"

// Choose the source for the photos you want to display:
type GetPhotosFn = typeof getFlickrPhotos | typeof getLocalPhotos
const GET_PHOTOS: GetPhotosFn = getFlickrPhotos

// Keep these in sync with photoSlideshow.module.scss:
const PHOTO_INTERVAL = 60
const FADE_IN_DURATION = 5

const SECONDS = 1000

export function PhotoSlideshow()
{
   const [state, dispatch] = useReducer(reducer, initialState)

   useEffect(() =>
   {
      async function load()
      {
         try
         {
            const photos = await GET_PHOTOS()

            if(photos.length === 0)
               throw new Error("No photos found that meet criteria.")

            console.log(`${photos.length} photos found that meet criteria`)

            shuffle(photos)
            dispatch({ type: "load", photos })
         }
         catch(err)
         {
            window.alert(err.toString())
            closeWindow()
         }
      }

      load()
   },
   [])

   useEffect(() =>
   {
      if(state.photos.length > 0)
      {
         const interval = window.setInterval(() => dispatch({ type: "next" }), PHOTO_INTERVAL * SECONDS)
         return () => window.clearInterval(interval)
      }
   },
   [state.photos])

   useEffect(() =>
   {
      if(state.photoIdx >= 0)
         console.log(`photo ${state.photoIdx}: ${state.photos[state.photoIdx].url}`)
   },
   [state.photos, state.photoIdx])

   async function onImageLoad()
   {
      // If we dispatch the imageload action too quickly, the visible style will be added to the
      // photo div too quickly and the browser won't run its animations. This delay is enough to
      // solve the problem.
      await delay(100)

      dispatch({ type: "imageload" })
   }

   return (
      <div className={styles.root}>
         {state.photoIdx >= 0 &&
            <TransitionGroup>
               <Transition key={state.photoIdx} timeout={(FADE_IN_DURATION + 1) * SECONDS} appear={true}>
                  <>
                     <div
                        className={classNames(styles.photo, { [styles.visible]: state.isImageLoaded })}
                        style={{ zIndex: state.zIndex, transformOrigin: `${state.origin.x}% ${state.origin.y}%` }}
                     >
                        <img
                           src={state.photos[state.photoIdx].url}
                           alt=""
                           onLoad={onImageLoad}
                           onError={e => dispatch({ type: "next" })}
                        />
                     </div>
                     <label
                        className={classNames(styles[`pos${state.photoIdx % 4}`], { [styles.visible]: state.isImageLoaded })}
                        style={{ zIndex: state.zIndex }}
                     >
                        {getCaption(state.photos[state.photoIdx])}
                     </label>
                  </>
               </Transition>
            </TransitionGroup>
         }
      </div>
   )
}

interface State
{
   photos: Photo[],
   photoIdx: number,
   zIndex: number,
   origin: { x: number, y: number },
   isImageLoaded: boolean,
}

const initialState: State =
{
   photos: [],
   photoIdx: -1,
   zIndex: 0,
   origin: { x: 0, y: 0 },
   isImageLoaded: false,
}

interface ActionLoad
{
   type: "load",
   photos: Photo[],
}

interface ActionNext
{
   type: "next"
}

interface ActionImageLoad
{
   type: "imageload"
}

type Action = ActionLoad | ActionNext | ActionImageLoad

function reducer(
   state: State,
   action: Action)
: State
{
   switch(action.type)
   {
      case "load":
         return {
            photos: action.photos,
            photoIdx: 0,
            zIndex: 1,
            origin: getRandomOrigin(),
            isImageLoaded: false
         }

      case "next":
         return {
            ...state,
            photoIdx: (state.photoIdx >= state.photos.length - 1) ? 0 : state.photoIdx + 1,
            zIndex: state.zIndex + 1,
            origin: getRandomOrigin(),
            isImageLoaded: false,
         }

      case "imageload":
         return { ...state, isImageLoaded: true }
   }
}

function getRandomOrigin()
{
   return { x: getRandom(0, 100), y: getRandom(0, 100) }
}

function getCaption(
   photo: Photo)
{
   if(photo.title || photo.attribution)
      return `${photo.title || "(Untitled)"} ${photo.attribution}`

   return ""
}
