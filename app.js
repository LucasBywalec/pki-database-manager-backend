var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var { sequelize, setupDatabase, User, Note, getTableNames } = require('./databaseService'); // Import the sequelize instance

var indexRouter = require('./routes/index')

var app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:5173', 
};
app.use(cors(corsOptions));
// Middleware and routes setup here...

// Start your application after database setup
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({force: true})
    await setupDatabase();

    const data1 = await sequelize.getDatabaseName(); // Use sequelize.getDatabaseName() directly
    const data2 = await getTableNames(); // Use sequelize.showAllSchemas() directly
    const data3 = await User.findAll();
    const data4 = await Note.findAll();

    console.log(`Database name: \n ${data1}\n\n---------------------,
    \nAll Schemas:\n ${data2}\n\n ---------------------------- \n
    , Users: \n ${data3}, Notes: \n ${data4}`);
    console.log('Example data has been inserted.');
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
