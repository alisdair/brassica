var markdownToHtml = require('broccoli-marked');
var highlight = require('highlight.js');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');
var DefaultFile = require('./broccoli-default-file');

var posts = funnel('site/posts', {
  include: ['*/']
});

var postData = funnel(posts, {
  include: ['data.json']
});

var templates = new DefaultFile([posts], {
  files: {
    'post.hbs': '{{ body }}',
  }
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

module.exports = mergeTrees([postData, templates, htmls, highlightCss]);
