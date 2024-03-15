const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Let\'s check if this works',
    author: 'Josue',
    url: 'https://wwww.casa.com',
    likes: 12
  },
  {
    title: 'this is working',
    author: 'Mixalis',
    url: 'https://wwww.casa.com',
    likes: 7
  }
]


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  blogsInDb,
  usersInDb,
  initialBlogs,
}