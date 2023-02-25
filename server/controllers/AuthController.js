const userModel = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const dns = require("dns");
let privateKey = process.env.PRIVATE_KEY;

const transporter = nodemailer.createTransport({
  direct: true,
  host: "smtp.mail.ru",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true,
});

const authController = {
  register: (req, res) => {
    const { fullName, userName, email, password } = req.body;
    const domain = email.split("@")[1];
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        res.status(400).json({ message: "Invalid email domain" });
      } else {
        userModel.findOne({ email: email }, (err, userEmail) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "An error occurred while checking the email." });
          } else if (userEmail) {
            return res
              .status(400)
              .json({ message: "This email is already registered." });
          } else {
            userModel.findOne({ userName: userName }, (err, userUserName) => {
              if (err) {
                return res.status(500).json({
                  message: "An error occurred while checking the username.",
                });
              } else if (userUserName) {
                return res
                  .status(400)
                  .json({ message: "This username is already registered." });
              } else {
                bcrypt.hash(password, 10, (err, hash) => {
                  if (err) {
                    return res.status(500).json({
                      message: "An error occurred while hashing the password.",
                    });
                  } else {
                    const newUser = new userModel({
                      fullName: fullName,
                      userName: userName,
                      email: email,
                      password: hash,
                    });
                    newUser.save((err, doc) => {
                      if (err) {
                        return res.status(500).json({
                          message: "An error occurred while saving the user.",
                        });
                      } else {
                        return res
                          .status(201)
                          .json({ message: "User successfully registered." });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email }, (err, user) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if (result) {
          const confirmCode = Math.floor(Math.random() * 999999);
          user.confirmCode = confirmCode;
          user.save((saveErr, saveDoc) => {
            if (!saveErr) {
              res.json(saveDoc);
            } else {
              res.status(500).json(saveErr);
            }
          });
          const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Login Confirm Code",
            text: "Confirm Code: " + confirmCode,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }
          });
        } else {
          return res.status(404).json({ message: "Incorrect password" });
        }
      });
    });
  },
  confirmCode: (req, res) => {
    const { confirmCode, userId } = req.body;
    userModel.findOne(
      { confirmCode: confirmCode, _id: userId, isDeleted: false },
      (err, doc) => {
        if (!err) {
          if (doc) {
            const token = jwt.sign({ email: doc.email }, privateKey, {
              algorithm: "HS256",
              expiresIn: "5h",
            });
            res.json({ token: token });
          } else {
            res.status(404).json({ message: "not found" });
          }
        } else {
          res.status(500).json(err);
        }
      }
    );
  },
};

module.exports = {
  authController,
};
