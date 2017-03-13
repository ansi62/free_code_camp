function PomodoroClock() {
    this.break_length = 5;
    this.session_length = 25;
    this.test_session = 0.15;
    this.test_break = 0.1
    this.clock_length;
    this.reminder = new Date();
    this.intervalID = null;
    this.sessionRGB = [220, 0, 0];
    this.breakRGB = [190, 190, 190];
    this.clockRGB = [];
    this.isClockTypeSession = true;
    this.isClockTypeTest = false;

    this.clockDisplay = function() {
        $('#clock-text').html(('0' + this.reminder.getMinutes().toString()).substr(-2) + ':' + ('0' + this.reminder.getSeconds().toString()).substr(-2));
    };

    this.swapClockType = function() {
        this.isClockTypeSession = !this.isClockTypeSession;

        if (this.isClockTypeSession === true) {
            this.clock_length = this.session_length;
            this.clockRGB = this.sessionRGB;

            if (this.isClockTypeTest === true) {
                this.clock_length = this.test_session;
            }
        } else {
            this.clock_length = this.break_length;
            this.clockRGB = this.breakRGB;

            if (this.isClockTypeTest === true) {
                this.clock_length = this.test_break;
            }
        }

        this.setClock();
        window.setTimeout(function() {
            me.startAnimation();
        }, 100, me = this);
        $('#sound')[0].play();
    };

    this.resetClock = function() {
        this.isClockTypeSession = true;
        this.clock_length = this.session_length;

        if (this.isClockTypeTest === true) {
            this.clock_length = this.test_session;
        }

        this.clockRGB = this.sessionRGB;
        this.setClock();
        this.disableStoppingBtns();
        this.enableStartingBtns();
    };

    this.setClock = function() {
        this.reminder.setTime(this.clock_length * 60 * 1000);
        $('#clock').css('border-color','rgba(' + this.clockRGB[0] + ',' + this.clockRGB[1] + ',' + this.clockRGB[2] + ',' + '1)');
        this.clockDisplay();
        $('#break-length').html(this.break_length);
        $('#session-length').html(this.session_length);
        this.rewindAnimation();
    };

    this.countDown = function() {
        this.startAnimation();
        this.intervalID = window.setInterval(function () {
            me.reminder.setTime(me.reminder.getTime() - 1000);
            me.clockDisplay();
            $({alpha: 1}).animate({alpha: 0.5}, {
                duration: 800,
                step: function () {
                    $('#clock').css('border-color', 'rgba(' + me.clockRGB[0] + ',' + me.clockRGB[1] + ',' + me.clockRGB[2] + ',' + this.alpha + ')');
                }
            });
            if (me.reminder.getTime() == 0) {
                me.swapClockType();
            }
        }, 1000, me = this);
    };

    this.disableStartingBtns = function() {
        $('.starting').prop('disabled', true);
    };

    this.enableStartingBtns = function() {
        $('.starting').prop('disabled', false);
    };

    this.disableStoppingBtns = function() {
        $('#stop').prop('disabled', true);
    };

    this.enableStoppingBtns = function() {
        $('#stop').prop('disabled', false);
    };

    this.startAnimation = function() {
        $('#spinnerID').css('animation', 'rota ' + this.clock_length * 60 + 's linear infinite');
        $('#fillerID').css('animation', 'opa ' + this.clock_length * 60 + 's steps(1, end) infinite reverse');
        $('#maskID').css('animation', 'opa ' + this.clock_length * 60 + 's steps(1, end) infinite');
        $('#spinnerID, #fillerID, #maskID').css('animation-play-state', 'running');
    };

    this.rewindAnimation = function() {
        $('#spinnerID, #fillerID, #maskID').css('animation-play-state', 'paused');
        $('#spinnerID').css('animation', 'none');
        $('#fillerID').css('animation', 'none');
        $('#maskID').css('animation', 'none');
    }

    this.start = function() {
        this.disableStartingBtns();
        this.enableStoppingBtns();
        this.countDown();
    };

    this.stop = function() {
        window.clearInterval(this.intervalID);
        this.intervalID = null;
        $('#spinnerID, #fillerID, #maskID').css('animation-play-state', 'paused');
        this.disableStoppingBtns();
        this.enableStartingBtns();
    };

    this.reset = function() {
        this.isClockTypeTest = false;
        this.resetClock();
    };

    this.restart = function() {
        this.reset();
        window.setTimeout(function() {
            me.start();
        }, 100, me = this);
    };

    this.test = function() {
        this.isClockTypeTest = true;
        this.resetClock();
        window.setTimeout(function() {
            me.start();
        }, 100, me = this);
    };

    this.increaseBreak = function() {
        this.isClockTypeTest = false;

        if (this.break_length < 30) {
            this.break_length++;
            this.resetClock();
        }
    };

    this.decreaseBreak = function() {
        this.isClockTypeTest = false;

        if (this.break_length > 1) {
            this.break_length--;
            this.resetClock();
        }
    };

    this.increaseSession = function() {
        this.isClockTypeTest = false;

        if (this.session_length < 59) {
            this.session_length++;
            this.clock_length = this.session_length;
            this.resetClock();

        }
    };

    this.decreaseSession = function() {
        this.isClockTypeTest = false;

        if (this.session_length > 1) {
            this.session_length--;
            this.clock_length = this.session_length;
            this.resetClock();
        }
    };

    this.resetClock();
}

$(function() {
    var pc = new PomodoroClock();

    $('#start').on('click', function () { pc.start(); });
    $("#stop").on("click", function () { pc.stop(); });
    $('#reset').on('click', function () { pc.reset(); });
    $('#restart').on('click', function () { pc.restart(); });
    $('#test').on('click', function () { pc.test(); });
    $("#break-plus").on("click", function () { pc.increaseBreak(); });
    $("#break-minus").on("click", function () { pc.decreaseBreak(); });
    $("#session-plus").on("click", function () { pc.increaseSession(); });
    $("#session-minus").on("click", function () { pc.decreaseSession(); });
});
