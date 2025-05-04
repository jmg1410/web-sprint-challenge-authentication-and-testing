// Write your tests here

const request = require('supertest');
const server = require('./server')
const db = require('../data/dbConfig')

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('POST /api/auth/register', () => {
  test('registers a new user and returns it', async () => {
    const res = await request(server).post('/api/auth/register').send({
      username: 'zoro',
      password: 'santoryuu'
    })
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username','zoro')
  })
  test('respond with 400 if username or password is missing', async () => {
    const res = await request(server).post('/api/auth/register').send({
      username: 'zoro'
    })
    expect(res.status).toBe(400);
    expect(res.body).toEqual({message: 'username and password required'})
  })
})

describe('POST /api/auth/login',  () => {
  test('logs in a user with correct credentials and returns a token', async () => {
    await request(server).post('/api/auth/register').send({
    username: 'luffy',
    password: 'gumgum'
    })
    const res = await request(server).post('/api/auth/login').send({
      username: 'luffy',
      password: 'gumgum'
    })
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'welcome, luffy');
    expect(res.body).toHaveProperty('token')
  })
  test('responds with 400 if username or password is missing', async () => {
    const res = await request(server).post('/api/auth/login').send({
      username: 'luffy'
    })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({message: 'username and password required'})
  });
  test('responds with 401 if credentials are invalid', async () => {
     const res = await request(server).post('/api/auth/login').send({
       username: 'wrong',
       password: 'wrong'
  })
   expect(res.status).toBe(401)
   expect(res.body).toEqual({message:'invalid credentials'})

  })
})

describe('GET /api/jokes', () => {
  test('denies access without a token', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({message: 'token required'})
  })
  test('allows access with a valid token', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({username:'sanji', password:'diablejambe'});

    const login = await request(server)
      .post('/api/auth/login')
      .send({username:'sanji', password:'diablejambe'}) 
      
    const token = login.body.token;
    
    const res = await request(server)
       .get('/api/jokes')
       .set('Authorization', token)

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body[0]).toHaveProperty('joke')   
  })
})