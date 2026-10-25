const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

function useMongoMemoryServer() {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map((collection) =>
        collection.deleteMany({})
      )
    );
  });

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } finally {
      if (mongoServer) {
        await mongoServer.stop();
      }
    }
  });
}

module.exports = useMongoMemoryServer;
