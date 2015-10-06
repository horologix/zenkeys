var display = require("./display.js");
var generator = require("./generator.js");

function Timer() {
    var startTime,
        endTime;

    var inst = {};
    inst.reset = function() {
        startTime = undefined;
        endTime = undefined;
    };
    inst.start = function() {
        startTime = Date.now();
    };
    inst.stop = function() {
        endTime = Date.now();
    };
    inst.get = function() {
        console.log(startTime);
        console.log(endTime);
        if(endTime === undefined)
            return Date.now() - startTime;
        else
            return (endTime - startTime) / 1000;
    };
    inst.started = function() {
        return startTime !== undefined;
    }
    return inst;
}

function Text() {
    var session     = 0,
        errors      = 0,
        text        = "",
        author      = "",
        complete    = false;

    var inst = {};
    inst.next = function() {
        var nextText = generator.next();
        text = nextText.text;
        author = nextText.author;
        complete = false;
        errors = 0;
        session++;
    }
    inst.compare = function(input) {
        errors = 0;
        var WORD_LIMIT = 110; //REACTOR LATER
        var data = [];
        var word = [];
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
                errors++;
            }
            word.push(d);
            if(c1 === " ") {
                data.push(word);
                word = [];
            }
        }
        if(word.length > 0)
            data.push(word);
        while(data.length < WORD_LIMIT)
            data.push([]);

        if(input.length >= text.length)
            complete = true;
        return data;
    };
    inst.finished = function() {
        return complete;
    };
    inst.getAuthor = function() {
        return author;
    };
    inst.findACC = function(input) {
        return Math.floor((text.length-errors)/text.length*10000)/100;
    };
    inst.findWPM = function(time) {
        return Math.floor((text.length - errors)/5/time*6000)/100;
    };
    return inst;
}

function setup() {
    text.next();
    timer.reset();

    display.resetInput();
    display.setAuthor(text.getAuthor());
    display.hideScore();

    updateText("");
}

function updateText(input) {
    var data = text.compare(input);
    display.renderText(data);
}

function updateStats() {
    display.setStats(text.findWPM(timer.get()), text.findACC());
}

module.exports.type = function(input) {
    if(text.finished()) {
        return;
    } else{
        if(!timer.started()) { 
            timer.start();
        }
        updateText(input);
        if(text.finished()) {
            timer.stop();
            updateStats();
            display.showScore();
        }
    }
};

module.exports.nextSession = function() {
    if(text.finished())
        setup();
}

var timer = Timer();
var text = Text();

setup();
