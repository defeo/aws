var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLElement.prototype.$ = HTMLElement.prototype.querySelector;
HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
HTMLElement.prototype.append = function(tag) {
    return this.appendChild(document.createElement(tag));
};

function P4(id) {
    var div = $('#' + id);
    var tab = div.append('table');
    var board = [Array(6), Array(6), Array(6), 
                 Array(6), Array(6), Array(6), Array(6)];

    for (var i = 0 ; i < 6 ; i++) {
        var row = tab.append('tr');
        for (var j = 0 ; j < 7 ; j++) {
            var cell = row.append('td');
            board[j][5-i] = cell;
            cell.dataset['row'] = 5-i;
            cell.dataset['col'] = j;
        }
    }

    var p = div.append('p');

    var turn = 0;
    var players = ['player1', 'player2'];

    this.check4 = function(row, col) {
        var color = board[col][row].className;
        for (var dir = -1 ; dir <= 2 ; dir++) {
            var count = 0;
            for (var i = -3 ; i <= 3 ; i++) {
                var ocolor = '';
                try {
                    ocolor = dir == 2 ?
                        board[col][row + i].className :
                        board[col + i][row + i*dir].className;
                } catch (TypeError) {}
                count = color == ocolor ? count + 1 : 0;
                if (count == 4) return true;
            }
        }
        return false;
    }
    
    this.isFull = function() {
        return board.reduce(function(p, c) {
            return p && c[5].className;
        }, true);
    }

    this.play = function(col) {
        var row = 0;
        while (row < 6 && board[col][row].className) row++;
        if (row < 6) {
            board[col][row].className = players[turn];
            if (this.check4(row, col))
                return turn;
            if (this.isFull())
                return 2;
            turn = 1 - turn;
        }
        return -1;
    }
    
    this.empty = function() {
        board.forEach(function (c) {
           c.forEach(function (r) {
               r.className = '';
           }) 
        });
        turn = 0;
    }
    
    this.playing = true;
    tab.addEventListener('click', (function(e) {
        if (this.playing) {
            var col = parseInt(e.target.dataset['col']);
            var status = -1;
            if (col !== undefined && (status = this.play(col)) >= 0) {
                p.innerHTML = status == 2 ? "It's a draw." : 
                    players[status] + ' wins!'
                this.playing = false;
            }
        } else {
            p.innerHTML = '';
            this.empty();
            this.playing = true;
        }
    }).bind(this), false)
}

p4 = new P4('puissance4');
