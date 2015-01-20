# jQuery wysiwyg-core
Core jQuery WISWYG rich text editor based on browser execCommand. Includes NO styling or iconography.
Use a wrapper library like [bootstrap-wysiwyg]() or [foundation-wysiwyg]() for quckstart packages.

## Features:
  * Very easy to build implementations for front end frameworks like foundation and bootstrap
  * Easy to add custom CSS styling.
  * Automatically binds standard hotkeys for common operations on Mac and Windows
  * Allows a custom built toolbar with no magic markup generators
  * Does not force any styling - it's all up to you
  * Uses standard browser features, no magic non-standard code, toolbar and keyboard configurable to execute any supported [browser command](https://developer.mozilla.org/en/docs/Rich-Text_Editing_in_Mozilla)
  * Does not create a separate frame, backup text areas etc - instead keeps it simple and runs everything inline in a DIV
  * (Optionally) cleans up trailing whitespace and empty divs and spans
  * Requires a modern browser (See SUPPORTED)
  * Supports mobile devices (See SUPPORTED)
  * Supports multiple instances
  * HTML Sanitization
  * Drag and drop files to insert images
  * Supports image upload
  * Supports image capture on mobile devices
  * Events

## Getting Started
This is the core library. The only thing it depends on is jQuery and uses absolutely NO styling.
It is actually, not recommended you use this file unless you want to create every bit of CSS styling.
Instead, check out implimentations or wrappers for libraries like Bootstrap, Foundation, and Angular.

#### Get Via Bower (recommended)
Add 
```
"dependencies": {
    "jquery-wysiwyg-core": "http://github.com/chrismichaels84/wysiwyg-core.js.git#master"
  },
```

#### Or Download Zip File
You may also download the latest release or the master branch from http://github.com/chrismichaels84/wysiwyg-core.js

#### Installation and Dependencies
Simplest way is to add `<script src="dist/full.wysiwyg-core.min.js"></script>` to your `<head>`

This library depends on jQuery. Be sure to download a copy, use a CDN, or if you use bower, one will be installed for you.

The library also depends on [`jquery.hotkeys`](https://github.com/jeresig/jquery.hotkeys). If you use bower, this will be downloaded for you. If not, be sure to download this library as well.

There are two different files you can include in the `<head>` of your HTML file.
 * `wysiwyg-core.min.js` is only wysiwyg library. You must include jquery.hotkeys **before** this file yourself.
 * `full.wysiwyg-core.min.js` is the library and all dependencies (except jQuery) minified into one file.

In both cases, you must include jQuery yourself. I assume you are already doing this.

* jQuery http://jquery.com/
* jQuery HotKeys https://github.com/jeresig/jquery.hotkeys

## Basic Usage
See index.html for usage or check out https://github.com/steveathon/bootstrap-wysiwyg for the basics (this uses bootstrap styling)

### Creating Wrappers
This library by itself is useful, but ugly out of the box. This was intentional. It makes absolutely no styling decisions for you.

You can also use and create wrappers that extend this library seemlessly into any front-end framework, template, theme, or styling you like. For example, check out
[bootstrap-wysiwyg]() and [foundation-wysiwyg]() which turn this library into a plugin.

You can create your own wrappers easily.
  1. Lay down the boilerplate and include wysiwyg-core. You have a couple options for this.
     * Fork or Clone [boiler-wysiwyg]() which uses bower for all dependencies. (Recommended)
     * Create your own repository from scratch and just download jQuery, jQuery Hotkeys, and wysiwys-core. Then, copy index.html and the examples directory from wysiwyg-core to the root of your repo.
  1. Use the css from whichever framework you like to style the toolbar and enditor to your hearts content.
     * It is recommended that you start with the index.html and examples
     * Be sure to run `gulp build`
  1. Publish the repo to the world (if you like)
     * We like the naming convention framework-wysiwyg
     * Update the readme from the boiler plate
     * Let me know about your awesome port!

Thanks to
------------
@gojko 					@mindmup			@jordanh
@beatnbite				@brutuscat			@VictorBjelkholm
@mrmrs 					@tilleryd 			@pnevels

History
------------
The original version of this code (below) appeared to be no longer maintained. There
were a number of outstanding changes which needed to be merged in and a few which
included performance and feature improvements. These have now been included in this
master branch.

I'll keep an eye out for future changes/improvements and pull them in as required.

- Steve

## Contributing
To contribute to this project:
  * **Fork or clone** this repository. All work is done in the development branch which may have many feature branches. The master is always the latest, production ready release.
  * **Build** the library on your local machine.
    1. Make sure that node, gulp, and bower are installed.
    2. Run `gulp install` in the terminal. This will install all dependencies and build library files.
    3. If this didn't work, just run `bower install` and `npm install` and `gulp build`
  * **Commit** your changes. All active files are in the /src/ directory.
  * **Build** again with `gulp build`
  * **Issue a Pull Request** on this repository.
  
Be sure to be active. All discussion takes place in issue.

Original Licence
------------

The original version of this tool can be found here:
[bootstrap-wysiwyg](https://github.com/mindmup/bootstrap-wysiwyg)

The MIT License

Copyright (c) 2013 Damjan Vujnovic, David de Florinier, Gojko Adzic

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.