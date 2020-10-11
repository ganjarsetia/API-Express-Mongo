import mongoose from 'mongoose';
import config from '../config/config';

mongoose.set('useCreateIndex', true);
mongoose.promise = global.Promise;

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === 'ns not found') return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes('a background operation is currently running')) return;
      console.log(error.message);
    }
  }
}

export default function setupDB(databaseName) {
  // Connect to Mongoose
  beforeAll(async () => {
    const mongoUri = config.mongo.host_test;
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      server: { socketOptions: { keepAlive: 1 } }
    });
    mongoose.connection.on('error', () => {
      throw new Error(`unable to connect to database: ${mongoUri}`);
    });
  });

  // Uncomment if you need cleans up database between each test
  /* afterEach(async () => {
    await removeAllCollections()
  }); */

  // Disconnect Mongoose
  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
}

export const connectDB = async () => {
  const mongoUri = config.mongo.host_test;
  mongoose.Promise = global.Promise;
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    server: { socketOptions: { keepAlive: 1 } }
  });
  mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
  });
};

export const disconnectDB = async () => {
  await dropAllCollections();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};
