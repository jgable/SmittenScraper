var nio = require("node.io"),
    linkJob = require("./recipeLinks.js"),
    //$ = require("jquery"),
    opts = {
      // Use jQuery and not SoupSelect
      jsdom: true
    };
    
exports.job = new nio.Job(opts, {

  input: function(start, num, callback) {
    
    var self = this;
    
    if(this.links) {
       if(start < this.links.length) {
        // links left
         
        // Weird node.io thing here because we don't use the callback to pass the input.
        // If you return the data instead of the callback it works.
        // return this.links.slice(start, num);
         
        // Testing out whether using the callback with a timeout works.
        setTimeout(function() { 
          callback(self.links.slice(start, num));
        }, 100);
      } else {
      
        // When you return undefined, the job ends.
        return; 
      }
    } else {
    
      console.log("Loading links");
      nio.start(linkJob.job, opts, function(err, output) {
        console.log("Got links [" + output.length + "]");
        self.links = output;
        console.log("Input callback: " + start + ", " + num);
        callback(self.links.slice(start, num));
      }, true);
    }
  },
  
  run: function(page) {
     if(!page) {
       console.log("Failing because no page");
       this.fail_with("No page defined");
       return;
     }
     
     // Handle passing in json lines from a file.
     if(typeof page === "string" && page[0] === "{") {
       page = JSON.parse(page);
     }
     
     // Handle passing in multiple pages.
     if(page.length !== undefined) {
       page.forEach(function(_page) {
          _processPage(_page, this);
       });
     } else {
       _processPage(page, this);
     }
     
  }
});
  
var _processPage = function(page, job) {
  console.log("Processing page: " + page.name + " at " + page.href);
  
  if(!page.href) {
    console.log("Failing because no href in page object");
    job.fail_with("No href");
    return;
  }
  
  job.getHtml(page.href, function(err, $) {
   
     if(err) { job.fail_with(err); return; }
     
     // Do Something with the page.
     var $post = $("div.entry"),
         title = $post.find("h2 a").first().text() || "?",
         imgs = [],
         $img;
    
     $post.find("p > a > img").each(function() {
        $img = $(this);
        imgs.push({
          src: $img.attr("src"),
          alt: $img.attr("alt"),
          width: $img.attr("width"),
          height: $img.attr("height"),
          link: $img.parent().attr("href"),
          title: $img.parent().attr("title")
        });
     });
     
     job.emit({
       title: title,
       content: $post.html(),
       imgs: imgs
     });
   
   });
}

function runJob() {
  nio.start(exports.job, opts, function(err, output) {
      console.log((output && output[0]) || "?");
  });
};

// runJob();