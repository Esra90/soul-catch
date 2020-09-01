const { Schema, model } = require('mongoose');
 
const eventSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
    },
    description: {
      type: String
    },
    location: {
      type: String
    },
    eventPic: {
      type: String
    },
    datum: {
      type: String,
      "format": "date-time" 
    }

    // email: {
    //   type: String,
    //   required: [true, 'Email is required.'],
    //   unique: true,
    //   match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    //   lowercase: true,
    //   trim: true
    // },
    // passwordHash: {
    //   type: String,
    //   required: [true, 'Password is required.']
    // },
    // genre : {
    //   type: String
    // },
    // profilePicture: {
    //   type: String
    // }
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Event', eventSchema);
