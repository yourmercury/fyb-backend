const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectToMongo = require("./mogodb/connect");

dotenv.config();
const { AppointmentModel, UserModel } = require("./mogodb/models");
const sendMail = require("./mailer/node_mailer");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || "3200";

function initializeServer() {
  app.get("/appointment/:id", async (req, res) => {
    let id = req.params.id;

    // get all appointments from database
    try {
      let data = await AppointmentModel.findById(id);
      if (data.$isEmpty()) {
        res.status(404).end();
        return;
      } else {
        res.status(200).json({ ...data, _id: data.id, id: data.id });
      }
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  });

  app.get("/appointments/:type/:id", async (req, res) => {
    let id = req.params.id;
    let type = req.params.type;

    // get all appointments from database
    try {
      let data = await AppointmentModel.find({[type]: id});
      if (!data.length) {
        res.status(404).end();
        return;
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  });

  app.put("/make-appointment", async (req, res) => {
    let obj = req.body;

    console.log(obj)
    // send the object to the database
    try {
      let lecturer = await UserModel.findOne({
        id: obj.lecturerId,
        userType: 0,
      });
      let student = await UserModel.findOne({ id: obj.studentId, userType: 1 });
      if (!lecturer) {
        res.status(404).json({ exists: true });
        return;
      }
      let appointment = new AppointmentModel({
        ...obj,
      });
      await appointment.save();
      res.status(201).json(appointment);

      // send the subjects a mail.
      sendMail(
        obj.email,
        "Your appointment has been requested",
        "Make Appointment"
      );
      sendMail(
        lecturer.email,
        `You an appointment request from ${'eng1406868'}`,
        "Appointment Request"
      );
    } catch (error) {
      res.status(500).end();
      console.log(error);
    }
  });

  app.put("/update-appointment/:id", async (req, res) => {
    let obj = req.body;
    let id = req.params.id;

    try {
      //send the object to the database
      let appointment = await AppointmentModel.findById(id);
      let lecturer = await UserModel.findOne({
        userType: 0,
        id: appointment.lecturerId,
      });
      let student = await UserModel.findOne({
        userType: 1,
        id: appointment.studentId,
      });
      if (appointment.$isEmpty() || lecturer.$isEmpty() || student.$isEmpty()) {
        res.status(404).end();
        return;
      }

      appointment.title = title;
      appointment.body = obj.body;
      appointment.time = obj.time;
      await appointment.save();
      res.status(201).json(appointment);

      sendMail(
        student.email,
        "Your appointment has been requested",
        "Make Appointment"
      );
      sendMail(
        lecturer.email,
        `You updated an appointment request from ${student.id}`,
        "Appointment Request"
      );
    } catch (error) {
      res.status(500).end();
      console.log(error);
    }
  });

  app.put("/accept/:id", async (req, res) => {
    let obj = req.body;
    let id = req.params.id;
    let rej = obj.reject;
    try {
      let appointment = await AppointmentModel.findById(id);
      let lecturer = await UserModel.findOne({
        userType: 0,
        id: appointment.lecturerId,
      });
      let student = await UserModel.findOne({
        userType: 1,
        id: appointment.studentId,
      });
      if (!appointment || !lecturer) {
        res.status(404).end();
        return;
      }

      let pow = obj.userType == 0 ? 2 : 1;

      // if ((appointment.time != obj.time && appointment.status > 0) && !rej) {
      //   if (appointment.status == 1) {
      //     appointment.status = obj.status == 1 ? appointment.status : 0;
      //   } else if (appointment.status == 2) {
      //     appointment.status = obj.status == 1 ? 1 : 2;
      //   } else {
      //     appointment.status = obj.status == 1 ? 1 : 2;
      //   }
      // } else if (rej) {
      //   appointment.status - rej;
      // } 

      if(!rej){
        if(appointment.status == pow){
          
        }else if(appointment.status == 3){
          
        }else {
          appointment.status += pow;
        }
      }else {
        if(appointment.status == pow){
          appointment.status -= pow;
        }else if(appointment.status == 3){
          appointment.status -= pow;
        }else {
          
        }
      }

      appointment.time = obj.time;

      await appointment.save();
      res.status(201).json(appointment);

      // Mail the subject

      sendMail(student.email, `Appointment updated`, "Appointment update");

      sendMail(lecturer.email, `Appointment updated`, "Appointment update");
    } catch (error) {
      res.status(500).end();
      console.log(error);
    }
  });

  app.put("/admin-add-user", async (req, res) => {
    let obj = req.body;

    //add to database
    try {
      let x = await UserModel.findOne({ id: id });
      if (!x.$isEmpty()) {
        res.status(503).json({ exists: true });
        return;
      }

      let user = new UserModel({ ...obj });
      await user.save();
      res.status(201).json(user);

      //mail the subject
      sendMail(student.email, `Appointment updated`, "Appointment update");

      sendMail(lecturer.email, `Appointment updated`, "Appointment update");
    } catch (error) {
      res.status(500).end();
      console.log(error);
    }
  });

  app.get("/get-user/:type/:id", async (req, res) => {
    try {
      let id = req.params.id;
      let type = req.params.type;

      let user = await UserModel.findOne({ userType: type, id: id });

      if (!user) {
        res.status(404).end();
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).end();
      console.log(error);
    }
  });

  app.get("/get-users/:type", async (req, res) => {
    try {
      let type = req.params.type;

      let users = await UserModel.find({ userType: Number(type) });

      if (users.length) {
        res.status(200).json([]);
        return;
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).end();
      console.log(error);
    }
  });

  app.post("/login", async (req, res) => {
    let obj = req.body;
    // console.log(obj)
    try {
      let x = await UserModel.findOne({ id: obj.id, password: obj.password });
      if (!x) {
        res.status(404).json(x);
        return;
      }

      res.status(200).json(x);
    } catch (error) {
      res.status(500).end();
      console.log(error);
    }
  });

  app.listen(PORT, () => {
    console.log("listening @ port " + PORT);
  });
}

ConnectToMongo(initializeServer);
