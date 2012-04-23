var nio = require("node.io"),
    //$ = require("jquery"),
    opts = {
      // Use jQuery and not SoupSelect
      jsdom: true
    };

exports.job = new nio.Job(opts, {
  input: false,
  run: function() {
    this.getHtml("http://smittenkitchen.com/recipes", function(err, $, data) {
      if(err) { this.fail_with(err); return; }
      
      var result = [],
          foundHrefs = {},
          $currEl, $links, $link;
      
      $("ul.lcp_catlist li > a").each(function(i, el) {  
        var $el = $(el),
            href = $el.attr("href");
        
        // Memoize our links to distinctify
        if(foundHrefs[href]) {
          return;
        }
        
        foundHrefs[href] = true;
        
        result.push({ 
          name: $el.text(), 
          href: href
        }); 
      });
      
      this.emit(result);
    });
  }
});

//nio.start(exports.job, opts, function(err, output) {

//  console.log(output[0]);

//}, true);