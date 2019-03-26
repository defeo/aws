---
title: A simple JavaScript Game
---

In this tutorial we are going to create an interface to play [Connect
4](https://fr.wikipedia.org/wiki/Puissance_4). Plain JavaScript and
some basic CSS will be enough to make a nice and functional interface.

References for this tutorial are:

{% assign lessons = site.collections | where:'label','lessons' | first %}
- Lessons {% include link.html collection=lessons href="CSS.md" %},
  {% include link.html collection=lessons href="javascript.md" %},
  {% include link.html collection=lessons href="dom.md" %}.
- The Mozilla Developer Network:
  - <https://developer.mozilla.org/docs/CSS>,
  - <https://developer.mozilla.org/docs/JavaScript>.
- W3Schools tutorials: <https://www.w3schools.com/>.
- This course codepens: <https://codepen.io/collection/AaMOJZ/>.

We refer to the book [Eloquent
JavaScript](https://eloquentjavascript.net/) for more details.

The Q&R platform [StackOverflow](https://stackoverflow.com/) has good
answers, but apply some critical thinking before using them. Many
other tutorials you can find on internet may refer to outdated
versions of JavaScript, be careful before copy-pasting.

Like you did for last tutorial, create a new project in Glitch.

## Le game board in pure CSS

For simplicity, let's start with a 3×2 board.

1. Create a valid HTML document containing a `<div>`, itself
   containing a table (`<table>`) of 3 lines by 2 columns, every cell
   being empty. Give a unique identifier to the `<div>`.

2. Attach a style sheet to the HTML document. Give fixed `width` and
   `height` to the table cells. Using the `border` property, give blue
   borders to the cells.
   
   At this point you have square grid. Using the `border-radius`
   property, make the table cells round, like this:
   
   <div style="margin:auto;width:2em;height:2em;border-radius:2em;border:solid 0.2em blue"></div>
   
   Last touch: fill the blanks between the cells. For that, use wisely
   the `background-color` property on some elements of the table, so
   to obtain this:
   
   <div style="background-color:blue;width:2.4em;margin:auto">
   <div style="background-color:white;width:2em;height:2em;border-radius:2em;border:solid 0.2em blue">
   </div></div>

3. It's time to play. Add classes `player1` and `player2` to some
   table cells.  Fill the cells with a red or yellow token, according
   to whether they have one class or the other (use `background-color`
   again).


## Unobtrusive JavaScript

We are ready to write the real interactive application. We could
create a 6×7 board right in the HTML soruces, like in the previous
section, but we are too lazy to type 42 times `<td></td>` by hand.
Instead we will dynamically generate the board via JavaScript.

We are going to follow the popular mantra of [*Unobtrusive
JavaScript*](https://en.wikipedia.org/wiki/Unobtrusive_JavaScript),
which says that an HTML page should be usable even without JavaScript,
all dynamic elements being added only after JavaScript has been
loaded.

In our specific instance, since our page only contains an interactive
game, we will simply show an error message as long as JavaScript has
not loaded.

1. Remove the `<table>` from the HTML document. Replace the `<div>` by a
   simple
   
   ~~~html
   <div id="...">Activez JavaScript pour jouer.</div>
   ~~~
   
   (replace `...` with the identifier you chose previously).
   
2. Attach a JavaScript file to the HTML page. To avoid DOM loading
   problems, use the `defer` attribute on the `<script>` tag like this:
   
   ~~~html
   <head>
       <script src="..." defer></script>
   </head>
   <body>
	   <div id="...">Activez JavaScript pour jouer.</div>
   </body>
   ~~~
   
   Perform a debug printing using `console.log` in your JavaScript
   file, test that your script has been loaded using the browser
   console (`Shift+Ctrl+K` in Firefox, `F12` in Chrome).

3. In our JavaScript application, we will separate the abstract
   internal representation of the game from its DOM rendering. We
   start with the abstract representation: define a global variable
   `board` and initialize it to a 6×7 array of integers, containing
   all zeros. Use `console.log` to check that the array is properly
   initialized.
   
   **Note:** contrary to C or Java, arrays (or, rather, lists) in
   JavaScript do not have a fixed dimension, and multi-dimensional
   arrays are simulated by list of lists (of lists of lists...).
   
   You can initialize an **empty** array of length `n` using
   `Array(n)`. You can use the `.fill()` method to put the same value
   in all cells of an already initialized array.
   
   You can take some inspiration from the example below.

   {% include codepen.md pen="myXGeZ" tab="js" height="250" %}

4. Write a function `set(row, column, player)` that takes as input a
   row, a column, and an integer representing player 1 or 2, and
   changes the corresponding entry in `board` to 1 or 2.
   
   Test it in the browser console.

5. We now move to the generation of the DOM representation. Write a
   function `render()` that:
   
   - Finds the DOM element corresponding to the `<div>` using
     `document.querySelector`.
   - Empties the element (you can use `.innerHTML = ''` to empty a DOM
     element).
   - Creates a `<table>` DOM node using `document.createElement`, and
     adds it to the `<div>` using the `.appendChild` method.
   - Using a double `for` loop, creates `<tr>`'s and `<td>`'s inside the
     `<table>` element, so to obtain a 6×7 table.
   
   You can take some inspiration from the example below.
   
   {% include codepen.md pen="xbYawz" tab="js" height="250" %}
   
   Test your function by calling it on startup, and verifying that the
   game board is properly drawn on screen.

6. Modify `render()` so that the `<td>` in position (i,j) has
   class `player1` if `board[i][j]` is equal to 1, and class `player2`
   if `board[i][j]` is equal to 2.
   
   You can set an element's class with
   
   ```js
   my_element.className = 'some_class_name';
   ```
   
   Test your functions in the browser console by successively calling
   `set` and `render` many times.

6. Define a global variable `turn`, indicating whose turn it is to
   play.  Initialize it to the value 1 (player 1 starts).

7. Write a function `play(column)` that

   - takes as input a column number,
   - looks at `board` to find the first free row in the column (if
     any), starting from the bottom,
   - if no row is free in the column, it returns `false`,
   - if a row is free in the column, it changes the corresponding
     value in `board` to the value of `turn`, changes the value of
     `turn`, and returns the row number.
   
   Test your function in the console by repeatedly calling `play()`
   and `render()`.


## Handling events

It is now time to react to mouse clicks. We want to call the `play`
function any time the user clicks on a column, regardless of the exact
line that has been clicked.

We could define a event handler for each `<td>`, but this would not be
elegant nor efficient: 42 event handlers take lots of resources,
especially on a mobile phone... Instead, we are going to define a
unique handler for the whole board, and we will use the `Event` object
to know which `<td>` exactly has been clicked. It is import here to
understand the difference between the properties `.target` and
`.currentTarget` seen in the [lesson on
DOM](../lessons/dom#lobjet-evenement). Also have a look at the example
below:

{% include codepen.md pen="WbMgrx" tab="js" height="350" %}

But how shall we know which column corresponds to the clicked `<td>`?
Among many solutions (we could, for example, navigate te DOM to count
how many `<td>`'s are on the left of our clicked `<td>`), the HTML5
*data attributes* API is the most elegant one.

1. Using `.addEventListener()`, define a handler for the `click` event
   on the whole board (e.g., on the `<table>` element). For the
   moment, just execute
   
   ```js
   console.log(event.target)
   ```
   
   in it (`event` being the lone parameter to the handler). Test you
   handler by clicking on the board and reading in the console.

2. Modify `render()` so that each `<td>` cell contains a `data-column`
   attribute equal to the column containing the `<td>`. These `data-*`
   attributes have a special API in Javascript: every DOM node has a
   `dataset` field, which gives read/write access to the `data-*`
   attributes. For example, if `my_cell` represent a `<td>` element,
   the following code
   
   ~~~js
   // example using dataset
   my_row.appendChild(my_cell);
   ma_cell.dataset.column = 0;
   ~~~
   
   will insert a node
   
   ~~~html
   <td data-column="0"></td>
   ~~~
   
   in the document. **Warning**, all `dataset` properties are
   automatically converted to strings by JavaScript.
   
   Modify the click event handler so that it prints in the console the
   value of the `data-column` attribute. Test in the console.

3. Modify the click event handelr to respond to clicks by playing a
   token in the corresponding column (calling `play` and `render`
   successively), or by not doing anything if the click happens to be
   outside of a cell (you can test the existence of `dataset.column`
   to know if the click happened on a `<td>` or somewhere else).
   

## Final touches (optional)

You can tackle the following points in any order you like. Follow your
inspiration!

1. Write a function to test if a move is winning (4 same color tokens
   aligned vertically, horizontally ou diagonally). Note that it is
   enough to test 4 directions around the last clicked cell, and to go
   at most 3 cells away in each direction. The following example may
   serve as an inspiration (or maybe not).
   
   {% include codepen.md pen="QwQVyK" tab="js" height="300" %}

2. Modify your application to test at each move whether it is a
   winning one, or whether the board is completely full (a null
   match).  When the game is over, the interface shows the
   winner. Clicking again starts a new match.

3. Using the CSS `animation` property, make the 4 winning tokens
   *flash*. You can have a look at this [guide on CSS
   animations](https://developer.mozilla.org/docs/CSS/CSS_Animations)
   (also [in
   French](https://developer.mozilla.org/fr/docs/CSS/Animations_CSS)).

4. Add some style touches using the `box-shadow` property.

5. Wrap your code in a JavaScript class, and remove all global
   variables, so to allow having more than one board per page.

6. Test your application on a smartphone, and adapt it to small
   screens. If you do not have a smartphone, you can test smartphone
   emulation in Chrome or Firefox (`Shfit+Ctrl+M`).
   
   You can read this [guide on mobile
   development](https://developer.mozilla.org/docs/Web/Guide/Mobile),
   in particular the part on [using the `viewport` meta
   tag](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag)
   (in
   [French](https://developer.mozilla.org/fr/docs/Mozilla/Mobile/Balise_meta_viewport)).
