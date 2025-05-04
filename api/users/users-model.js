const db = require('../../data/dbConfig');

function findBy(filter) {
    return db('users').where(filter);
}

function add(user) {
    return db('users')
      .insert(user)
      .then(([id]) => {
        return db('users').where('id', id).first()
      })
}

module.exports = {
    findBy,
    add
}