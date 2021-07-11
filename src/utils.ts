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

export function delay(
   timeout: number)
{
   return new Promise<void>(resolve => window.setTimeout(resolve, timeout))
}
