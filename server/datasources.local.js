var MONGO_URL = process.env.MONGO_URL || null;
console.log(MONGO_URL);
if (MONGO_URL) {
  module.exports = {
    db: {
      name: 'db',
      connector: 'loopback-connector-mongodb',
      url: MONGO_URL
    }
  };
}
