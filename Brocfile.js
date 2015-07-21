var markdownToHtml = require('broccoli-marked');
var highlight = require('highlight.js');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');

var posts = funnel('site/posts', {
  include: ['*/data.json']
});

var markdowns = funnel('site/posts', {
  include: ['*/*.md']
});

var htmls = markdownToHtml(markdowns, {
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

var highlightCss = funnel('node_modules/highlight.js', {
  srcDir: 'styles',
  files: ['monokai.css']
});

module.exports = mergeTrees([htmls, highlightCss]);
