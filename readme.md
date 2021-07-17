# photo-screen-saver

![icon.png](readme/icon.png)

Windows screen saver that displays a photo slideshow, built on
<a href="https://reactjs.org/">React</a> and <a href="http://electron.atom.io/">Electron</a>.

## Why?

Since modern LCD displays aren't subject to burn-in, screen savers are a thing of the past... right?

Not if you have your HTPC hooked up to a plasma TV; plasma still has a big problem with burn-in.
Finding myself in that situation, I needed a screen saver that would protect the screen while a
movie is paused. I also wanted it to look great &mdash; it's in my living room, after all &mdash;
but every screen saver I tried looked like it was written decades ago. (Most of them were.)

Modern web technologies make it incredibly easy to create engaging animations. All I needed was a
way to marry the web tools we know and love to the Windows screen saver framework. That's where
Electron comes in.

**Please note:** This is currently a Windows-specific project. You can run the code in Electron on
other platforms, but you won't get the screen saver integration with the OS.

## Before You Build

This screen saver displays a photo slideshow with a simple "Ken Burns" effect. It supports two photo
sources:

* <a href="https://www.flickr.com/">Flickr</a>: Photos from the group "Flickr's Best Landscape
  Photographers (Post 1 Award 2)"
* A local folder on your computer

Since I didn't feel like implementing a Settings window, you'll need to make some simple code
changes to set up a source. If you take a look at the top of `src/photoSlideshow.tsx`, you'll find
the following line of code. Set `GET_PHOTOS` to either `getFlickrPhotos` or `getLocalPhotos`:

    const GET_PHOTOS: GetPhotosFn = getFlickrPhotos

Then do one of the following:

* **Flickr**: Get a Flickr <a href="https://www.flickr.com/services/apps/create/apply">API key</a> and
  put it in `src/constants.ts`:

      export const FLICKR_API_KEY = "<your API key goes here>";

* **Local**: Edit `src/constants.ts` and set LOCAL_FOLDER_PATH to point to your image folder:

      export const LOCAL_FOLDER_PATH = "<your path goes here>";

**A quick warning:** When you display random photos from the web, there's always a chance you'll get
something you wouldn't want your kids, your grandma, or your boss to see. The Flickr API call is set
up to avoid anything NSFW, but photos do end up in the wrong category from time to time &mdash;
don't say I didn't warn you. If you want to stay on the safe side, you can always use your own local
folder of photos.

## How to Build

(This project requires <a href="https://nodejs.org">Node.js</a> &mdash; if you're reading
this, you probably already have it.)

**Install:** Go to the project folder and run the following command:

    npm install

**Build:** Go to the project folder and run the following command:

    npm run build-electron

**Run:** Once the build is complete, you have a couple of options. If you want to quickly fire it up
and see what it does, go to the project folder and run:

    npm run start-electron

**Screen Saver:** If you want to install the screen saver, look in the
`package/photo-screen-saver-win32-x64` subfolder and find the file `photo-screen-saver.scr`.
Right-click the file and choose `Install`. When the Windows screen saver settings appear, you'll see
that `photo-screen-saver` is now your selected screen saver.

**Development:** If you want to work on the React part of the project, you can run `npm start` to
launch it in the browser. Since it's built on
<a href="https://create-react-app.dev/">create-react-app</a>, you get all the benefits of
webpack-dev-server including hot module reloading. Note: In this mode you won't be able to use any
features that depend on Electron, such as loading photos from a local folder.

## Behind the Scenes

It's a lot easier than I thought to create a screen saver for Windows &mdash; it's just a normal
executable with a .scr extension. The program just needs to display a topmost full-screen window and
exit on mouse or keyboard activity. These requirements are really easy to meet in Electron!

**Note:** This project is the bare minimum and won't give you the mini-preview or Settings features.
The mini-preview is a pain to implement, and IMO not worth the effort. To support Settings you just
need to handle the /S command line argument and display an appropriate UI. (I was too lazy to
implement a Settings UI, but you might feel differently!)

## Possibilities

This project makes a good starting point for any screen saver you want to create. You could start by
changing the Flickr API call to get different types of photos. If photos aren't your cup of tea,
there are a lot of cool animations on <a href="https://codepen.io/">CodePen</a> and <a
href="https://www.shadertoy.com/">ShaderToy</a>. To get you started, there are four ready-to-run
animation components included in this project, each one with a great-looking demo and each one
illustrating a different basic approach to animation:

* **DemoCanvas**: writes directly to an HTML5 Canvas
* **DemoCss**: uses pure SCSS
* **DemoShader**: implemented as a WebGL fragment shader
* **DemoThreeJs**: uses Three.js to create a 3D animation

At the top of `src/app.tsx` you'll find the following line of code. Set `SHOW_COMPONENT` to the
component you want to see:

    const SHOW_COMPONENT: ShowComponent = PhotoSlideshow

You can create your own components using the demos as a template, and using your own code or
examples you find on the web. Whatever you use, be sure to comply with the license terms!

## License

The MIT License

Copyright (c) 2016 Rand Scullard
