# photo-screen-saver

Windows screen saver that displays a photo slideshow, based on the <a href="http://electron.atom.io/">Electron</a> framework.

# Why?

With modern LCD displays not being subject to burn-in, screen savers are mostly a thing of the past.
However, I have an HTPC hooked up to a nice plasma TV, where burn-in is still very much an issue. I wanted
a screen saver to protect the screen while the movie is paused, but every screen saver I could find looked
like it was written decades ago (most of them were).

Modern web technologies make it incredibly easy to create engaging animated displays. All I needed was a way
to marry the web tools we know and love to a native Windows program, in this case a screen saver. This is where
Electron comes in.

# How to Build

**Please note:** This is currently a Windows-specific project. You can run the code in Electron
on other platforms, but you won't get the screen saver integration with the OS.

The build uses <a href="http://gruntjs.com/">Grunt</a>. If you've never installed grunt-cli on your system, run:

    npm install -g grunt-cli

Once you've downloaded the source code from GitHub, run the following commands:

    npm install
    grunt

Once the build is complete, you have a couple of options. If you want to quickly fire it up and see what it does, run:

    npm start

If you want to install it as a screen saver, find the file `photo-screen-saver.scr` in the `package\photo-screen-saver-win32-x64`
subfolder. Right-click the file and choose `Install`.

# Behind the Scenes

It's a lot easier than I thought to create a screen saver for Windows -- it's just a normal executable
with a .scr extension. Your program just needs to display a topmost full-screen window and
exit on mouse or keyboard activity. These requirements are really easy to meet in Electron!

(Note that this is the bare minimum and won't give you the mini-preview or
Settings features. IMHO the mini-preview is unnecessary. To support Settings you just
need to handle the /S command line option and display an appropriate UI.)

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

This project is actually a pretty good (if minimal) framework for any screen saver you might want to create. If photos aren't
your cup of tea, try Googling `webgl demo`, pick the coolest animation you can find, and incorporate it into `index.ts` and `index.css`.

# License

The MIT License (MIT)

Copyright (c) 2016 Rand Scullard
