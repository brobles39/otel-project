const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const apiKey = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
const jwtSecret = 'DemoSK';

let server;

describe('POST /DevOps', () => {
  const validPayload = {
    message: 'This is a test',
    to: 'Juan Perez',
    from: 'Rita Asturia',
    timeToLifeSec: 45,
  };

  const token = jwt.sign({ user: 'test-user' }, jwtSecret, {
    expiresIn: '1h',
  });

  it('should return 200 and a valid response with a valid payload and API key', async () => {
    const res = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', apiKey)
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      message: 'Hello Juan Perez, your message will be send',
    });
  });

  it('should return 403 (Forbidden) with an invalid API key', async () => {
    const res = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', 'invalid-api-key')
      .set('Authorization', `Bearer ${token}`)
      .send(validPayload);

    expect(res.statusCode).toEqual(403);
  });

  it('should return 400 (Bad Request) with an incomplete payload', async () => {
    const incompletePayload = { ...validPayload };
    delete incompletePayload.message;

    const res = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', apiKey)
      .set('Authorization', `Bearer ${token}`)
      .send(incompletePayload);

    expect(res.statusCode).toEqual(400);
  });

  it('should return 401 (Unauthorized) with an invalid JWT', async () => {
    const res = await request(app)
      .post('/DevOps')
      .set('X-Parse-REST-API-Key', apiKey)
      .set('Authorization', 'Bearer invalid-jwt')
      .send(validPayload);
    expect(res.statusCode).toEqual(401);
  });
});

describe('GET /', () => {
  it('should return 405 (Method Not Allowed)', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(405);
  });
});

beforeAll(() => {
  server = global.server;
});

afterAll(() => {
  server.close();
});
