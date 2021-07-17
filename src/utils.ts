// Return a random integer between min (inclusive) and max (exclusive)
export function getRandom(
   min: number,
   max: number)
{
   return Math.floor(Math.random() * (max - min)) + min
}

// Randomize array element order in-place using Durstenfeld shuffle algorithm
export function shuffle(
   array: Array<any>)
{
   for(let i = array.length - 1; i > 0; i--)
   {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
   }
}

export function closeWindow()
{
   // We only want to close the window when we're running in Electron, because it's annoying when
   // you're testing in the browser and the window keeps closing. If we're running in the browser
   // (testing in webpack-dev-server, for example) window.api won't be defined. It is only defined
   // when Electron runs the script in preload.ts, and that script calls contextBridge.exposeInMainWorld.
   if(typeof (window as any).api !== "undefined")
      window.close()
}

export function delay(
   timeout: number)
{
   return new Promise<void>(resolve => window.setTimeout(resolve, timeout))
}
