var express = require('express');
var router = express.Router();

var { sequelize, setupDatabase, User, Note, getTableNames } = require('../databaseService'); // Import the sequelize instance
const Sequelize = require('sequelize');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/db-manipulator/database-info', async (req, res, next) => {
  const databaseName = await sequelize.getDatabaseName();
  const tables = await getTableNames();

  res.send({name: databaseName, tables: tables}).status(200);
})

router.get('/db-manipulator/:table', async (req, res, next) => {
  const tableName = req.params.table;
  let model;

  switch (tableName) {
    case 'Users':
      model = User;
      break;
    case 'Notes':
      model = Note;
      break;
    default:
      return res.status(404).send('Table not found');
  }

  try {
    const data = await model.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal server error');
  }
})

router.patch('/db-manipulator/query', async (req, res, next) => {
  try {
    const query = req.body.query;
    console.log(query);

    const result = await sequelize.query(query);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error executing query:', error);
    if (error instanceof Sequelize.Error) {
      const errorMessage = error.message || 'An error occurred while executing the query.';
      return res.status(500).json({ error: errorMessage });
    } else {
      return res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
  }
});


router.delete('/db-manipulator/delete/content', async (req, res, next) => {
  const tableName = req.body.table;
  const ids = req.body.items;

  console.log(req.body)

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send('Invalid or empty IDs');
  }

  console.log(tableName)

  let model;

  switch (tableName) {
    case 'Users':
      model = User;
      break;
    case 'Notes':
      model = Note;
      break;
    default:
      return res.status(404).send('Table not found');
  }

  try {
    await model.destroy({
      where: {
        id: ids,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting records:', error);
    return res.status(500).send('Internal server error');
  }
})

router.post('/db-manipulator/insert/content', async (req, res, next) => {
  const tableName = req.body.table;
  const data = req.body.data;

  if (!data || !tableName) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  let model;

  switch (tableName) {
    case 'Users':
      model = User;
      break;
    case 'Notes':
      model = Note;
      break;
    default:
      return res.status(404).json({ error: 'Table not found' });
  }

  try {
    const newRecord = await model.create(data);
    return res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error inserting record:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/db-manipulator/update/content', async (req, res, next) => {
  const tableName = req.body.table;
  const data = req.body.data;

  if (!data || !tableName) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  let model;

  switch (tableName) {
    case 'Users':
      model = User;
      break;
    case 'Notes':
      model = Note;
      break;
    default:
      return res.status(404).json({ error: 'Table not found' });
  }

  try {
    if (!data.id) {
      return res.status(400).json({ error: 'Missing "id" field in data' });
    }

    const id = data.id;
    delete data.id;

    const [updatedRowsCount, updatedRows] = await model.update(data, {
      where: { id },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const updatedRecord = updatedRows[0].get();

    return res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating record:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
