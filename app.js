// import required modules
// import models
// import routes
const express                 = require('express'),
      cors                    = require('cors'),
      passport                = require('passport'),
      User                    = require('./models/user'),
      indexRoutes             = require('./routes/index'),
      complaintRoutes         = require('./routes/complaint'),
      adminRoutes             = require('./routes/admin');

const app = express();

// Pass the global passport object into the configuration function
// initialize passport
require('./config/passport')(passport);
app.use(passport.initialize());

// other app configs
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

// require database
require('./config/database')

// use routes
app.use(indexRoutes);
app.use(complaintRoutes);
app.use(adminRoutes);

// Server listens on localhost:3000
// app.listen(3000, 'localhost', function() {
//     console.log("Server has started on port 3000")
// })
app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log("Server has started on port 3000")
})