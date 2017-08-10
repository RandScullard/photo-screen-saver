import concat = require("concat-stream");
import * as http from "http";
import * as https from "https";


export function downloadString(
	dataUrl: string)
{
	return new Promise<string>((resolve, reject) =>
	{
		(dataUrl.startsWith('https') ? https.get : http.get)(dataUrl, res =>
		{
			if(res.statusCode < 200 || res.statusCode > 299)
				reject(new Error(`Failed to load ${dataUrl}, status code ${res.statusCode}`));

			res.setEncoding("utf8");
			res.pipe(
				concat(
					{ encoding: "string" }, 
					(src: string) => resolve(src)
				)
			);
		})
		.on("error", (err: any) => reject(err));
	});
}

export function isNullOrEmpty(
	value: string)
{
	return (value == null) || (value.length === 0);
}

// Returns a random integer between min (inclusive) and max (exclusive)
export function getRandom(
	min: number,
	max: number)
{
	return Math.floor(Math.random() * (max - min)) + min;
}

// Randomize array element order in-place using Durstenfeld shuffle algorithm.
export function shuffle(
	array: Array<any>)
{
	for(let i = array.length - 1; i > 0; i--)
	{
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}
