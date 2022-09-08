const newman = require("newman");
const _ = require("lodash");

const main = () => {
  console.log(process.env.CIRCLE_NODE_TOTAL);
  console.log(process.env.CIRCLE_NODE_INDEX);
  const original_collection = require("./Test.postman_collection.json");
  const collections = _.chunk(
    original_collection.item,
    Math.ceil(original_collection.item.length / 4)
  );

  if(collections.length -1 > parseInt(process.env.CIRCLE_NODE_INDEX)){
    console.log("No need for this runner")
    process.exit(0)
  }

  console.log(`RUNNER ${process.env.CIRCLE_NODE_INDEX} ACTIVE`)


  newman
    .run({
      collection: {
        // should probably deep copy original collection but whatever this is a test
        info: original_collection.info,
        item: collections[process.env.CIRCLE_NODE_INDEX],
      },
      reporter: ["json-summary"],
    })
    .on("done", function (err, summary) {
      if (err !== null) {
        console.log(err);
      }
      summary.run.executions.map((el) => {
        // console.log(el.response.code)
        if (`${el.response.code}`.startsWith("2")) {
          console.log("SUCCESS: ", el.request.url.path);
          // console.log("success")
        } else {
          console.log("exiting with error", el);
          process.exit(1);
          // console.log("error")
        }
      });
    });
};

main();
