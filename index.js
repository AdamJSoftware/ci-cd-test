const newman = require("newman");

const main = () => {
  newman
    .run({
      collection: "./Test.postman_collection.json",
      reporter: ["json-summary"],
    })
    .on("done", function (err, summary) {
      if (err !== null) {
        console.log(err);
      }
        summary.run.executions.map((el) => {
          // console.log(el.response.code)
          if (`${el.response.code}`.startsWith("2")) {
            console.log("SUCCESS: ", el.request.url.path)
            // console.log("success")
          } else {
            console.log("exiting with error", el)
            process.exit(1);
            // console.log("error")
          }
        })
    });
};

main();
