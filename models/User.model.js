const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Your name is required'],
      trim: true
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      required: [true, 'Please enter an email'],
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      // match: [/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, 'Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.']
    },
    imageUrl: String,
    panes: [{ type: Schema.Types.ObjectId, ref: "Pan" }]
  }, 
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
