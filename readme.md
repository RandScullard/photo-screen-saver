# photo-screen-saver

![icon.png](img/icon.png)

Windows screen saver that displays a photo slideshow, based on the <a href="http://electron.atom.io/">Electron</a> framework.

## Why?

Since modern LCD displays aren't subject to burn-in, screen savers are a thing of the past... right?

Not if you have your HTPC hooked up to a plasma TV -- plasma still has a big problem with burn-in.
Finding myself in that situation, I needed a screen saver that would protect the screen while a movie is paused.
I also wanted it to look great -- it's in my living room, after all -- but every screen saver I tried looked
like it was written decades ago. (Most of them were.)

Modern web technologies make it incredibly easy to create engaging animations. All I needed was a way
to marry the web tools we know and love to the Windows screen saver framework. That's where Electron comes in.

**Please note:** This is currently a Windows-specific project. You can run the code in Electron
on other platforms, but you won't get the screen saver integration with the OS.

## Before You Build

This screen saver displays a photo slideshow with a simple "Ken Burns" effect. It supports three photo sources:

* <a href="https://www.flickr.com/">Flickr</a>: Photos from the group "Flickr's Best Landscape Photographers (Post 1 Award 2)"
* <a href="https://500px.com/">500px</a>: Photos from "Popular"
* A local folder on your computer

Since I didn't feel like implementing a Settings window, you'll need to make some simple code changes to set up
a source. If you take a look at the top of `src/index.ts`, you'll find the following snippet of code. Do what it 
says and uncomment *only* the source you want to use:

    // Uncomment ONE of the following photo sources:
    import { getPhotos } from "./flickr";
    // import { getPhotos } from "./500px";
    // import { getPhotos } from "./local-images";

Then do one of the following:

* **Flickr**: Get a Flickr <a href="https://www.flickr.com/services/api/keys/apply/">API key</a> and put it in `src/api-keys.ts`:

        export const FLICKR_API_KEY = "<your API key goes here>";

* **500px**: Get a 500px <a href="http://500px.com/settings/applications">consumer key</a> and put it in `src/api-keys.ts`:

        export const _500PX_API_KEY = "<your consumer key goes here>";

* **Local**: Edit `src/local-images.ts` and set the FOLDER_PATH to point to your image folder:

        const FOLDER_PATH = "<your path goes here>";

**A quick warning:** When you display random photos from the web, there's always a chance you'll get something you
wouldn't want your kids, your grandma, or your boss to see. These Flickr and 500px API calls are supposed to
avoid anything NSFW, but photos do end up in the wrong category from time to time -- don't say I didn't warn you.
If you want to stay on the safe side, you can always use your own local folder of photos.

## How to Build

**Install:** This project requires <a href="https://nodejs.org">Node.js</a> -- if you've read this far, you 
probably already have it. Once you have Node.js, go to the project folder and run the following command:

    npm install

**Build:** Go to the project folder and run the following command:

    npm run build

**Run:** Once the build is complete, you have a couple of options. If you want to quickly fire it up and see what it does, go to the project folder and run:

    npm start

If you want to install it as a screen saver, look in the `package\photo-screen-saver-win32-x64` subfolder 
and find the file `photo-screen-saver.scr`. Right-click the file and choose `Install`. When you go to the Windows screen 
saver settings, you'll see that `photo-screen-saver` is now your selected screen saver.

## Behind the Scenes

It's a lot easier than I thought to create a screen saver for Windows -- it's just a normal executable
with a .scr extension. The program just needs to display a topmost full-screen window and
exit on mouse or keyboard activity. These requirements are really easy to meet in Electron!

**Note:** This project is the bare minimum and won't give you the mini-preview or Settings features.
The mini-preview is a pain to implement, and to my mind unnecessary. To support Settings you just
need to handle the /S command line argument and display an appropriate UI. (I was too lazy to implement
a Settings UI, but you might feel differently!)

## Possibilities

This project is a good (if minimal) framework for any screen saver you might want to create. For starters, you could
change the Flickr or 500px API calls to get different types of photos. Or you could get photos from 
another source entirely. If photos aren't your cup of tea, try Googling <a href="https://www.google.com/search?q=webgl+demo">WebGL demo</a>
or <a href="https://www.google.com/search?q=three.js+demo">three.js demo</a>, pick the coolest animation you can
find, and incorporate it into `index.ts` and `index.css`. <a href="https://codepen.io/">CodePen</a> is another 
great source of inspiration. Whatever you use, make sure to comply with the license terms!

## License

The MIT License

Copyright (c) 2016 Rand Scullard
