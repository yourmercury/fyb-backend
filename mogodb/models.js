const { model, Schema } = require("mongoose");

const UserModel = model(
  "user",
  new Schema(
    {
      firstName: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
      },

      lastName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true
      },

      id: {
        type: String,
        required: true,
      },

      userType: {
        type: Number,
        default: 0
      },

      courses: {
        type: [String],
        default: [],
      },
    },
    { timestamps: true }
  )
);

const AppointmentModel = model(
  "appointment",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },

      body: {
        type: String,
        required: true,
      },

      lecturerId: {
        type: String,
        required: true,
      },

      studentId: {
        type: String,
        required: true,
      },

      time: {
        type: Date,
        required: true
      },

      status: {
        type: Number,
        default: 0,
      },

    },
    { timestamps: true }
  )
);


module.exports = {UserModel, AppointmentModel};