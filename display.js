var d3 = require("d3");
var app = require("./app.js");


var body = d3.select("body");

var stats = body.append("div")
    .attr("class", "stats");

var tip = body.append("div")
    .attr("class", "tip")
    .html("<span>press ENTER...</span>");

body.append("div")
    .attr("class", "spacer");

var screen = body.append("div")
    .attr("class", "screen");

var text = screen.append("div")
    .attr("class", "text");
var author = screen.append("div")
    .attr("class", "author");

var input = body.append("input")
    .attr("type", "text")
    .each(function() {
        this.focus();
        var delay = 5;
        var elem = this;
        setInterval(function(){
            var len = elem.value.length;
            elem.setSelectionRange(len, len);
        }, delay);
    })
    .on("blur", function() {
        this.focus();
    })
    .on("input", function() {
        app.type(this.value);
    })
    .on("keypress", function() {
        if(d3.event.keyCode === 13)
            app.nextSession();
    });

module.exports.resetInput = function() {
    input.each(function(){
        this.value = "";
    });
};

module.exports.setAuthor = function(name) {
    setTimeout(function() {
        author.text("— "+name);
    }, 330);
}

module.exports.setStats = function(wpm, acc) {
    var html = "";
    html += wpm+"<span> wpm</span>";
    html += acc+"%<span> accuracy</span>";
    
    stats.html(html);
}

module.exports.showScore = function() {
    var duration = 300;
    
    author.transition()
        .duration(duration)
        .style("opacity", 1);
    
    stats.transition()
        .duration(duration)
        .style("opacity", 1);

    tip.transition()
        .duration(duration)
        .style("opacity", 1);

    text.selectAll(".correct").transition()
        .duration(duration)
        .style("color", "#334");
}

module.exports.hideScore = function() {
    var duration = 300;
    author.style("opacity", 1)
        .transition()
            .duration(duration)
            .style("opacity", 0);
    
    stats.style("opacity", 1)
        .transition()
            .duration(duration)
            .style("opacity", 0);
    
    tip.style("opacity", 1)
        .transition()
            .duration(duration)
            .style("opacity", 0);
}

module.exports.renderText = function(data) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    var FADE_SPEED = 1000;

    var words = text.selectAll(".word")
        .data(data);
        
    words.enter().append("div")
        .attr("class","word");

    var letters = text.selectAll(".word").selectAll(".letter")
        .data(function(d) {return d;}, function(d) {
            return d.session+" "+d.id;
        });
    
    letters
        .attr("class", function(d) {
            var c = "letter ";
            if(d.state == -1) c += "wrong";
            if(d.state == 1) c += "correct";
            return c;
        })
        .classed("space", function(d){return d.value==" ";});

    letters.enter().append("div")
        .attr("class", "letter")
        .classed("space", function(d){return d.value==" ";})
        .style("display","none")
        .style("opacity","0")
        .html(function(d) {return d.value==" "?"&nbsp;":d.value;})
        .each(function(d) {
            if(!this.classList.contains("entering")) {
                d3.select(this)
                    .style("top", "-"+getRandomInt(100,300)+"px")
                .transition()
                    .delay(FADE_SPEED*1.1)
                    .style("display", "inline-block")
                    .duration(FADE_SPEED)
                    .style("opacity", 1)
                    .style("top", "0px");
            }
        })
        .classed("entering", true);

    var lock = 0;
    letters.exit()
        .each(function() {
            if(!this.classList.contains("exiting")) {
                input.attr("disabled", "true");
                if(lock === 0) {
                    lock = 1;
                    setTimeout(function(){
                        input.attr("disabled",null);
                        lock = 0;
                    },FADE_SPEED*2);}
                var time = getRandomInt(FADE_SPEED/2,FADE_SPEED);
                var itime = FADE_SPEED - time;
                var l = d3.select(this)
                    .style("top", "0px");

                l.transition()
                    .duration(time)
                    .style("opacity", 0)
                    .style("top", "-"+getRandomInt(100,300)+"px");
                    
                l.transition()
                    .delay(FADE_SPEED)
                    .remove();
            }
        })
        .classed("exiting", true);
};
