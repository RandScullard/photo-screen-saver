// @ts-nocheck Since this file includes raw JavaScript copied from CodePen, we need to disable type checking and eslint.
/* eslint-disable */

import { useEffect } from "react"
import styles from "./demoCanvas.module.scss"

export function DemoCanvas()
{
   useEffect(() => runDemo(), [])

   return (
      <div className={styles.root}>
         <canvas id="canvas"/>
      </div>
   )
}

function runDemo()
{
   let endDemo = false


   // -------------------------------------------------------------------------------------------------
   // Star Field (Canvas)
   // Copyright (c) 2021 by Jonathan Ching (https://codepen.io/chingy/pen/dyyRBwy)

   // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
   // associated documentation files (the "Software"), to deal in the Software without restriction,
   // including without limitation the rights to use, copy, modify, merge, publish, distribute,
   // sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
   // furnished to do so, subject to the following conditions:

   // The above copyright notice and this permission notice shall be included in all copies or
   // substantial portions of the Software.

   // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
   // NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
   // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

   var fps = 60,
      interval = 1000 / fps,
      lastTime = (new Date()).getTime(),
      currentTime = 0,
      delta = 0;

   var starsCount = 1000,
      starsMinSpeed = 0.002,
      starsSpeed = starsMinSpeed,
      stars = [];

   (function() {
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');

      function init() {
         window.onresize();
         window.requestAnimationFrame(render);
      }

      window.onresize = function() {
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight;

         context.fillStyle = "white";
         context.strokeStyle = "white";
         context.translate(canvas.width / 2, canvas.height /2);
      };


      class Star {
         constructor() {
            this.reset();
         }

         reset() {
            this.x = this.random(-canvas.width / 2, canvas.width / 2);
            this.y = this.random(-canvas.height / 2, canvas.height / 2);
            this.z = 0.5;
            this.origX = this.x;
            this.origY = this.y;
         }

         random(min, max) {
            return min + Math.random() * (max - min);
         }

         update() {
            this.origX = this.x;
            this.origY = this.y;
            this.z += starsSpeed;
            this.x += this.x * this.z * starsSpeed;
            this.y += this.y * this.z * starsSpeed;
         }

         draw() {
            context.lineWidth = this.z;
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(this.origX, this.origY);
            context.stroke();
         }
      }

      function update() {
         for(var i = 0; i < stars.length; i++) {
            let star = stars[i];
            star.update();

            if(
               star.x - star.z > canvas.width / 2 ||
               star.x + star.z < -canvas.width / 2 ||
               star.y - star.z > canvas.height / 2 ||
               star.y + star.z < -canvas.height / 2
            ) {
               star.reset();
            }
         }

         if(stars.length < starsCount)
            stars.push(new Star());
      }

      function draw() {
         for(var i = 0; i < stars.length; i++) {
            stars[i].draw();
         }
      }

      function clear() {
         context.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      }

      function render() {
         if(endDemo)
            return

         currentTime = (new Date()).getTime();
         delta = currentTime - lastTime;

         if(delta > interval) {
            update();
            clear();
            draw();

            lastTime = currentTime - (delta % interval);
         }

         window.requestAnimationFrame(() => {
            render();
         });
      }

      init();
   })();
   // -------------------------------------------------------------------------------------------------


   return () => { endDemo = true }
}
