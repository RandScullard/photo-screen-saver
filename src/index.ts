/// <reference path="../typings/concat-stream/concat-stream.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />

import $ = require("jquery");
import https = require("https");
import vm = require("vm");
import concat = require("concat-stream");
import fs = require("fs");

var imageUrls: string[] = [];
var imageNum = 0;

$(() =>
{
	$(document).on("click keydown", e => window.close());

	let startPageX: number = null;
	let startPageY: number = null;
	$(document).on("mousemove", e =>
	{
		if((startPageX == null) || (startPageY == null))
		{
			startPageX = e.pageX;
			startPageY = e.pageY;
		}
		else
		{
			const moveThreshold = 20;
			if((Math.abs(e.pageX - startPageX) > moveThreshold) || (Math.abs(e.pageY - startPageY) > moveThreshold))
				window.close();
		}
	});

	let startSlideshow = () =>
	{
		shuffle(imageUrls);
		loadNextImage();
		window.setInterval(loadNextImage, 1 * 60 * 1000);
	};

	let useBing = true;

	if(useBing)
		loadImagesFromBingGallery(startSlideshow);
	else
		loadImagesFromFolder("C:/ScreenSaver/", startSlideshow);
});

function loadImagesFromBingGallery(
	startSlideshow: () => void)
{
	https.get(
		{ host: "www.bing.com", path: "/gallery/home/browsedata" },
		res =>
		{
			res.setEncoding("utf8");
			res.pipe(
				concat(
					{ encoding: "string" }, 
					(src: string) => 
					{
						src = `(function(){var window = {};${src}return window.BingGallery})()`;

						let bingGallery: any = null;
						try
						{
							bingGallery = vm.runInThisContext(src, "browsedata");
						}
						catch(err)
						{
							window.alert(`Failed to parse image list from Bing Gallery: ${err.message}`);
							return;
						}

						let imageNames: string[] = bingGallery.browseData.imageNames;
						imageUrls = imageNames.map(name => `http://az619519.vo.msecnd.net/files/${name}_1920x1200.jpg`);

						startSlideshow();
					}
				)
			);
		}
	)
	.on("error", (err: any) =>
	{
		window.alert(`Failed to load image list from Bing Gallery: ${err.message}`);
	});
}

function loadImagesFromFolder(
	folderPath:     string,
	startSlideshow: () => void)
{
	try
	{
		let fileNames = fs.readdirSync(folderPath);
		imageUrls = fileNames
			.filter(fn => fn.match(/\.(jpg|jpeg)$/i) != null)
			.map(fn => `file:///${folderPath}${fn}`);

		startSlideshow();
	}
	catch(err)
	{
		window.alert(`Failed to load image list from folder "${folderPath}": ${err.message}`);
	}
}

function loadNextImage()
{
	$(document.body).children(".photo:not(:last-child)").remove();

	let url = imageUrls[imageNum];
	console.log(`imageNum: ${imageNum} url: ${url}`);

	imageNum++;
	if(imageNum === imageUrls.length)
		imageNum = 0;

	let xOrigin = getRandom(0, 100);
	let yOrigin = getRandom(0, 100);

	let photo =
		$("<div class='photo'/>")
		.css("transform-origin", `${xOrigin}% ${yOrigin}%`)
		.appendTo($(document.body));

	$("<img/>")
		.appendTo(photo)
		.on("error", e =>
		{
			photo.remove();
			loadNextImage();
		})
		.on("load", e =>
		{
			photo.addClass("visible");
		})
		.attr("src", url);
}

// Returns a random integer between min (inclusive) and max (exclusive)
function getRandom(
	min: number,
	max: number)
{
	return Math.floor(Math.random() * (max - min)) + min;
}

// Randomize array element order in-place using Durstenfeld shuffle algorithm.
function shuffle(
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
