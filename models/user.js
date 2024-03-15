const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'the user name is required'],
    unique: true,
    validate: {
      validator: (v) => {
        return /.{3,}/.test(v)
      },
      message: props => `${props.value} is not a valid user name it has to be more than 3 characters!`
    }
  },
  passwordHash: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /.{3,}/.test(v)
      },
      message: 'is not a valid user name it has to be more than 3 characters!'
    }
  },
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON',{
  transform: (documente,returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User