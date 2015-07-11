# brassica

A ridiculously over-engineered weblog, using:

- Broccoli
- Handlebars
- GitHub Flavored Markdown
- highlight.js
- Sass
- imagemin
- Babel
- qunit

## Usage

Install dependencies:

    npm install -g broccoli-cli
    npm install
    bower install

Run a live-reloading development server on localhost:

    broccoli serve

Build the production site:

    broccoli build dist

Ship it:

    broccoli deploy

## Features

Four core features:

1. Write basic weblog posts as easily as with Jekyll: just put a Markdown file in a directory.
2. Use highlight.js at compile time for syntax highlighting of GitHub Flavored Markdown code blocks.
3. Use post-specific JavaScript, styles, and image assets.
4. Keep post metadata (and other data used for the build process) separate from the Markdown post.

And some secondary stuff which is pretty cool:

1. Preprocess CSS with Sass.
2. Compile ES6 for browsers with Babel.
3. Test JavaScript with qunit.
4. Use bower for external brower dependency management.
5. Compress images with imagemin.
6. Build process, live reload server, and deployment courtesy of Broccoli.
7. Optimize, minify, and fingerprint all assets.

## Structure

Top level:

- config.json: the site configuration
- dist: the output of the build process
- public: files to be copied unchanged to the output build (e.g. robots.txt, favicon)
- site: the site itself
- src: the source code for the build tool

Site consists of:

- index.hbs: the main HTML template for the whole site
- posts: one directory for each post, named for the post slug
- scripts: site-wide JavaScript
- styles: site-wide Sass styles
- templates/index.hbs: the home page listing template
- templates/post.hbs: the individual post template
- tests: unit tests for the site-wide JavaScript

Each post directory has:

- data.json: a JSON file for the post metadata (required)
- post.md: the markdown file for the body of the post (required)
- post.hbs: a Handlebars wrapper for the post, in case complex HTML is called for (optional)
- assets: a folder of images or other assets, which are processed and fingerprinted (optional)
- script.js: page-specific JavaScript code, which can include other files using ES6 module imports (optional)
- tests/script-test.js: unit tests for the JavaScript (optional)
- style.sass: page-specific styles

## Permalinks and output structure

Posts are given permalinks of the form:

    /2015/07/11/post-slug-name

The date for the permalink is specified in the data.json file.

Each post is built into a directory structure:

    /2015/07/11/post-slug-name/index.html
    /2015/07/11/post-slug-name/style.css
    /2015/07/11/post-slug-name/script.js
    /2015/07/11/post-slug-name/assets/horse.jpg

Fingerprinting is applied to the CSS, JS, and image assets.

## Helpers

A few extra Handlebars helpers are needed:

- embed: takes a path, embeds the file's contents into the document without escaping
- date: takes a date object (or string representing a date) and a format string, and processes through Moment.js to return a formatted date
- iso-date: special case of date, returns an ISO 8601 formatted date
- link-to: creates an anchor tag linking to a post's path
