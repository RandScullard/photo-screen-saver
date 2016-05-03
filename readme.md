photo-screen-saver
==================

Windows screen saver that displays a photo slideshow, based on the <a href="http://electron.atom.io/">Electron</a> framework.

Why?
----

Since modern LCD displays aren't subject to burn-in, screen savers are a thing of the past... right?

Not if you have your HTPC hooked up to a plasma TV -- plasma still has a big problem with burn-in.
Finding myself in that situation, I needed a screen saver that would protect the screen while a movie is paused.
I also wanted it to look great (it's in my living room, after all) but every screen saver I tried looked
like it was written decades ago. (Most of them were.)

Modern web technologies make it incredibly easy to create engaging animations. All I needed was a way
to marry the web tools we know and love to a native Windows program, in this case a screen saver. That's where
Electron comes in.

**Please note:** This is currently a Windows-specific project. You can run the code in Electron
on other platforms, but you won't get the screen saver integration with the OS.

How to Build
------------

**Prerequisites:** This project requires <a href="https://nodejs.org">Node.js</a> -- if you've read this far, you probably already have it. The build uses <a href="http://gruntjs.com/">Grunt</a>, so if you've never installed grunt-cli, run:

    npm install -g grunt-cli

To build, go to the project folder and run the following commands:

    npm install
    grunt

Once the build is complete, you have a couple of options. If you want to quickly fire it up and see what it does, run:

    npm start

If you want to install it as a screen saver, look in the `package\photo-screen-saver-win32-x64` subfolder and find the file `photo-screen-saver.scr`. Right-click the file and choose `Install`. When you go to the Windows screen saver settings, you'll see that `photo-screen-saver` is now your selected screen saver.

Behind the Scenes
-----------------

It's a lot easier than I thought to create a screen saver for Windows -- it's just a normal executable
with a .scr extension. The program just needs to display a topmost full-screen window and
exit on mouse or keyboard activity. These requirements are really easy to meet in Electron!

(Note that this is the bare minimum and won't give you the mini-preview or
Settings features. The mini-preview is a pain to implement and IMHO unnecessary. To support Settings you just
need to handle the /S command line argument and display an appropriate UI.)

This screen saver displays a photo slideshow with a simple "Ken Burns" effect. It supports two photo sources:
The <a href="http://www.bing.com/gallery/">Bing Homepage Gallery</a> or a local folder on your computer.
Since I didn't feel like implementing a Settings window, I hard-coded the two options. If you take a look in `src/index.ts`, you'll find this snippet of code:

    let useBing = true;

    if(useBing)
        loadImagesFromBingGallery(startSlideshow);
    else
        loadImagesFromFolder("C:/ScreenSaver/", startSlideshow);

If you want to use your local photo library, just set `useBing` to false, put the right path in the call to `loadImagesFromFolder`, and rebuild.
Or be my guest and implement a Settings window!

Possibilities
-------------

This project is actually a pretty good (if minimal) framework for any screen saver you might want to create. If photos aren't
your cup of tea, try Googling <a href="https://www.google.com/search?q=webgl+demo">WebGL demo</a> or <a href="https://www.google.com/search?q=three.js+demo">three.js demo</a>, pick the coolest animation you can find, and incorporate it into `index.ts` and `index.css`. (Just be sure to check that the license allows this!)

License
-------

The MIT License

Copyright (c) 2016 Rand Scullard
