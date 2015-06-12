var counter = 0;
var texts = [
    "This is one",
    "Two",
    "Three",
    "Four"
];

module.exports.next = function() {
    return texts[counter++ % texts.length];
}
