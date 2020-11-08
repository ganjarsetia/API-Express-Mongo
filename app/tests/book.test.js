import supertest from 'supertest';
import app from '../config/express';
import Book from '../book/book.model';
import setupDB from './setup';
const request = supertest(app);

setupDB('db_book');

const sampleData = [
  {
    title: 'Buku 1',
    ISBN: '9789446125447',
    authors: ['Ganjar Setia'],
    publishing: { name: 'Pubilsher one' },
    year: 2020
  },
  {
    title: 'Buku 2',
    ISBN: '9789446125447',
    authors: ['Si Fulan', 'Ganjar'],
    publishing: { name: 'Pubilsher two' },
    year: 2019
  }
];
let bookRows = '';

describe('API Book /books', () => {
  beforeAll(async () => {
    bookRows = await Book.insertMany(sampleData);
  });
  afterAll(async () => {
    await Book.remove({});
  });

  test('GET - /books - get all data', async done => {
    // prepare
    const expectedResult = sampleData;

    // action
    const response = await request.get('/books');
    const { body, statusCode } = response;

    // asert
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).toMatchObject(expectedResult);
    done();
  });

  test('error handling GET /books', async done => {
    // prepare
    jest
      .spyOn(Book, 'find')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error get data' }));

    // action
    const response = await request.get('/books');
    const { statusCode, body } = response;

    // assert
    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('GET - /books/:id - get one data', async done => {
    // get 2nd row ID
    const idParam = bookRows[1]._id;
    const expectedResult = sampleData[1];

    const response = await request.get('/books/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).toMatchObject(expectedResult);
    done();
  });

  test('error handling GET /books/:id', async done => {
    // get 2nd row ID
    const idParam = bookRows[1]._id;
    jest
      .spyOn(Book, 'findById')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error get data' }));

    const response = await request.get('/books/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('POST - /books - save', async done => {
    const expectedResult = {
      title: 'Buku 3',
      ISBN: '9789446125447',
      authors: ['The Author'],
      publishing: { name: 'Pubilsher three' },
      year: 2018
    };
    const response = await request.post('/books').send(expectedResult);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Book created with success.');
    expect(body.data).toMatchObject(expectedResult);
    done();
  });

  test('POST - /books - no params', async done => {
    const response = await request.post('/books');
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('POST - /books - use another params', async done => {
    const expectedResult = { address: 'Good asphalt' };
    const response = await request.post('/books').send(expectedResult);
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('error handling POST /books', async done => {
    jest
      .spyOn(Book, 'create')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error save data' }));

    const response = await request
      .post('/books')
      .send({
        title: 'Buku 3',
        ISBN: '9789446125447',
        authors: ['The Author'],
        publishing: { name: 'Pubilsher three' },
        year: 2018
      });
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('PUT - /books/:id - update data', async done => {
    // get 2nd row ID
    const idParam = bookRows[1]._id;
    const expectedResult = {
      title: 'Buku 4',
      ISBN: '9789446125447',
      authors: ['The Author 2'],
      publishing: { name: 'Pubilsher three' },
      year: 2018
    };
    const response = await request.put('/books/' + idParam).send(expectedResult);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Book updated with success.');
    expect(body.data).toMatchObject(expectedResult);
    done();
  });

  test('PUT - /books - no body params', async done => {
    // get 2nd row ID
    const idParam = bookRows[1]._id;
    const response = await request.put('/books/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(400);
    expect(typeof body).toBe('object');
    expect(body.success).toBeFalsy();
    expect(body.message).toBe('Undefined parameters.');
    done();
  });

  test('error handling PUT /books:id', async done => {
    const idParam = bookRows[1]._id;
    const expectedResult = {
      title: 'Buku 3',
      ISBN: '9789446125447',
      authors: ['The Author'],
      publishing: { name: 'Pubilsher three' },
      year: 2018
    };
    jest
      .spyOn(Book, 'findByIdAndUpdate')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error update data' }));

    const response = await request.put('/books/' + idParam).send(expectedResult);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });

  test('DELETE - /books/:id - delete data', async done => {
    // get 2nd row ID
    const idParam = bookRows[1]._id;
    const response = await request.delete('/books/' + idParam);
    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(typeof body).toBe('object');
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Book deleted with success.');
    done();
  });

  test('error handling DELETE /books:id', async done => {
    const idParam = bookRows[0]._id;
    jest
      .spyOn(Book, 'findByIdAndRemove')
      .mockImplementationOnce(() => Promise.reject({ message: 'Model error delete data' }));

    const response = await request.delete('/books/' + idParam);
    const { body, statusCode } = response;

    expect(statusCode).toBe(500);
    expect(typeof body).toBe('object');
    expect(body.message).toBe('Oops something wrong');
    done();
  });
});
