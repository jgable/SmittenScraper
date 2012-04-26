
var nio = require("node.io"),
  skJobs = require("./recipeLinks.js"),
  simpleTest = function(name, handler) {
    exports[name] = function(t) {
      var result = handler.apply(this, [t]);
      if(!result) {
        t.done();
      }
    };
  };

simpleTest("Runs Tests", function(test) {

  test.ok(true, "running tests… like a bawss");

});

simpleTest("Has Node_io", function(test) {

  test.ok(nio, "Has node.io");

});

simpleTest("Has Jobs", function(test) {

  test.ok(skJobs, "Has jobs module");
  test.ok(skJobs.job, "Has job in jobs module");
  test.ok(skJobs.job.run, "Has run method");

});

simpleTest("Runs recipeLinks Job", function(test) {

  nio.start(skJobs.job, {}, function(err, output) {
      
      if(err) { test.ok(false, "Failed test: " + err); }
      
      test.notEqual(output.length, 0, "Got output");
      test.ok(output[0].name, "Has name");
      test.ok(output[0].href, "Has link");
      
      test.done();
      
  }, true);
  
  // Don't automatically call done().
  return true;

});



