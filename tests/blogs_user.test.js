const User = require('../models/user')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret',10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('test users', () => {
  test('user\'s username must be unique', async () => {

    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Josue',
      username: 'root',
      password: 'alas'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('user\'s name must contain at least 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Josue',
      username: 'ro',
      password: 'alas'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('ro is not a valid user name it has to be more than 3 characters!')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('password  must contain at least 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Josue',
      username: 'roots',
      password: 'al'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('the password must contain at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})