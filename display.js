var d3 = require("d3");
var app = require("./app.js");


var body = d3.select("body");
body.append("div")
    .attr("class", "spacer");

var screen = body.append("div")
    .attr("class", "screen");

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
    });

module.exports.resetInput = function() {
    input.each(function(){
        this.value = "";
    });
};

module.exports.renderScreen = function(data) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    var FADE_SPEED = 1000;
    var letters = screen.selectAll(".letter")
        .data(data, function(d) {return d.session+" "+d.id;});
    
    console.clear();
    console.log(JSON.stringify(data));
    
    letters
        .attr("class", function(d) {
            var c = "letter ";
            if(d.state == -1) c += "wrong";
            if(d.state == 1) c += "correct";
            return c;
        });

    letters.enter().append("div")
        .attr("class", "letter")
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

    letters.exit()
        .each(function() {
            if(!this.classList.contains("exiting")) {
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
