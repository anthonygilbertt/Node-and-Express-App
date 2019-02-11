const Joi = require('joi');//a class is returned from this module and classes are PascalCase
const express = require('express');
const app = express();
app.use(express.json());

const courses = [
    { id: 1, name: 'math'},
    { id: 2, name: 'astronomy'},
    { id: 3, name: 'computer science'}
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
    //Joi schema 
    const schema = Joi.object().keys({
        // id: Joi.number().integer().min(1).max(255).required(),
        name: Joi.string().min(3).required()
    }).with('id', 'name');//

    const result = Joi.validate(req.body, schema);
    //here we can write some validation logic
    //you always want to write validation logic at the beginning of the route handler
if (result.error) {    
    res.status(400).send(result.error.details[0].message); //400  Bad request
    return;
}

    let course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found'); //404 -> this means Object not found
    res.send(course);
});


const port = process.env.PORT || 3012;
app.listen(port, () => console.log(`listening on port ${port}...`));