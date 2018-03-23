---
title: HTML, CSS and forms
---

## The Glitch IDE

In this tutorial we will use a *cloud based* development environment
(IDE). Although the exercises could be developed entirely locally (a
browser and an editor are all that's needed), we will use this
occasion to get acquainted with our IDE Glitch.

**Important:** you will need a **recent browser** to use Glitch,
possibly the **latest version** of Firefox, Chrome or Safari. Check
your version before starting.

Point your browser to <https://glitch.com/>, create an account if you
haven't yet, and connect to your personal dashboard. If you already
have a [GitHub](https://github.com/) account, you can import and
export your projects from/to it.

For your first project, *reémix*
<https://glitch.com/~defeo-lu-aws-get-started> by clicking on the
*"Remix"* button. Alternatively, you can create a new sample project
by clicking on *"Start a new project"*, then *"Create a website"*.

## HTML

1. Open the `index.html` file, or, if your project does not contain
   one, create a new one using this template:

   ~~~
   <!DOCTYPE html>
   <html>
	 <head>
	   <meta charset="utf-8" />
	   <title>Tutorial 1</title>
	 </head>
	 <body>
	   <!-- Content goes here -->
	 </body>
   </html>
   ~~~
	
1. Edit the file. Add a title (`<h1>`) and some paragraphs.

3. Show the result in the browser.
   
   Since this is a public project, all the contents are 
   *statically* viewable at the URL
   
   > [https://[name-of-the-project].glitch.me/](about:invalid)
   
   (replace the project name in the URL), and HTML pages will be
   served as such.  To open this link in a new tab, click on the
   *"Show"* button.

4. Make your own CV in this file. **We will disregard elegance and
   style for the moment**.  You can consult the [MDN
   reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
   to find out about HTML tags.
   
   - Edit the `<title>` tag.
   
   - Give a title to the page (`<h1>`).
   
   - Create two sections (`<section>`): one for your personal data,
     and one for all the rest. Give an `id` to each section.
   
   - In the first section:
	 
	 - Give a title (`<h2>`);
	 - Using a bullet list (`<ul>`), or a description list
       (`<dl>`), list your personal data;
	 - Add a picture of yourself (do not forget to add an `alt`
	   attribute to `<img>` tags), inside a `<figure>` tag.
	   
	   **Note:** Glitch stores pictures in a special folder called
       *"assets"*. You can upload a picture to it from your computer,
       then copy its URL by clicking on the thumbnail. Alternatively,
       you can use a picture taken from the Internet. Do not forget
       that your project is **public**.

   - In the second section:
	 
	 - Create the following subsections: *Education*, *Degrees*,
       *Hobbies*, each within an `<article>` tab, with its own `id`;
	 - Start each subsection with a title (`<h2>` tag);
	 - Fill each subsection with subtitles (`<h3>`, etc.),
	   paragraphs (`<p>`), lists (`<ul>`, `<ol>`, `<dl>`),
	   links (`<a>`), etc.
	 - In the *Degrees* subsection, use a table (`<table>`, `<tr>`,
       `<td>`) to list your degrees and years of graduation;
	 - On top of this section, add a navigation area (`<nav>`),
       containing a list (`<ul>`) of links (`<a>`) to each subsection.
       Recall that you can *link* to any element inside an HTML
       document using the `#id` URL (where `id` is the tag
       identifier).

	**Important:** avoid styling tags, deprecated tags (e.g.:
	`<font>`, `<center>`, ...), or out of place (e.g.: `<h*>` to make
	anything else than titles, `<br>` to make lists, `<table>` to do
	page layout, ...)

5. Validate your document with the W3C validator:
   <https://validator.w3.org/>. Correct all errors until none is left.


## CSS

Create now a CSS file and linkt it to your CV with the `<link>`
tag. Using the [MDN CSS
reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference),
modify your page look as follows:

1. Delimit the subsection headers with a horizontal rule (`border`
   property). Add some `padding` and some `margin` to your liking.

2. Center titile of subsections, modify the font size.

3. Move your picture to the right of the page (see
   [Positioning](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning)).

4. Remove the bullets to the left of lists in the navigation area (see
   [lists](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Styling_lists)).

5. Links in the navigation area must be black, and become red when the
   mouse hovers on them (see the `:link`, `:hover`, `:active`,
   `:visited` pseudoclasses).

6. Links in the navigation area must be all on the same line (use the
   `display` property, for example).

7. By adding `class` attributes in the HTML document, give a different
   background color to even and odd lines in the degree table. After
   that, read the documentation of the
   [`:nth-child`](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child)
   pseudoclass.

8. Reduce the font size of the `<h2>` tags inside  `<article>` tags
   (but not that of other `<h2>` tags).

9. Enlarge the font size of the first letter of the `<h2>` tags inside
   `<article>` tags (`:first-letter` pseudoelement).

10. Open now the page in Chrome or Firefox. Open the *developer tools*
    (`F12`) and select the *Elements* (Chrome) or *Inspector*
    (Firefox) tab. Select a `<h2>` tag and observe the information on
    its style on the right. In the style editor on the right, edit
    some properties and add new properties in the `element.style`
    (Chrome) or `element` (Firefox) group. Obviously, these
    modifications will not be saved, and will not survive a refresh.

11. Validate your CSS code using the W3C validator:
    <https://jigsaw.w3.org/css-validator/>. Fix your errors until none
    are left.


## Forms

We are going to add a simplistic search tool, based on Google
search. The URL used for Google searches varies according to the
interface, however a standard URL will be similar to this

~~~
https://www.google.fr/search?q=ma+recherche&hl=fr
~~~

The question mark `?` separates the page path from its
parameters. After the question mark follow `key=value` pairs, divided
by *ampersands* `&`. Two important key=value pairs for Google are `q`
(the search terms) and `hl` (the UI language). There's plenty of
others.

HTML forms let the browser send requests with parameters to other
pages. These parameters can be sent either via the URL of a GET HTTP
request, like in Google's case, or via the body of a POST request.

1. Add a form (`<form>` tag) to your page, with the attributes
   `method="GET"` and `action="https://www.google.fr/search"`.

2. In the form add a text field (`<input>`) and a button (`<button>`)
      
   <input type="text"><button>Chercher<button>

   The text field must have a `name="q"` attribute.

3. View the page, fill the form, and launch a search. Look at how the
   URL in the address bar varies according to what you typed in the
   text field.

4. View the page again in Chrome or Firefox. Open the *developer
   tools* (`F12`) and select the *Network* tab. Launch a search and
   study the request sent by the browser. You will notice that the
   original request (the first one) generates many other requests.

5. Now use `method="POST"` in the `<form>` tag and launch a new
   search. Besides the fact that Google rejects the request, what
   other differences do you notice through the *developer tools*?

6. Get back to the GET method. Add the `required` attribute to the
   text field, and try and do an empty search. What happens?

6. Add a `placeholder` attribute to the text field.

6. Using the `pattern` attribute, limit the text field to those
   searches that contain the words HTML or CSS (now it's the right
   time to learn about [regular
   expressions](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions),
   if you haven't yet).

6. Create a new text field with `name="q"`, prefilled with the text
   `site:w3schools.com` (use the `value` attribute).

7. Change this last field from `type="text"` to
   `type="hidden"`. Launch a new search. What do you observe?

8. Add some *checkboxes*, appending some pre-determined terms to the
   search, like this (it is important that these checkboxes have
   `name` and `value` attributes)
   
   <input type="checkbox">Apple<br>
   <input type="checkbox">Pear<br>
   <input type="checkbox">Banana

9. Add some *radio buttons* to choose the UI language (`hl=en` or
   `hl=fr`), like this
   
   <input type="radio" name="hl">French<br>
   <input type="radio" name="hl">English

10. Add more search choices in a folding menu (`<select>` and
    `<option>` tags), like this
	
	<select>
	  <option>Mango</option>
	  <option>Strawberry</option>
	  <option>Melon</option>
	</select>

...and don't forge to validate, of course!
