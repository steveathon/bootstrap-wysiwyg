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

This library depends on [``](http://github.com/phoenix-labs/common.js). If you use bower, this will be downloaded for you. If not, be sure to download this library as well.
There are two different files you can include in the `<head>` of your HTML file.
 * `phoenix.http.min.js` is only the HTTP library. You need to include the dependencies yourself *before* the library file.
 * `phoenix.full.http.min.js` is the library and all dependencies minified into one file.

Use the full version if this is the only phoenix library on the page. If not, we'd recommend using something like [gulp](http://gulpjs.com) to concat your files.
By default, all methods are contained in `window.px` or just `px`. Just by including the script in your header (or footer) gives you access to `px.http`.

## Basic Usage

### Creating Wrappers
HTTP was designed to be lightweight and useable with other libraries. Well, just about every library has ajax functionality. So, what if you are using something that depends on phoenix-http (like [forms-extender](http://github.com/phoenix-labs/forms-extender.js)), but also use jQuery? Why have two libraries for ajax?

Adapters solve this problem. Using a jquery adatper, forces phoenix-http to use jQuery's ajax methods. phoenix-http's ajax library doesn't even get loaded!

For more info on creating and using adapters see docs/adapters.md or look at our [jquery.http.js](http://github.com/phoenix-labs/jquery.http.js).

Dependencies
------------
* jQuery http://jquery.com/
* jQuery HotKeys https://github.com/jeresig/jquery.hotkeys

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
[Phoenix Labs](http://phoenixlabstech.org) is a non-profit organization developing community-driven experiments in collaboration and content. "Community Driven" is more than just a slogan. It's a core value. Everything we do is for the community and by the community. Collaboration on any of the projects is welcome.

To contribute to this project (one of the [Backstage](http://phoenixlabstech.org/projects/backstage) packages):
  * **Fork or clone** this repository. All work is done in the development branch which may have many feature branches. The master is always the latest, production ready release.
  * **Build** the library on your local machine.
    1. Make sure that node, gulp, and bower are installed.
    2. Run `gulp install` in the terminal. This will install all dependencies and build library files.
    3. If this didn't work, just run `bower install` and `npm install` and `gulp build`
  * **Commit** your changes. All active files are in the /src/ directory.
  * **Build** again with `gulp build`
  * **Test** as needed. Write tests and add them to one of the test suites in /tests/. Please write new tests as needed and make sure you didn't break another test.
  * **Issue a Pull Request** on this repository.
  
Be sure to be active. All discussion takes place in issue.
Phoenix Common.js is licenced under the MIT open source licence.

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