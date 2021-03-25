const pg = require('pg');
const client = new pg.Client({
    CONNECTION_STRING: 
        'postgres://localhost:5432/graceshopper-dev',
});

module.exports = client;