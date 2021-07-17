// @ts-nocheck Since this file includes raw JavaScript copied from CodePen, we need to disable type checking and eslint.
/* eslint-disable */

import { useEffect } from "react"
import * as THREE from "three"
import styles from "./demoThreeJs.module.scss"

export function DemoThreeJs()
{
   useEffect(() => runDemo(), [])

   return (
      <div className={styles.root}>
         <canvas/>
      </div>
   )
}

function runDemo()
{
   let endDemo = false

   // -------------------------------------------------------------------------------------------------
   // Rainbow Tunnel
   // Copyright (c) 2021 by Tibix (https://codepen.io/Tibixx/pen/mvLrqe)

   // Permission is hereby granted, free of charge, to any person obtaining a copy of this software
   // and associated documentation files (the "Software"), to deal in the Software without
   // restriction, including without limitation the rights to use, copy, modify, merge, publish,
   // distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
   // Software is furnished to do so, subject to the following conditions:

   // The above copyright notice and this permission notice shall be included in all copies or
   // substantial portions of the Software.

   // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
   // BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
   // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

   var p = [
      [389,246,0],
      [410,255,20],
      [413,268,7],
      [431,261,12],
      [418,244,30],
      [416,217,25],
      [420,205,8],
      [427,227,-20],
      [432,236,5],
      [444,228,12],
      [451,232,41],
      [446,246,72],
      [443,264,96],
      [446,278,65],
      [463,267,20],
      [460,258,-10],
      [464,243,-20],
      [459,233,0],
      [475,225,22],
      [484,225,29],
      [490,214,51],
      [476,202,55],
      [462,202,55],
      [446,205,42],
      [440,192,42],
      [430,183,72],
      [413,184,58],
      [406,191,32],
      [406,207,0],
      [402,220,0],
      [390,222,20],
      [385,228,10],
      [389,246,0]
   ];

   var w = window.innerWidth, h = window.innerHeight;
   window.onresize = function(){
      var w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize( w, h );
   }

   var cameraSpeed = .0001;
   var lightSpeed = .001;
   var tubularSegments = 1000;
   var radialSegments = 4;
   var tubeRadius = 2;
   var ambientLight = 0x222222;
   var lightColor = 0xffffff;
   var lightIntensity = 1;
   var lightDistance = 20;
   var hs = 0; // Hue-Start
   var he = 360; // Hue-End

   var renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas")!,
      antialias: true,
   });
   renderer.setSize(w, h);

   var scene = new THREE.Scene();
   var camera = new THREE.PerspectiveCamera(60, w / h, .001, 1000);

   var starsGeometry = new THREE.BufferGeometry();
   var starPositions = [];

   for(var i=0; i<3000; i++){
      var x = THREE.MathUtils.randFloatSpread(1500);
      var y = THREE.MathUtils.randFloatSpread(1500);
      var z = THREE.MathUtils.randFloatSpread(1500);
      starPositions.push(x, y, z);
   }

   starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

   var starsMaterial = new THREE.PointsMaterial({color: 0xffffff});
   var starField = new THREE.Points(starsGeometry,starsMaterial);
   scene.add(starField);

   var vecs = []
   for (var i=0; i<p.length; i++) {
      var x = p[i][0];
      var y = p[i][2];
      var z = p[i][1];
      vecs.push(new THREE.Vector3(x,y,z))
   }
   var path = new THREE.CatmullRomCurve3(vecs);
   var geometry = new THREE.TubeGeometry(path,tubularSegments,tubeRadius,radialSegments,true);
   var vertexCount = geometry.getAttribute("position").count

   var vertexColors = [];

   var hue = hs;
   var hup = true;
   for(var i=0; i<vertexCount; i++){
      hup?hue++:hue--;
      hue==he?hup=false:(hue==hs)?hup=true:0;
      var color = new THREE.Color("hsl("+hue+",100%,50%)");
      vertexColors.push(color.r, color.g, color.b);
   }

   geometry.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));

   var material = new THREE.MeshLambertMaterial({
      side: THREE.BackSide,
      vertexColors: true,
      wireframe: true
   });

   var tube = new THREE.Mesh(geometry, material);
   scene.add(tube);

   var light = new THREE.PointLight(0xffffff, 1, 50);
   scene.add(light);
   var light2 = new THREE.AmbientLight(ambientLight);
   scene.add(light2);

   var l1 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
   scene.add(l1);
   var l2 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
   scene.add(l2);
   var l3 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
   scene.add(l3);
   var l4 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
   scene.add(l4);
   var l5 = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
   scene.add(l5);

   var pct = 0;
   var pct2 = 0;
   function render(){
      if(endDemo)
         return

      pct += cameraSpeed
      pct2 += lightSpeed;
      var pt1 = path.getPointAt(pct%1);
      var pt2 = path.getPointAt((pct + .001)%1);
      camera.position.set(pt1.x,pt1.y,pt1.z);
      camera.lookAt(pt2);
      light.position.set(pt2.x, pt2.y, pt2.z);
      
      l1.position.set(path.getPointAt((pct2+.0)%1).x, path.getPointAt((pct2+.0)%1).y, path.getPointAt((pct2+.0)%1).z);
      l2.position.set(path.getPointAt((pct2+.2)%1).x, path.getPointAt((pct2+.2)%1).y, path.getPointAt((pct2+.2)%1).z);
      l3.position.set(path.getPointAt((pct2+.4)%1).x, path.getPointAt((pct2+.4)%1).y, path.getPointAt((pct2+.4)%1).z);
      l4.position.set(path.getPointAt((pct2+.6)%1).x, path.getPointAt((pct2+.6)%1).y, path.getPointAt((pct2+.6)%1).z);
      l5.position.set(path.getPointAt((pct2+.8)%1).x, path.getPointAt((pct2+.8)%1).y, path.getPointAt((pct2+.8)%1).z);

      renderer.render(scene, camera);
      requestAnimationFrame(render);
   }
   requestAnimationFrame(render);
   // -------------------------------------------------------------------------------------------------


   return () => { endDemo = true }
}
