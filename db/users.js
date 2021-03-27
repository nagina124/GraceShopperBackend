const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createUser({ username, email, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const {
      rows: [user],
    } = await client.query(`
            INSERT INTO users(username, email, password)
            VALUES($1, $2, $3) 
            ON CONFLICT (username) DO NOTHING
            RETURNING *;`,
      [username, email, hashedPassword]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const {rows} = await client.query(`
        SELECT * 
        FROM users;
    `)
    return rows;
  } catch(error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    // const user = await getUserByEmail(email)
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordsMatch) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(`
            SELECT * 
            FROM users 
            WHERE id=$1`,
      [id]
    );

    if (!user) {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(`
            SELECT * FROM users
            WHERE username=$1;`,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const {
      rows
    } = await client.query(`  
            SELECT * FROM users
            WHERE email=$1;`,
      [email]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
};
