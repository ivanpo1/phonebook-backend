const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
    console.log('connected to MongoDB')
})
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema =
    new mongoose.Schema({
        name: String,
        number: String,
    })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phoneboook:')
        result.forEach(person => console.log(person.name, person.number))
        mongoose.connection.close()
        process.exit(1)
    })
}

if (process.argv.length === 4) {
    console.log('please add a number')
    process.exit(1)
}

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(result)
        mongoose.connection.close()
        process.exit(1)
    })
}

module.exports = mongoose.model('Person', personSchema)