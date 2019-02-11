const Joi = require('joi');//a class is returned from this module and classes are PascalCase
const express = require('express');
const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: 'math' },
  { id: 2, name: 'astronomy' },
  { id: 3, name: 'computer science' }
]

app.get('/', (req, res) => {  //this takes 2 args( 1. path or URL, 2. callback function )
  res.send('Hello World!!!');
  res.end();
});

app.get('/api/courses', (req, res) => {
  //Typically this is where we get a list of courses from the database
  res.send(courses);
  //in the future, we can redirect the user to a file called 'courses.js'
});


app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body); //result.error
  if (error) {
    res.status(400).send(error.details[0].message); //400 - Bad request
    return;
  }

  let course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  //look up the course ID
  //if the course ID does not exist, we return 404
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with the given ID was not found'); //404 -> this means Object not found
    return;
  }

  //otherwise we need to validate the course - Joi schema 
  //If Invalid, return 400 - Bad Request

  // const result = validateCourse(req.body); //we can refactor and make this cleaner by using 
  //the object destructure feature and modern javascript
  const { error } = validateCourse(req.body); //result.error

  if (error) {
    res.status(400).send(error.details[0].message); //400  Bad request
    return;
  }

  //Update the course
  course.name = req.body.name;
  //Return updated course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    // id: Joi.number().integer().min(1).max(255).required(),
    name: Joi.string().min(3).required()
  };

  return Joi.validate(course, schema);
}


app.delete('/api/courses/:id', (req, res) => {
  //look up the course
  let course = courses.find(c => c.id === parseInt(req.params.id));
  //if it does not exist -return 404
  if (!course) return res.status(404).send('The course with the given ID was not found'); //404 -> this means Object not found
  // otherwise if it exists, delete it
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);


});


app.get('/api/courses/:id', (req, res) => {
  let course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found'); //404 -> this means Object not found
  res.send(course);
});


const port = process.env.PORT || 3012;
app.listen(port, () => console.log(`listening on port ${port}...`));