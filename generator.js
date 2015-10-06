var quotes = require("./quotes.json");
var counter = 0;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
module.exports.next = function() {
    return quotes[rand(0, quotes.length)];
}
