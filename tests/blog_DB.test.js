const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of helper.initialBlogs){
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
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
  const newBlog = {
    title: 'Check if this is working',
    author: 'Josue',
    url: 'https://checking.com/',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type',/application\/json/)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length +1)

},10000)

test('test if the value of likes is zero whene there are no like', async () => {
  const newBlog = {
    title: 'the likes are functioning asexpected',
    author: 'Mixalis',
    url: 'https://checking.com/',
  }

  await api
    .post('/api/blogs')
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
    const newBlog = {
      author: 'Mixalis',
      url: 'https://checking.com/',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  }),
  test('without url', async () => {
    const newBlog = {
      title: 'the likes are functioning asexpected',
      author: 'Mixalis',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})


afterAll(() => {
  mongoose.connection.close()
})