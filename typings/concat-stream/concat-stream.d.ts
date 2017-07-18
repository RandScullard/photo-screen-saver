declare module "concat-stream" 
{
	import stream = require("stream");

	interface ConcatStreamOptions
	{
		// string - get a string
		// buffer - get back a Buffer
		// array - get an array of byte integers
		// uint8array, u8, uint8 - get back a Uint8Array
		// object - get back an array of Objects
		encoding?: string
	}

	var concatStream:
	{
		(cb: (data: any) => any): stream.Writable;
		(opts: ConcatStreamOptions, cb: (data: any) => any): stream.Writable;
	}

	export = concatStream;
}
