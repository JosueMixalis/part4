const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: {
    type:String,
    validate: {
      validator: (v) => {
        return /https:\/\/.*/.test(v)
      },
      message: props => `${props.value} is not a valid url!`
    },
    require:[true, 'the url is requiered']
  },
  likes:Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Blog',blogSchema)