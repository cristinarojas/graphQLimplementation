// Dependencie
const express = require('express');
const app = express();
const express_graphql = require('express-graphql');
// This Dependencie will help us
// to define schemes
const { buildSchema } = require('graphql');

// Data
const { courses } =  require('./data.json');

// Building our schema
// we define all the types of queries
// that the users can do
const schema = buildSchema(`
  type Query {
    message: String
    course(id: Int!): Course
    courses(topic: String): [Course]
  }

  type Course {
    id: Int
    title: String
    description: String
    author: String
    topic: String
    url: String
  }
`);

// Object that have the methods

// Function to get course
let getCourse = (args) => {
  // getting the id
  let id = args.id;

  // Returning only the course that match
  // with the id that the user wrote
  return courses.filter((course) => {
    return course.id == id;
  })[0]; // because filter return an array, I only want item 0
}

// Function to get multiple courses
let getCourses = (args) => {
  if (args.topic) {
    let topic = args.topic;

    // return in an array all the courses that have
    // that topic
    return courses.filter((course) => {
      return course.topic == topic
    });
  } else { // if not
    // then return all the courses
    return courses;
  }
}

const root = {
  message: () => "Hello world!",
  course: getCourse,
  courses: getCourses
}

// To build a path to interact with graphql
// when the user is in /graphql]
// will see the schema and the methods that return something
app.use('/graphql', express_graphql({
  schema: schema, // when u
  rootValue: root,
  graphiql: true // Is a graphic interfaz of graphQL
}));

// Initializing our server
app.listen(3000, () => console.log('Server on port 3000!'));
