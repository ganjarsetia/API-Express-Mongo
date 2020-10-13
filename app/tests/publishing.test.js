import supertest from 'supertest';
import app from '../config/express';
import Publishing from '../publishing/publishing.model';
import setupDB from './setup';
const request = supertest(app);

setupDB('db_pub');

const sampleData = [{ name: 'Pubilsher one' }, { name: 'Pubilsher dua' }];
let publishingRows = '';

describe('API Publishing /publishings', () => {
  beforeAll(async () => {
    publishingRows = await Publishing.insertMany(sampleData);
  });
  afterAll(async () => {
    await Publishing.remove({});
  });

  test('GET - /publishings - get all data', async done => {
    // prepare
    const expectedResult = sampleData;

    // action
    const response = await request.get('/publishings');
    const { body, statusCode } = response;

    // asert
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).toMatchObject(expectedResult);
    done();
  });

  test('error handling GET /publishings', async done => {
    // prepare
    const expectedResult = { message: 'Model error get data' };
    jest.spyOn(Publishing, 'find').mockImplementationOnce(() => Promise.reject(expectedResult));

    // action
    const response = await request.get('/publishings');
    const { statusCode, body } = response;

    // assert
    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('GET - /publishings/:id - get one data', async done => {
    // get 2nd row ID
    const idParam = publishingRows[1]._id;
    const expectedResult = sampleData[1];

    const response = await request.get('/publishings/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).toMatchObject(expectedResult);
    done();
  });

  test('error handling GET /publishings/:id', async done => {
    // get 2nd row ID
    const idParam = publishingRows[1]._id;
    const expectedResult = { message: 'Model error get data' };
    jest.spyOn(Publishing, 'findById').mockImplementationOnce(() => Promise.reject(expectedResult));

    const response = await request.get('/publishings/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('POST - /publishings - save', async done => {
    const expectedResult = { name: 'Publisher tiga' };
    const response = await request.post('/publishings').send(expectedResult);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Publishing created with success.');
    expect(body.data).toMatchObject(expectedResult);
    done();
  });

  test('POST - /publishings - no params', async done => {
    const response = await request.post('/publishings');
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('POST - /publishings - no params name', async done => {
    const expectedResult = { address: 'Good asphalt' };
    const response = await request.post('/publishings').send(expectedResult);
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('error handling POST /publishings', async done => {
    const expectedResult = { message: 'Model error save data' };
    jest.spyOn(Publishing, 'create').mockImplementationOnce(() => Promise.reject(expectedResult));

    const response = await request.post('/publishings').send({ name: 'Publisher empat' });
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('PUT - /publishings/:id - update data', async done => {
    // get 2nd row ID
    const idParam = publishingRows[1]._id;
    const expectedResult = { name: 'Pubilsher one A' };
    const response = await request.put('/publishings/' + idParam).send(expectedResult);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Publishing updated with success.');
    expect(body.data).toMatchObject(expectedResult);
    done();
  });

  test('PUT - /publishings - no body params', async done => {
    // get 2nd row ID
    const idParam = publishingRows[1]._id;
    const response = await request.put('/publishings/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('error handling PUT /publishings:id', async done => {
    const idParam = publishingRows[1]._id;
    const expectedResult = { name: 'Pubilsher one B' };
    jest
      .spyOn(Publishing, 'findByIdAndUpdate')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error update data' }));

    const response = await request.put('/publishings/' + idParam).send(expectedResult);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('DELETE - /publishings/:id - delete data', async done => {
    // get 2nd row ID
    const idParam = publishingRows[1]._id;
    const response = await request.delete('/publishings/' + idParam);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Publishing deleted with success.');
    done();
  });

  test('error handling DELETE /publishings:id', async done => {
    const idParam = publishingRows[0]._id;
    jest
      .spyOn(Publishing, 'findByIdAndRemove')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error delete data' }));

    const response = await request.delete('/publishings/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });
});
