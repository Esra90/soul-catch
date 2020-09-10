// const mongoose = require('mongoose');
// const Event = require('../models/Event.model');

// require('../configs/db.config');

// const events= [
//   {
//       name: 'Deneme',
//       description: 'Lets meet up!',
//       location: 'Eindhoven',
//       eventPic: '',
//       datum:'10.09.2020',
//       genre:'funk'

//   }
// ];


// Event.create(events)
// .then(dbEvents => {
//   console.log(`Created ${dbEvents.length} events`);
//   mongoose.connection.close();
// })
// .catch(err =>
//   console.log(`An error occurred while creating events in the db ${err}`));