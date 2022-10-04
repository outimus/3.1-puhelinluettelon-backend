const mongoose = require("mongoose")

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlenght: 3,
      required: true
    },
    number: {
      type: String,
      required: true
    } 
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)