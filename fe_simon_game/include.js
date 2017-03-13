$(function() {
    var SimonGame = function(jq) {
        // a stack for button presses
        var stack = [];
        var strictMode = false;
        var pos = 0;
        var winCount = 20;
        var started = false;
        var busy = false;
        var timerActions = [];
        var timerId;

        this.showPresses = function() {
            if (started) {
                var pr = 'x0' + stack.length;
                pr = pr.substr(-2);
            } else {
                pr = '--';
            }
            jq('#presses').html(pr);
        };

        this.turnBusy = function() {
            busy = true;
            jq('#layer1').addClass('disabled');
        };

        this.turnIdle = function() {
            if (started) {
                busy = false;
                jq('#layer1').removeClass('disabled');
            }
        };

        this.addTimerAction = function(ta) {
            timerActions.push(ta);
            if (!busy) this.turnBusy();
        };

        this.removeTimerAction = function(ta) {
            timerActions.splice(timerActions.valueOf(ta), 1);
            if (timerActions.length == 0) this.turnIdle();
        };

        // - add button press to stack
        this.addPress = function() {
            var press = Math.floor(Math.random() * 4);
            var id;

            switch (press) {
                case 0: id = 'blue-btn'; break;
                case 1: id = 'red-btn'; break;
                case 2: id = 'green-btn'; break;
                case 3: id = 'yellow-btn'; break;
            }

            stack.push(id);
        };

        // a player to execute a button press
        this.pressBtn = function(btn) {
            jq('#' + btn).addClass(btn + '-pressed');
            jq('#' + btn + '-sound')[0].play();

            this.addTimerAction('pressBtn');
            setTimeout(function() {
                jq('#' + btn).removeClass(btn + '-pressed');
                me.removeTimerAction('pressBtn');
            }, 500, me = this);
        };

        // a stack scanner to send button presses to the player
        this.scanStack = function() {
            var to = 0;

            setTimeout(function() {
                me.showPresses();
            }, 900, me = this);

            stack.every(function(id) {
                this.addTimerAction('scanStack-' + to);
                to += 1000;

                setTimeout(function() {
                    if (started) {
                        me.pressBtn(id);
                        me.removeTimerAction('scanStack-' + to);
                    }
                }, to);

                return started;
            }, me = this);
        };

        //  a checker to verify user input correspondence to the stack
        this.checkInputPress = function(btn) {
            this.pressBtn(btn);

            var to;

            if (stack[pos] != btn) {
                this.addTimerAction('error');
                setTimeout(function() {
                    jq('#error-sound')[0].play();
                }, 500);

                setTimeout(function() {
                    if (strictMode) {
                        me.reset();
                    } else {
                        pos = 0;
                    }

                    me.scanStack();
                    me.removeTimerAction('error');
                }, 4500, me = this);
            } else {
                pos++;

                if (pos >= winCount) {
                    this.turnBusy();

                    setTimeout(function() {
                        jq('#win-sound')[0].play();
                    }, 500, me = this);

                    setTimeout(function() {
                        me.reset();
                    }, 10000, me = this);
                } else if (pos == stack.length && pos < winCount) {
                    this.addPress();
                    pos = 0;

                    this.addTimerAction('scanStack');
                    setTimeout(function() {
                        me.scanStack();
                        me.removeTimerAction('scanStack');
                    }, 1000, me = this);
                }
            }
            //  - victory celebration
        };

        this.reset = function() {
            stack = [];
            pos = 0;
            this.addPress();
            this.scanStack();
        };

        // strict mode flag
        this.toggleStrictMode = function() {
            strictMode = !strictMode;

            if (!strictMode) {
                jq('#strict-btn').removeClass('strict-btn-started');
                return;
            }

            jq('#strict-btn').addClass('strict-btn-started');
        };

        this.restart = function() {
            jq('#restart-btn').addClass('restart-btn-on');
            sg.reset();

            setTimeout(function() {
                jq('#restart-btn').removeClass('restart-btn-on');
            }, 500);
        };

        this.toggleStart = function() {
            started = !started;

            if (!started) {
                this.turnBusy();
                if (strictMode) this.toggleStrictMode();
                jq('#onoff-btn').removeClass('onoff-btn-on');
                jq('#led').removeClass('led-on');
                this.showPresses();
                return;
            }

            this.reset();
            jq('#onoff-btn').addClass('onoff-btn-on');
            jq('#led').addClass('led-on');
        };
    };

    var sg = new SimonGame($);

    $("#red-btn").on("click", function() {
        sg.checkInputPress("red-btn");
    });
    $("#blue-btn").on("click", function() {
        sg.checkInputPress("blue-btn");
    });
    $("#yellow-btn").on("click", function() {
        sg.checkInputPress("yellow-btn");
    });
    $("#green-btn").on("click", function() {
        sg.checkInputPress("green-btn");
    });
    $("#restart-btn").on("click", function() {
        sg.restart();
    });
    $("#strict-btn").on("click", function() {
        sg.toggleStrictMode();
    });
    $("#onoff-btn").on("click", function() {
        sg.toggleStart();
    });
});
/*
Objective: Build a CodePen.io app that is functionally similar to this: https://codepen.io/FreeCodeCamp/full/obYBjE.

Fulfill the below user stories. Use whichever libraries or APIs you need. Give it your own personal style.

User Story: I am presented with a random series of button presses.

User Story: Each time I input a series of button presses correctly, I see the same series of button presses but with
an additional step.

User Story: I hear a sound that corresponds to each button both when the series of button presses plays,
and when I personally press a button.

User Story: If I press the wrong button, I am notified that I have done so, and that series of button presses
starts again to remind me of the pattern so I can try again.

User Story: I can see how many steps are in the current series of button presses.

User Story: If I want to restart, I can hit a button to do so, and the game will return to a single step.

User Story: I can play in strict mode where if I get a button press wrong, it notifies me that I have done so,
and the game restarts at a new random series of button presses.

User Story: I can win the game by getting a series of 20 steps correct. I am notified of my victory, then the game starts over.

Hint: Here are mp3s you can use for each button:
https://s3.amazonaws.com/freecodecamp/simonSound1.mp3,
https://s3.amazonaws.com/freecodecamp/simonSound2.mp3,
https://s3.amazonaws.com/freecodecamp/simonSound3.mp3,
https://s3.amazonaws.com/freecodecamp/simonSound4.mp3.

Remember to use Read-Search-Ask if you get stuck.

When you are finished, click the "I've completed this challenge" button and include a link to your CodePen.

You can get feedback on your project by sharing it with your friends on Facebook.
*/
