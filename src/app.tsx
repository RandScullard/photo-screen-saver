import { useEffect, useRef } from "react"
import { closeWindow } from "./utils"
import { PhotoSlideshow } from "./photoSlideshow"
import { DemoCanvas } from "./demoCanvas"
import { DemoCss } from "./demoCss"
import { DemoShader } from "./demoShader"
import { DemoThreeJs } from "./demoThreeJs"
import styles from "./app.module.scss"

// Choose the component you want to display in the screen saver:
type ShowComponent = typeof PhotoSlideshow | typeof DemoCanvas | typeof DemoCss | typeof DemoShader | typeof DemoThreeJs
const SHOW_COMPONENT: ShowComponent = PhotoSlideshow

export function App()
{
   const refRoot = useRef<HTMLDivElement>(null)
   const refStartMousePos = useRef({ x: NaN, y: NaN })

   useEffect(() =>
   {
      refRoot.current!.focus()
   },
   [])

   function onMouseMove(
      e: React.MouseEvent<HTMLDivElement>)
   {
      if(isNaN(refStartMousePos.current.x))
      {
         refStartMousePos.current = { x: e.pageX, y: e.pageY }
      }
      else
      {
         // Don't close the window on tiny movements of the mouse (from vibrations, for example).
         const moveThreshold = window.screen.width * 0.02
         if((Math.abs(e.pageX - refStartMousePos.current.x) > moveThreshold)
         || (Math.abs(e.pageY - refStartMousePos.current.y) > moveThreshold))
         {
            closeWindow()
         }
      }
   }

   return (
      <div
         ref={refRoot}
         className={styles.root}
         tabIndex={-1}
         onClick={e => closeWindow()}
         onKeyDown={e => closeWindow()}
         onMouseMove={onMouseMove}
      >
         <SHOW_COMPONENT/>
      </div>
   )
}
