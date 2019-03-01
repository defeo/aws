---
title: Multi-player Tetris
difficulty: 3
tags: [multi-player, real time, game]
publish: no
---

The goal of this project is to develop a real-time multi-player
game. We will reinterpret the classic Tetris game in a multi-player
fashion.

## Description of the game

*Tetris* is a classic video game for one player (an *arcade*). You
will find a detailed description of the game at [its Wikipedia
page](https://en.wikipedia.org/wiki/Tetris).

We will implement a two-player variant of the game with a simplified
game play. Each player will play on its own grid, while seeing both
grids. The list of incoming blocks will be shared: the first player to
land a block will receive the next one in line. Players control the
game through the keyboard, with the usual controls: left/right to move
the pieces, up/down to rotate them, space to land them immediately.

The game ends when one of the two players reaches the top of the grid,
thus loosing the game.

## Description of the project

You will create an online game similar to the one developed in the
[tutorials](tutorials/websockets). It will contain:

- A page to register a new player;
- A page showing the list of online players, the number of
  wins/losses, and whatever other information may be of interest;
- A mechanism for logging in;
- A mechanism for defying an opponnent;
- An interface to play the game.

Be very careful when handling the state of the game. Tetris needs an
internal clock for moving blocks down the grids. If the clients were
solely responsible for keeping this clock, it would be very easy for
them to get desynchronized, or, worse, cheat.

The game interface will be coded in JavaScript. To make things
simpler, you can restrict the types of blocks available, and have a
fixed timer that does not accelerate as the game
progresses. Improvements to the game play are proposed in the optional
section.


## Resources

- For the in game client-server communication it is best to use
  [WebSockets](https://developer.mozilla.org/en/docs/WebSockets). You
  are free to use whatever websocket library you like.

- To draw the game, you can use any of the following techniques:
  
  - An HTML table,
  - A [CSS grid
    layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout),
  - An `<svg>` element, possibily using [a library](http://svgjs.com/),
  - A `<canvas>` element, see [this
    tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial).

## Optional improvements

- Implement the full list of tetris blocks.

- Keep a score for each player during a game, computed as the number
  of lines won by that player. When the game ends, the winner earns
  the sum of the two scores.
  
- Have the internal clock speed up as the player scores get
  higher. Weight the player scores by the clock speed (the faster the
  clock goes, the more valuable a line is).

- Whenever a player wins *n* lines, add *n-1* lines to the bottom of
  the opponent's grid.

- Implement a version of the game for up to four players.

- Use a No-SQL database (e.g., MongoDB) instead of a SQL one.

- Adapt the game for playing on a small touch screen (e.g., a
  smartphone), using [Touch
  gestures](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events).

- Add the possibility of controlling the game through a gamepad or
  joystick (see the [Gamepad
  API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)).

- Implement a 3D version of the game, possibly using the
  [three.js](http://threejs.org/docs/) library.
