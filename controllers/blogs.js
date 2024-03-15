const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request,response) => {
  const blogs = await Blog
    .find({}).populate('user', { username:1, name:1 })
  response.json(blogs)
})

blogsRouter.post('/',middleware.userExtractor, async (request,response) => {
  const body = request.body

  const user = request.user

  if(!body.title || !body.url ){
    response.status(400).json({ error: 'the title and the url are required' })
    return
  }
  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const blogSaved  = await blog.save()
  user.blogs = user.blogs.concat(blogSaved._id)
  await user.save()

  response.status(201).json(blogSaved)
})

blogsRouter.delete('/:id',middleware.userExtractor, async (request,response) => {

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if(blog.user._id.toString() === user._id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  return response.status(403).json({ error: 'authorization denied' })
})

blogsRouter.put('/:id', async (request,response) => {
  const body = request.body

  const blogToUpdate = await Blog.findById(request.params.id)

  if(!blogToUpdate){
    response.status(404).end()
    return
  }

  const blog = {
    title: blogToUpdate .title,
    author: blogToUpdate .author,
    url: blogToUpdate .url,
    likes: body.likes || 0
  }

  const blogUpdated = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })
  response.json(blogUpdated)
})

module.exports = blogsRouter