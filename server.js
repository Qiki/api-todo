var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    getAllLists: [List]
  }

  type Mutation {
    addList(title: String): List
    updateListWithTitle(id: String!, title:String): List
    deleteList(id: String!): String
    markCompleted(id: String!): List
  }

  type List {
    title: String,
    id: String,
    active: Boolean
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  getAllLists: () => {
    return lists;
  },
  addList: ({ title }) => {
    lists.push({
      title: title,
      active: true,
      id: new Date().getTime() + ''
    });

    return {
      title: title,
      active: true,
      id: new Date().getTime() + ''
    };
  },
  markCompleted: ({ id }) => {
    let obj = {};
    lists.forEach(currentList => {
      if (currentList.id === id) {
        currentList.active = !currentList.active;
        obj = currentList;
      }
    });

    return obj;
  },
  updateListWithTitle: ({ id, title }) => {
    let obj = {};
    lists.forEach(currentList => {
      if (currentList.id === id) {
        currentList.title = title;
        obj = currentList;
      }
    });

    return obj;
  },
  deleteList: ({ id }) => {
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].id === id) {
        lists.splice(i, 1);
      }
    }

    return 'deleted';
  }
};

var lists = [];

var app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

// get all lists -  query
// add list  - mutations
// delete list by id -  mutations
// update list by id -  mutations
