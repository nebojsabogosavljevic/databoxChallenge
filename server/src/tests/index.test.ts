import request from 'supertest';
import app from '../index';

describe('Test the root path', () => {
  test('It should respond to the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Express + TypeScript Server');
  });
});

// describe('Test the news path', () => {
//   test('It should respond to the GET method', async () => {
//     const response = await request(app).get('/news');
//     expect(response.statusCode).toBe(200);
//   });
// });

describe('Test the weather path', () => {
  test('It should respond to the GET method', async () => {
    const response = await request(app).get('/weather');
    expect(response.statusCode).toBe(200);
  });
});
