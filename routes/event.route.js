const express = require('express');
const router  = express.Router();
const passport = require('passport');
// const mongoose = require('mongoose');
const Event = require('../models/Event.model');
const User = require('../models/User.model');



/* GET route - All events */
router.get("/events", (req, res) => {
  
  Event.find()
  .populate('owner')
  .exec(function (err, events) {
    if (err) console.log(err)
    console.log(events[events.length - 1].owner);
    res.render("musicEvents/events", {foundEvents: events.map(event => event.toJSON()) });
    
  });

  })
  

/* GET route- Adding new events */
router.get("/create-events", (req, res) =>{

  res.render("musicEvents/create-events")
}
);


/* POST route - add new event */
router.post("/create-events", (req, res) => {
  const { name, description, location, datum, genre } = req.body;
  console.log(req.session);
  console.log(req.user);
  Event.create({ name, description, location, datum, genre, owner: req.user['_id'] })
    .then((newEvent) => {
      
      newEvent.save().then(() => res.redirect("/events"));
    })
    .catch((err) => {
      console.error(`Error on create: ${err}`);
      res.render("/create-events");
    });
});


/* GET route- Specific event */
router.get("/events/:id", (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  Event.findById(id)
    .then((event) => {

      const eventIsOwnedByUser = req.user._id.toString() === event.owner

      res.render("musicEvents/events-details", {event, eventIsOwnedByUser } );
    })
    // Something for next goes here
    .catch((err) => console.log(`Error when try to get more information about the events: ${err}`));
});


// GET route - Update the event from Event-details page 
router.get('/events/:id/edit', (req, res) => {
  const { id } = req.params;
 
  Event.findById(id)
    .then(eventToEdit => {
      res.render('musicEvents/edit-events', eventToEdit);
    })
    .catch(error => console.log(`Error while getting an event for edit: ${error}`));
});

// POST route - Update the event from Event-details page 
router.post('/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, location, datum, genre } = req.body;
 
  Event.findByIdAndUpdate(id, { name, description, location, datum, genre  }, { new: true })
    .then((updatedEvent) => res.redirect('/events'))
    .catch(error => console.log(`Error while updating an event: ${error}`));
});


// POST route - Delete the event from Event-details page 
router.post("/events/:id/delete", (req, res, next) => {
  const { id } = req.params;

  Event.findByIdAndRemove(id)
    .then(() => res.redirect("/events"))
    .catch((err) => {
      next();
      console.log(`Error when deleting: ${err}`);
    });
});




// POST route - to join
router.post("/events/:id/join", (req, res, next) => {
  const { id } = req.params;

  Event.findById(id).then((event) => {
    console.log(event);
    User.findByIdAndUpdate(req.user._id, {$push: {"subscribedEvents": event }}, {safe: true, upsert: true}, (err, user) => 
    {console.log(user);
      res.redirect('/userProfile')})
  })
  
});


///////////////////////////////////////////////////////

module.exports = router;
