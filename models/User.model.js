// const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
 
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    genre : {
      type: Array
    },
    profilePicture: {
      type: String
    },
    event:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
    ],
    subscribedEvents:[ 
      {
        type: Schema.Types.ObjectId,
        ref: 'Event'
      }
  ]
  },
  {
    timestamps: true
  }
);

userSchema.plugin(passportLocalMongoose);
 
module.exports = model('User', userSchema);


 

