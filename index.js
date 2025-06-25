require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))


const morgan = require('morgan')

morgan.token('content', function (req, res) {
    return JSON.stringify(req['body'])
})

app.use(morgan(':method - :url - :status - :res[content-length] :response-time ms - :content'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const amountPeople = persons.length ? persons.length : 0
        response.send(`
            <p>Phonebook has info for ${amountPeople} people</p>
            <p>${new Date()}</p>
        `)
    }
)})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (Person.find({ name: body.name } )) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} ::`);
    console.log('- http://localhost:3001/ -')
});