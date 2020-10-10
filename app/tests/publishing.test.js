import supertest from 'supertest';
import app from '../config/express';
import Publishing from '../publishing/publishing.model';
import setupDB from './setup';
const request = supertest(app);

setupDB();

describe('API Publishing /publishings', () => {
  afterAll(async () => {
    await Publishing.remove({});
  });

  test('GET - /publishings - get all data', async done => {
    // prepare
    const expectedResult = [{ name: 'Pubilsher one' }, { name: 'Pubilsher dua' }];
    await Publishing.insertMany(expectedResult);

    // action
    const response = await request.get('/api/publishings');
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
    const response = await request.get('/api/publishings');
    const { statusCode, body } = response;

    // assert
    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });
});
