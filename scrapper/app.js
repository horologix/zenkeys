var request = require("request");
var cheerio = require("cheerio");

var quotes = [];
var limit = 200;
var count = 0;

var max = 0;

for(var p = 1; p <= limit; p++) {
    var url = "http://www.keyhero.com/quotes/?page="+p+"&best";
    request(url, function(err, res, html) {
        if (!err && res.statusCode == 200) {
        
            var $ = cheerio.load(html);

            $(".col-md-7").filter(function() {
                var div = $(this);
                var strs = div.text().split("\r\n");
                var newStrs = [];
                for(var i = 0; i < strs.length; i++) {
                    
                    var str = strs[i].trim();
                    if(str.length>0)
                        newStrs.push(str);
                }
                strs = newStrs.slice(6, newStrs.length-2);

                for(var i = 0; i < strs.length; i++) {
                    
                    var name = strs[i];
                    if(i+1 >= strs.length) break;
                    if(strs[i+1].charAt(0) === '-') {
                        name += " "+strs[i+1];
                        i++;
                    }
                    var quote = strs[i+1];
                    i++;
                    
                    if(name.length >= 100) console.log("warning: long name "+name);
                    max = Math.max(max, quote.split(" ").length);

                    quotes.push({
                        author: name,
                        text: quote
                    });
                }
                count++;
                if(count === limit) {
                    console.log(JSON.stringify(quotes,null,0));
                    console.log(max);
                }
            });
        }
    });
}
