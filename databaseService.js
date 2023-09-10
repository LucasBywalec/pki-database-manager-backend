const Sequelize = require('sequelize');

// Create a sequelize instance with your database configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'db.ixghzqwplkpfzcgxvcpc.supabase.co',
  port: 5432,
  username: 'postgres',
  password: 'zaq1@WSXxsw2!QAZ',
  database: 'postgres',
});

// Define your models (User and Note) using the sequelize instance
const { DataTypes } = Sequelize;

const User = sequelize.define('Users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
});

const Note = sequelize.define('Notes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
  userId: Sequelize.INTEGER,
});

// Define the association between User and Note
User.hasMany(Note, { foreignKey: 'userId' });
Note.belongsTo(User, { foreignKey: 'userId' });

// Automatically create the tables if they don't exist.
sequelize.sync({force: true});

async function setupDatabase() {
  try {
    await sequelize.authenticate();

    await sequelize.sync({force: true})
    .then(() => {
      console.log('Tables created successfully.');
    })
    .catch((error) => {
      console.error('Error creating tables:', error);
    });

    const user1 = await User.create({
      password: 'user1',
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });

    const user2 = await User.create({
      password: 'user2',
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
    });

    const user3 = await User.create({
      password: 'user3',
      email: 'user3@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
    });

    const user4 = await User.create({
      password: 'user4',
      email: 'user4@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
    });

    const user5 = await User.create({
      password: 'user5',
      email: 'user5@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
    });

    await Note.create({
      title: 'Note 1',
      content: 'Content for Note 1',
      userId: user1.id,
    });

    await Note.create({
      title: 'Note 2',
      content: 'Content for Note 2',
      userId: user1.id,
    });

    await Note.create({
      title: 'Note 3',
      content: 'Content for Note 3',
      userId: user2.id,
    });

    await Note.create({
      title: 'Note 4',
      content: 'Content for Note 3',
      userId: user4.id,
    });

    await Note.create({
      title: 'Note 5',
      content: 'Content for Note 3',
      userId: user3.id,
    });

    console.log('Example data has been inserted.');

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

async function getTableNames() {
  try {
    const tableNames = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `, {
      type: sequelize.QueryTypes.SELECT,
    });

    // Extract table names from the query result
    const tableNamesArray = tableNames.map((row) => row.table_name);

    return tableNamesArray;
  } catch (error) {
    throw new Error('Error getting table names: ' + error.message);
  }
}

// Export your models and the sequelize instance
module.exports = {
  User,
  Note,
  sequelize,
  setupDatabase,
  getTableNames
};
