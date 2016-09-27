---
name: highlightjs
links:
  - href: //cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/styles/default.min.css
scripts:
  - src: //cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/highlight.min.js
  - src: highlightjs.conf.js
addons:
  highlightjs: yes
---

# Highlight.js

This plugin adds [highlight.js](https://highlightjs.org/) support for
automatic syntax highlighting.

~~~
function(code) {
	return highlight(code);
}
~~~
