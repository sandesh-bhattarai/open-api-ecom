const express = require("express");
const app = express();
require("./db.config");

const cors = require("cors");
app.use(cors());

const router = require("../router/");
const { MulterError } = require("multer");
const { ZodError } = require("zod");
const path = require("path");

const event = require("./event.config");
// const {
//   GraphQLSchema,
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLList,
//   GraphQLID,
//   GraphQLFloat,
// } = require("graphql");
// const { graphqlHTTP } = require("express-graphql");
// const categorySvc = require("../app/category/category.service");
// const { createHandler } = require("graphql-http/lib/use/express");

// body parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use("/asset", express.static("./public/uploads/"));

app.use("/health", (req, res, next) => {
  res.send("Success Ok");
});
app.use(event);
app.use("/api/v1", router);

// PRODUCT
// const Product = new GraphQLObjectType({
//   name: "Product",
//   fields: {
//     _id: { type: GraphQLID },
//     title: { type: GraphQLString },
//     // description: {type: GraphQLString},
//     status: { type: GraphQLString },
//   },
// });
// const ProductInputType = new GraphQLObjectType({
//   name: "ProductInput",
//   fields: {
//     title: { type: GraphQLString },
//     status: { type: GraphQLString },
//   },
// });
// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "Query",
//     fields: {
//       products: {
//         type: new GraphQLList(Product),
//         resolve: async () => {
//           //
//           // let data = await categorySvc.getData({}, {limit: 10, skipt: 0})
//           return [];
//         },
//       },
//     },
//   }),
//   mutation: new GraphQLObjectType({
//     name: "Mutation",
//     fields: {
//       createProduct: {
//         args: {
//           title: GraphQLString,
//           status: GraphQLString,
//         },
//         type: Product,
//         resolve: ({ title, status }) => {
//           console.log(args);
//           return {
//             _id: "",
//             title: "",
//             status: "",
//           };
//         },
//       },
//     },
//   }),
// });

// // app.all('/api/v1/graphql', createHandler({
// //     schema: schema,
// // }))

// app.use(
//   "/api/v1/graphql",
//   graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//   }),
// );
// 404 handle
app.use((req, res, next) => {
  next({ code: 404, message: "Not found" });
});

// Error handling Middleware
app.use((error, req, res, next) => {
  console.log("GarbageCollector: ", error);
  let code = error.code ?? 500;
  let message = error.message ?? "Internal Server error...";
  let result = error.result ?? null;

  // TODO: Handle different type of exception
  if (error instanceof MulterError) {
    // handle errors
    if (error.code === "LIMIT_FILE_SIZE") {
      code = 400;
      message = error.message;
    }
  }

  if (error instanceof ZodError) {
    code = 400;
    // let zodErrors = error.errors;
    let msg = {};
    // {name: "", email: ""}
    error.errors.map((err) => {
      msg[err.path[0]] = err.message;
    });
    message = "Validation Failure";
    result = msg;
  }

  if (error.code === 11000) {
    code = 400;

    let uniqueKeys = Object.keys(error.keyPattern);
    let msgBody = uniqueKeys.map((key) => {
      return {
        [key]: key + " should be unique",
      };
    });
    result = msgBody;
    message = "Validation Fail";
  }

  res.status(code).json({
    result: result,
    message: message,
    meta: null,
  });
});
module.exports = app;
