const { UserIdentity, User } = require('../models')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");

class Controller {

    static home(req, res) {
        res.redirect('/home');
    }

    static registerForm(req, res) {
        let errors = req.query.errors
        res.render('register.ejs', { errors })
    }
    static loginForm(req, res) {
        let errors = req.query.errors
        res.render('login.ejs', { errors })
    }

    static postRegister(req, res) {
        // console.log(req.body);
        const { email, password, dateOfBirth, gender, firstName, lastName } = req.body
        User.create({
            email: email,
            password: password
        })
            .then(data => {
                // console.log(data);
                return UserIdentity.create({
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    UserId: data.id
                })
                    .then(data2 => {
                        console.log(email, 66666)
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'infokuliah21@gmail.com',
                                pass: 'vqihkuctcutxjoyc'
                            }
                        });

                        const mailOptions = {
                            from: 'infokuliah21@gmail.com',
                            to: email,
                            subject: 'Register',
                            text: 'Register success!'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.redirect('/login')
                    })
            })
            .catch(err => {
                let result = []
                if (err.name == "SequelizeValidationError") {
                    err.errors.forEach(x => {
                        result.push(x.message)
                    })
                    return res.redirect(`/register?errors=${result}`)
                } else {
                    res.send(err)
                    return res.redirect(`/register?errors=${result}`)
                }

            })
    }

    static cekLogin(req, res) {
        const { email, password } = req.body
        User.findOne({
            where: {
                email: email
            }
        })
            .then(user => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)
                    if (isValidPassword) {
                        // Case saat berhasil login
                        req.session.iduser = user.id //set session 
                        req.session.roleuser = user.role //set role
                        res.redirect('/home')
                    } else {
                        let errors = 'Invalid username/password'
                        return res.redirect(`/login?errors=${errors}`)

                    }
                } else {
                    let errors = 'Invalid username/password'
                    return res.redirect(`/login?errors=${errors}`)

                }
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    }


    static logOut(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/login')
            }
        })

    }

}
module.exports = Controller