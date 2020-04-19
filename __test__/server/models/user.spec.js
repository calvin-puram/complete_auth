/**
 * @jest-environment node
 */

const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './.env' });
const Users = require('../../../models/Users');
const connectDB = require('../../../config/db');

describe('The Users Model', () => {
  it('should hash the password before saving to database', async () => {
    await connectDB();

    const user = {
      name: 'puram calvin',
      email: 'puram@gmail.com',
      password: '2begood4',
      passwordConfirm: '2begood4'
    };

    const currentUser = await Users.create(user);
    expect(bcrypt.compareSync(user.password, currentUser.password)).toBe(true);
  });
});