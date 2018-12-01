'use strict';
'use strict';
  exports.PORT = process.env.PORT || 8080;
  exports.CLIENT_ORIGIN =process.env.CLIENT_ORIGIN || 'http://localhost:3000';
  exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://dev:dev321@ds115244.mlab.com:15244/xling-test';
  exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://dev:dev321@ds115244.mlab.com:15244/xling-test';
  exports.JWT_SECRET = process.env.JWT_SECRET || 'SHECRET';
  exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
  
  
        // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
