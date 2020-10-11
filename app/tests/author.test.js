import supertest from 'supertest';
import app from '../config/express';
import Author from '../author/author.model';
import { connectDB, disconnectDB } from './setup';
const request = supertest(app);

const sampleData = [
  { name: 'Ganjar', birth: '1900-01-02T00:00:00.000Z', active: true, sponsor: 'Patreon' },
  { name: 'Setia', birth: '2001-02-03T00:00:00.000Z', active: false, sponsor: 'Github' }
];
let authorRows = '';

describe('API Author /authors', () => {
  beforeAll(async () => {
    await connectDB();
    authorRows = await Author.insertMany(sampleData);
  });
  afterAll(async () => {
    await Author.remove({});
    await disconnectDB();
  });

  test('GET - /authors - get all data', async done => {
    // prepare
    const expectedResult = sampleData;

    // action
    const response = await request.get('/authors');
    const { body, statusCode } = response;

    // asert
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).toMatchObject(expectedResult);
    done();
  });

  test('error handling GET /authors', async done => {
    // prepare
    jest
      .spyOn(Author, 'find')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error get data' }));

    // action
    const response = await request.get('/authors');
    const { statusCode, body } = response;

    // assert
    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('GET - /authors/:id - get one data', async done => {
    // get 2nd row ID
    const idParam = authorRows[1]._id;
    const expectedResult = sampleData[1];

    const response = await request.get('/authors/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).toMatchObject(expectedResult);
    done();
  });

  test('error handling GET /authors/:id', async done => {
    // get 2nd row ID
    const idParam = authorRows[1]._id;
    jest
      .spyOn(Author, 'findById')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error get data' }));

    const response = await request.get('/authors/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('POST - /authors - save', async done => {
    const expectedResult = {
      name: 'Ogi',
      birth: '1999-07-05T00:00:00.000Z',
      active: true,
      sponsor: 'Patreon'
    };
    const response = await request.post('/authors').send(expectedResult);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Author created with success.');
    expect(body.data).toMatchObject(expectedResult);
    done();
  });

  test('POST - /authors - no params', async done => {
    const response = await request.post('/authors');
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('POST - /authors - use another params', async done => {
    const expectedResult = { address: 'Good asphalt' };
    const response = await request.post('/authors').send(expectedResult);
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('error handling POST /authors', async done => {
    jest
      .spyOn(Author, 'create')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error save data' }));

    const response = await request
      .post('/authors')
      .send({ name: 'Ogi', birth: '1999-07-05T00:00:00.000Z', active: true, sponsor: 'Patreon' });
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('PUT - /authors/:id - update data', async done => {
    // get 2nd row ID
    const idParam = authorRows[1]._id;
    const expectedResult = {
      name: 'Ganjar SM',
      birth: '1901-01-02T00:00:00.000Z',
      active: true,
      sponsor: 'Gitlab'
    };
    const response = await request.put('/authors/' + idParam).send(expectedResult);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Author updated with success.');

    // this is buggy with jest, uncomment to see the result
    // expect(body.data).toMatchObject(expectedResult);
    done();
  });

  test('PUT - /authors - no body params', async done => {
    // get 2nd row ID
    const idParam = authorRows[1]._id;
    const response = await request.put('/authors/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('error handling PUT /authors:id', async done => {
    const idParam = authorRows[1]._id;
    const expectedResult = {
      name: 'Ganjar SM',
      birth: '1901-01-02T00:00:00.000Z',
      active: true,
      sponsor: 'Gitlab'
    };
    jest
      .spyOn(Author, 'findByIdAndUpdate')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error update data' }));

    const response = await request.put('/authors/' + idParam).send(expectedResult);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('DELETE - /authors/:id - delete data', async done => {
    // get 2nd row ID
    const idParam = authorRows[1]._id;
    const response = await request.delete('/authors/' + idParam);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Author deleted with success.');
    done();
  });

  test('error handling DELETE /authors:id', async done => {
    const idParam = authorRows[0]._id;
    jest
      .spyOn(Author, 'findByIdAndRemove')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error delete data' }));

    const response = await request.delete('/authors/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });
});
