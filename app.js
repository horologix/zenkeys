var display = require("./display.js");
var generator = require("./generator.js");

function Timer() {
    var inst = {};
    inst.reset = function() {
        inst.start = undefined;
        inst.end = undefined;
    };
    inst.run = function() {
        inst.start = Date.now();
    };
    inst.stop = function() {
        inst.end = Date.now();
    };
    inst.get = function() {
        if(inst.end === undefined)
            return Date.now() - inst.start;
        else
            return inst.end - inst.start;
    };
    inst.started = function() {
        return inst === undefined;
    }
    return inst;
}

function Text() {
    var session     = 0,
        text        = "",
        complete    = false;

    var inst = {};
    inst.next = function() {
        text = generator.next();
        complete = false;
        errors = 0;
        session++;
    }
    inst.compare = function(input) {
        var data = [];
        for(var i = 0; i < text.length; i++) {
            var d = {};
            var c1 = text.charAt(i);
            var c2 = input.charAt(i);
            d.session = session;
            d.id = i;
            d.value = c1;
            if(c2 === "") {
                d.state = 0;
            } else if(c2 === c1){
                d.state = 1;
            } else {
                d.state = -1;
            }
            data.push(d);
        }
        if(input.length >= text.length)
            complete = true;
        return data;
    };
    inst.finished = function() {
        return complete;
    };
    return inst;
}

function Stats(timer, text) {
    var inst = {};
    inst.reset = function() {
        inst.wpm = 0;
        inst.acc = 0;
    };
    inst.calculate = function() {
        //wpm is correct text typed per time spent typing
        //acc is 1 - errors / correct text
    };
    return inst;
}

function setup() {
    text.next();
    timer.reset();
    stats.reset();
    display.resetInput();
    updateText("");
    updateStats();
}

function updateText(input) {
    var data = text.compare(input);
    display.renderScreen(data);
}

function updateStats() {
    //display.renderStats();
}

module.exports.type = function(input) {
    if(text.finished()) {
        setup();
    } else{
        if(!timer.started()) { 
            timer.run();
        }
        updateText(input);
    }
};

var timer = Timer();
var text = Text();
var stats = Stats(timer, text);

setup();
