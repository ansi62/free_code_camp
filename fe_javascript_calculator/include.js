$(function() {
    var CalculatorProperties = {
        KEY_ZERO: {writable: false, configurable: false, enumerable: false, value: { cmd:'0', type:'num', disp:'0' } },
        KEY_ONE: {writable: false, configurable: false, enumerable: false, value: { cmd:'1', type:'num', disp:'1' } },
        KEY_TWO: {writable: false, configurable: false, enumerable: false, value: { cmd:'2', type:'num', disp:'2' } },
        KEY_THREE: {writable: false, configurable: false, enumerable: false, value: { cmd:'3', type:'num', disp:'3' } },
        KEY_FOUR: {writable: false, configurable: false, enumerable: false, value: { cmd:'4', type:'num', disp:'4' } },
        KEY_FIVE: {writable: false, configurable: false, enumerable: false, value: { cmd:'5', type:'num', disp:'5' } },
        KEY_SIX: {writable: false, configurable: false, enumerable: false, value: { cmd:'6', type:'num', disp:'6' } },
        KEY_SEVEN: {writable: false, configurable: false, enumerable: false, value: { cmd:'7', type:'num', disp:'7' } },
        KEY_EIGHT: {writable: false, configurable: false, enumerable: false, value: { cmd:'8', type:'num', disp:'8' } },
        KEY_NINE: {writable: false, configurable: false, enumerable: false, value: { cmd:'9', type:'num', disp:'9' } },
        KEY_DOT: {writable: false, configurable: false, enumerable: false, value: { cmd:'.', type:'num', disp:'.' } },

        KEY_PLUS: {writable: false, configurable: false, enumerable: false, value: { cmd:'+', type:'operator', disp:'+' } },
        KEY_MINUS: {writable: false, configurable: false, enumerable: false, value: { cmd:'-', type: 'operator', disp: '-' } },
        KEY_MULTIPLY: {writable: false, configurable: false, enumerable: false, value: { cmd:'x', type:'operator', disp:'&times;' } },
        KEY_DIVIDE: {writable: false, configurable: false, enumerable: false, value: { cmd:'/', type:'operator', disp:'&div;' } },
        KEY_EQUAL: {writable: false, configurable: false, enumerable: false, value: { cmd:'eq', type:'operator', disp:'=' } },

        KEY_AC: {writable: false, configurable: false, enumerable: false, value: { cmd:'ac', type:'cmd', disp:'ac' } },
        KEY_CE: {writable: false, configurable: false, enumerable: false, value: { cmd:'ce', type:'cmd', disp:'ce' } },

        DIGITS: {writable: false, configurable: false, enumerable: false, value: 2 },

        total: {writable: true, configurable: false, enumerable: false, value: new BigNumber(0) },
        dispEntry: {writable: true, configurable: false, enumerable: false, value: '0' },
        dispOper: {writable: true, configurable: false, enumerable: false, value: '' },
        dispRoll: {writable: true, configurable: false, enumerable: false, value: '' },
        lastOper: {writable: true, configurable: false, enumerable: false, value: null },
        lastKey: {writable: true, configurable: false, enumerable: false, value: null },
        dotPressed: {writable: true, configurable: false, enumerable: false, value: false }
    }

    var Calculator = {
        btnPressed: function (keyPushed) {
            switch (keyPushed.type) {
                case 'num':
                    if (this.lastOper == this.KEY_EQUAL) {
                        this.reset();
                        $("#roll").animate({ scrollTop: $('#roll').prop("scrollHeight")}, 1000);
                    }

                    if (keyPushed == this.KEY_DOT) {
                        if (this.dotPressed === false) {
                            this.dotPressed = true;
                        } else {
                            break;
                        }
                    }

                    if (this.dispEntry != '0' && this.lastKey.type != 'operator') {
                        this.dispEntry += keyPushed.disp;
                    } else {
                        this.dispEntry = keyPushed.disp;
                    }

                    $("#disp").html(this.dispEntry);
                    $("#oper").html(this.dispOper + this.dispEntry);
                    $("#roll").html(this.dispRoll + this.dispEntry);
                    break;
                case 'operator':
                    if (this.lastKey.type == 'operator' && this.lastKey != this.KEY_EQUAL) { break; }
                    if (keyPushed == this.lastOper == this.KEY_EQUAL) { break; }

                    var varBN = new BigNumber(this.dispEntry).round(this.DIGITS);

                    switch (this.lastOper) {
                        case null:
                        case this.KEY_PLUS:
                            this.total = this.total.plus(varBN).round(this.DIGITS);
                            break;
                        case this.KEY_MINUS:
                            this.total = this.total.minus(varBN).round(this.DIGITS);
                            break;
                        case this.KEY_MULTIPLY:
                            this.total = this.total.times(varBN).round(this.DIGITS);
                            break;
                        case this.KEY_DIVIDE:
                            this.total = this.total.dividedBy(varBN).round(this.DIGITS);
                            break;
                    }

                    if (this.lastOper == this.KEY_EQUAL) {
                        this.dispOper = '';
                        this.dispRoll += '<br>';
                    }

                    this.dispEntry = varBN.valueOf();
                    this.dispEntry += keyPushed.disp;

                    if (keyPushed == this.KEY_EQUAL) {
                        this.dispEntry += '<strong>' + this.total.valueOf() + '</strong>';
                    }

                    this.dispOper += this.dispEntry;
                    this.dispRoll += this.dispEntry;
                    this.dispEntry = this.total.valueOf();

                    $("#disp").html(this.dispEntry);
                    $("#oper").html(this.dispOper);
                    $("#roll").html(this.dispRoll);
                    this.lastOper = keyPushed;
                    this.dotPressed = false;
                    break;
                case 'cmd':
                    switch (keyPushed) {
                        case this.KEY_AC:
                            this.reset();
                            break;
                        case this.KEY_CE:
                            if (this.lastOper != this.KEY_EQUAL) {
                                this.dispEntry = '0';
                                $("#disp").html(this.dispEntry);
                                $("#oper").html(this.dispOper + this.dispEntry);
                                $("#roll").html(this.dispRoll + this.dispEntry);
                            }
                            break;
                    }

                    this.dotPressed = false;
                    break;
            }

            this.lastKey = keyPushed;
        },

        reset: function () {
            if (this.lastKey != this.KEY_AC) {
                this.dispRoll += '<br><br>';
                $("#roll").animate({ scrollTop: $('#roll').prop("scrollHeight")}, 1000);
            } else {
                this.dispRoll = '';
            }

            this.lastOper = this.KEY_PLUS;
            this.lastKey = this.KEY_ZERO;
            this.total = new BigNumber(0);
            this.dispOper = '';
            this.dispEntry = '0';
            $("#disp").html(this.dispEntry);
            $("#oper").html(this.dispOper + this.dispEntry);
            $("#roll").html(this.dispRoll + this.dispEntry);
        }
    }

    calc = Object.create(Calculator, CalculatorProperties);

    $("#zero").on("click", function() {
        calc.btnPressed(calc.KEY_ZERO);
    });
    $("#one").on("click", function() {
        calc.btnPressed(calc.KEY_ONE);
    });
    $("#two").on("click", function() {
        calc.btnPressed(calc.KEY_TWO);
    });
    $("#three").on("click", function() {
        calc.btnPressed(calc.KEY_THREE);
    });
    $("#four").on("click", function() {
        calc.btnPressed(calc.KEY_FOUR);
    });
    $("#five").on("click", function() {
        calc.btnPressed(calc.KEY_FIVE);
    });
    $("#six").on("click", function() {
        calc.btnPressed(calc.KEY_SIX);
    });
    $("#seven").on("click", function() {
        calc.btnPressed(calc.KEY_SEVEN);
    });
    $("#eight").on("click", function() {
        calc.btnPressed(calc.KEY_EIGHT);
    });
    $("#nine").on("click", function() {
        calc.btnPressed(calc.KEY_NINE);
    });
    $("#dot").on("click", function() {
        calc.btnPressed(calc.KEY_DOT);
    });

    $("#plus").on("click", function() {
        calc.btnPressed(calc.KEY_PLUS);
    });
    $("#minus").on("click", function() {
        calc.btnPressed(calc.KEY_MINUS);
    });
    $("#multiply").on("click", function() {
        calc.btnPressed(calc.KEY_MULTIPLY);
    });
    $("#divide").on("click", function() {
        calc.btnPressed(calc.KEY_DIVIDE);
    });
    $("#equal").on("click", function() {
        calc.btnPressed(calc.KEY_EQUAL);
    });

    $("#ac").on("click", function() {
        calc.btnPressed(calc.KEY_AC);
    });
    $("#ce").on("click", function() {
        calc.btnPressed(calc.KEY_CE);
    });
});
