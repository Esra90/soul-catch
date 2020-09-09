const { Schema, model } = require('mongoose');
 
const eventSchema = new Schema(
  {
    name: {
      type: String,
      trim: true
      // required: [true, 'Name is required.']
    },
    description: {
      type: String
      // required: [true, 'Description is required.']
    },
    location: {
      type: String
      // required: [true, 'Location is required.']
    },
    eventPic: {
      type: String
    },
    datum: {
      type: Date,
      default: Date.now()
      // required: [true, 'Time is required.']
      // "format": "date-time" 
    },
    genre: {
      type: Array
    },
    owner:
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Event', eventSchema);
