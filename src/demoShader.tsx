import { useEffect } from "react"
import GLea from "glea"
import styles from "./demoShader.module.scss"

export function DemoShader()
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

   const vert = `
      precision highp float;
      attribute vec2 position;

      void main() {
         gl_Position = vec4(position, 0, 1.0);
      }
   `

   const frag = `
      // -------------------------------------------------------------------------------------------------
      // Example shader, author unknown. Source: http://glslsandbox.com/e#73334.2

      #define res resolution
      precision highp float;
      uniform float time;
      uniform vec2 res;

      vec2 hash22(vec2 p){
         vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));
         p3+=dot(p3,p3.yzx+33.33);
         return fract((p3.xx+p3.yz)*p3.zy);
      }
      vec2 hash(vec2 p,float a){
         p+=time*a+dot(hash22(p),vec2(1));
         return mix(hash22(floor(p)),hash22(ceil(p)),smoothstep(0.,1.,fract(p)));
      }
      float voronoi(vec2 p){
         vec2 g=floor(p);vec2 f=fract(p);float dist=1.;
         for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++)
            dist=min(dist,distance(vec2(x,y)+hash(g+vec2(x,y),1.),f));
         return dist;
      }
      float perlin(vec2 p){
         vec2 g=floor(p);vec2 f=fract(p);vec2 s=smoothstep(0.,1.,f);const float a=.2;
         return mix(
            mix(dot(hash(g+vec2(0,0),a),f-vec2(0,0)),dot(hash(g+vec2(1,0),a),f-vec2(1,0)),s.x),
            mix(dot(hash(g+vec2(0,1),a),f-vec2(0,1)),dot(hash(g+vec2(1,1),a),f-vec2(1,1)),s.x),
         s.y);
      }

      void main(){
         vec2 st=gl_FragCoord.xy/res;
         vec2 uv=st*2.-1.;uv.x*=res.x/res.y;
         
         float dist=1./abs((voronoi(uv*16.+time)+perlin(uv*.3-time*.1)*8.)*16.);
         vec3 col=sin(time+vec3(0,2.1,4.2)+perlin(uv*.5+time*.05)*4.)*.5+.5;
         
         gl_FragColor =vec4(dist*col*1.5,1);
      }

      // -------------------------------------------------------------------------------------------------
   `

   const glea = new GLea({ shaders: [GLea.fragmentShader(frag), GLea.vertexShader(vert)] }).create()

   window.addEventListener("resize", () => glea.resize())

   function loop(
      time: number)
   {
      if(endDemo)
         return

      const { gl, width, height } = glea

      glea.clear()
      glea.uniV("resolution", [width, height])
      glea.uni("time", time / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      requestAnimationFrame(loop)
   }

   requestAnimationFrame(loop)

   return () => { endDemo = true }
}
