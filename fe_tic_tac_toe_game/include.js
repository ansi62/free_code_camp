$(function() {
    // game situation after a move
    var State = function() {
        this.availablePos;
        this.pos;
        this.player;
        this.win = false;
        this.isRunning = true;
        this.board;

        this.applyMove = function(pos) {
            this.pos = pos;
            var idx = this.availablePos.indexOf(this.pos);
            this.availablePos.splice(idx, 1);
            this.player = this.player == 'X' ? 'O' : 'X';
            this.board[this.pos] = this.player;

            var i, n;

            // check rows
            for (i = 0; i <= 6; i += 3) {
                if (this.board[i] !== 'E' && this.board[i + 1] == this.board[i] &&
                        this.board[i + 2] == this.board[i]) {

                    this.isRunning = false;
                    this.win = this.board[i];
                    return;
                }
            }

            // check columns
            for (i = 0; i <= 2; i++) {
                if (this.board[i] !== 'E' && this.board[i + 3] == this.board[i] &&
                        this.board[i + 6] == this.board[i]) {

                    this.isRunning = false;
                    this.win = this.board[i];
                    return;
                }
            }

            // check diagonals
            for (i = 0, n = 4; i <= 2; i += 2, n -= 2) {
                if (this.board[i] !== 'E' && this.board[i + n] == this.board[i] &&
                        this.board[n * 2 + i] == this.board[i]) {

                    this.isRunning = false;
                    this.win = this.board[i];
                    return;
                }
            }

            // check if the game is running after the move
            if (this.availablePos.length == 0) {
                this.isRunning = false;
                return;
            }
        };
    };

    function stateGenerator(oldState, pos) {
        var newState = new State();

        if (oldState !== undefined && pos !== undefined) {
            newState.availablePos = oldState.availablePos.slice();
            newState.board = oldState.board.slice();
            newState.player = oldState.player;
            newState.applyMove(pos);
        } else if (oldState === undefined && pos === undefined) {
            newState.availablePos = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            newState.board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
        } else {
            throw 'StateGenerator: oldState or pos undefined value mismatch';
        }

        return newState;
    }

    var Score = function() {
        this.val;
        this.pos;
    };

    // ai player
    var AI = function() {
        // minimax for the state position
        function minimax(state, depth) {
            // From here we are working on the parent state
            var bestScore = new Score;

            if (state.isRunning === false) {
                bestScore.val = 0;
                bestScore.pos = state.pos;

                if (state.win !== false) {
                    bestScore.val = state.win == 'X' ? 10 - depth : depth - 10;
                }
            } else {
                //From here we are working on the children states.
                var childScore;
                var childPlayer = state.player == 'X' ? 'O' : 'X';
                bestScore.val = childPlayer == 'X' ? -1000 : 1000;

                for (var i = 0; i < state.availablePos.length; i++) {
                    childScore = minimax(stateGenerator(state, state.availablePos[i]), depth + 1);

                    if (childPlayer == 'X') {
                        if (bestScore.val < childScore.val) {
                            bestScore = childScore;
                            bestScore.pos = state.availablePos[i];
                        }
                    } else {
                        if (bestScore.val > childScore.val) {
                            bestScore = childScore;
                            bestScore.pos = state.availablePos[i];
                        }
                    }
                }
            }

            return bestScore;
        }

        this.getMovePos = function(state) {
            var bestScore = minimax(state, 0);
            return bestScore.pos;
        };
    };

    // game controller
    var Game = function(jquery) {
        var currentState;
        var ai;
        var jq;

        this.picker = function() {
            jq('#picker').css('display', 'block');
            jq('#ttt').css('display', 'none');
            jq('#btn-reset').css('visibility', 'hidden');
            this.printStatus('Do you wat to play as &quot;X&quot; or &quot;O&quot; ?<br>(&quot;X&quot; starts first)');
        };

        this.pickedRole = function(role) {
            jq('#picker').css('display', 'none');
            jq('#ttt').css('display', 'table');
            jq('#btn-reset').css('visibility', 'visible');
            this.reset();

            if (role == 'O') {
                this.applyAiMove();
            } else {
                this.printStatus("It's your turn.");
            }
        };

        this.reset = function() {
            currentState = stateGenerator();
            var id;

            for (var i = 0; i < currentState.board.length; i++) {
                var id = '#b' + i;
                jq(id).prop('disabled', false);
                jq(id).html('&nbsp;');
            }
        };

        this.showMove = function() {
            var id = '#b' + currentState.pos;
            jq(id).html('<img src="' + currentState.player + '.png" alt="' + currentState.player + '">');
            jq(id).prop('disabled', true);

            if (currentState.isRunning === false) {
                for (var i = 0; i < currentState.availablePos.length; i++) {
                    id = '#b' + currentState.availablePos[i];
                    jq(id).prop('disabled', true);
                }

                var status = 'Game over. - ';

                if (currentState.win !== false) {
                    status += currentState.win + ' won!';
                } else {
                    status += "It's a draw.";
                }

                this.printStatus(status);
            }
        };

        this.applyAiMove = function() {
            if (currentState.isRunning === false) return;

            var pos;

            if (currentState.availablePos.length != 9) {
                pos = ai.getMovePos(currentState);
            } else {
                pos = 4;
            }

            currentState.applyMove(pos);
            this.showMove();
            if (currentState.isRunning) {
                this.printStatus("It's your turn.");
            }
        };

        this.applyHumanMove = function(pos) {
            if (currentState.isRunning === false) return;
            jq('#status-bar').html('');
            currentState.applyMove(pos);
            this.showMove();
            this.applyAiMove();
        };

        this.printStatus = function(s) {
            jq('#status-bar').fadeOut(500, function() {
                jq('#status-bar').html(s);
                jq('#status-bar').fadeIn(500);
            });
        };

        ai = new AI();
        jq = jquery;
        this.picker();
    };

    var game = new Game($);

    // event listeners
    $("#pickX").on("click", function() {
        game.pickedRole('X');
    });
    $("#pickO").on("click", function() {
        game.pickedRole('O');
    });

    $("#b0").on("click", function() {
        game.applyHumanMove(0);
    });
    $("#b1").on("click", function() {
        game.applyHumanMove(1);
    });
    $("#b2").on("click", function() {
        game.applyHumanMove(2);
    });
    $("#b3").on("click", function() {
        game.applyHumanMove(3);
    });
    $("#b4").on("click", function() {
        game.applyHumanMove(4);
    });
    $("#b5").on("click", function() {
        game.applyHumanMove(5);
    });
    $("#b6").on("click", function() {
        game.applyHumanMove(6);
    });
    $("#b7").on("click", function() {
        game.applyHumanMove(7);
    });
    $("#b8").on("click", function() {
        game.applyHumanMove(8);
    });

    $("#btn-reset").on("click", function() {
        game.picker();
    });
});
