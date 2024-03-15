const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of helper.initialBlogs){
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret',10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
}, 20000)


test('We get the same amount of blogs and it is aswell alright in JSON', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
  for(let i = 0; i<response.length; i++) {
    expect(response.body[i]).toEqual(helper.initialBlogs[i])
  }
})

test('Unique id test', async () => {
  const blogs = await api.get('/api/blogs')

  for(let i=0; i<blogs.length;i++){
    expect(blogs.body[i].id).toBeDefined()
  }
})


test('test if the POST works right', async () => {

  const response  = await api.post('/api/login')
    .send({ username: 'root', password:'sekret' })
  const token = response.body.token
  const newBlog = {
    title: 'Check if this is working',
    author: 'Josue',
    url: 'https://checking.com/',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .set('Authorization',`Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type',/application\/json/)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length +1)

},10000)

test('test if the value of likes is zero whene there are no like', async () => {
  const response  = await api.post('/api/login')
    .send({ username: 'root', password:'sekret' })
  const token = response.body.token
  const newBlog = {
    title: 'the likes are functioning asexpected',
    author: 'Mixalis',
    url: 'https://checking.com/',
  }

  await api
    .post('/api/blogs')
    .set('Authorization',`Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type',/application\/json/)

  const blogs = await helper.blogsInDb()
  const blogsLikes = blogs.map(r => r.likes)
  expect(blogs).toHaveLength(helper.initialBlogs.length +1)
  expect(blogsLikes[2]).toBe(0)
})

describe('test bad request', () => {
  test('without title', async () => {
    const response  = await api.post('/api/login')
      .send({ username: 'root', password:'sekret' })
    const token = response.body.token

    const newBlog = {
      author: 'Mixalis',
      url: 'https://checking.com/',
    }

    await api
      .post('/api/blogs')
      .set('Authorization',`Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  }),
  test('without url', async () => {
    const response  = await api.post('/api/login')
      .send({ username: 'root', password:'sekret' })
    const token = response.body.token
    const newBlog = {
      title: 'the likes are functioning asexpected',
      author: 'Mixalis',
    }

    await api
      .post('/api/blogs')
      .set('Authorization',`Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('Delete tests', () => {
  test('delete with a right id', async () => {

    const response  = await api.post('/api/login')
      .send({ username: 'root', password:'sekret' })
    const token = response.body.token


    const newBlog = {
      title: 'Check if this is working',
      author: 'Josue',
      url: 'https://checking.com/',
      likes: 7,
    }

    await api
      .post('/api/blogs')
      .set('Authorization',`Bearer ${token}`)
      .send(newBlog)

    const blogs = await helper.blogsInDb()

    const blogToDelete = blogs[blogs.length-1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization',`Bearer ${token}`)
      .expect(204)

    const newBlogs = await helper.blogsInDb()

    expect(newBlogs).toHaveLength(helper.initialBlogs.length)

    const blogsTitles = newBlogs.map(r => r.title)
    expect(blogsTitles).not.toContain(blogToDelete.title)
  })
})

describe('Update tests', () => {
  test('update with right id', async () => {
    const blogs = await helper.blogsInDb()

    const blogToUpdate = blogs[0]

    const newBlog = {
      likes: 15,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    const newBlogs = await helper.blogsInDb()

    expect(newBlogs[0].likes).toEqual(newBlog.likes)
  })
})


afterAll(() => {
  mongoose.connection.close()
})