"use strict"
const { Op } = require("sequelize");
const { User, Course, User_Course, UserIdentity } = require("../models")
const convertToRupiah = require("../helpers/convertToRp");
const useridentity = require("../models/useridentity");
const nodemailer = require("nodemailer");

class HomeController {
    static home(req, res) {
        let id = req.session.iduser
        res.render("home", { id });
    }

    static courses(req, res) {


        let options = {
            where: {}
        }
        if (req.query.searchName) {
            options.where = {
                ...options.where,
                name: {
                    [Op.iLike]: `%${req.query.searchName}%`
                }
            }

        }
        if (req.query.searchDesc) {
            options.where = {
                ...options.where,
                description: {
                    [Op.iLike]: `%${req.query.searchDesc}%`
                }

            }
        }
        const role = req.session.roleuser;
        const userid = req.session.iduser;
        let purchased;
        let output;

        Course.findAll(options), {
            include: {
                model: User

            }
        }
        Course.findAll(options)
            .then(data => {
                output = data;
                return Course.findAll({
                    attributes: ["id"],
                    include: {
                        model: User,
                        where: {
                            id: userid
                        }
                    }
                })
            })
            .then((data) => {
                purchased = data
                return UserIdentity.findAll({
                    where: {
                        id: userid
                    }
                })
            })
            .then((useridentity) => {
                console.log(useridentity);
                res.render("kursus", { data: output, convertToRupiah, role, userid, purchased: purchased, useridentity });
            })
            .catch(err => {
                console.log(err, "eeee");
                res.render(err);
            })
    }

    static buy(req, res) {
        const CourseId = req.params.id
        User_Course.create({
            CourseId: +CourseId,
            UserId: req.session.iduser
        })
        // .then(data2 => {
        //     const transporter = nodemailer.createTransport({
        //         service: 'gmail',
        //         auth: {
        //             user: 'cepto6997@gmail.com',
        //             pass: 'fegi6997'
        //         }
        //     });
            
        //     const mailOptions = {
        //         from: 'cepto6997@gmail.com',
        //         to: email,
        //         subject: 'buy',
        //         text: 'buy success!'
        //     };
            
        //     transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        //     });
        //     res.redirect('/home/courses')
        // })
            .then(() => {
                res.redirect("/home/courses")
            })
            .catch((err) => {
                res.render(err);
            })
    }


    static addCourse(req, res) {
        let errors = req.query.errors
        res.render("addPage", { errors });
    }

    static addToDB(req, res) {
        const body = req.body;
        const { name, imageURL, description, price } = body
        console.log(body);
        Course.create({
            name: name,
            imageURL: imageURL,
            description: description,
            price: +price
        })
            .then(() => {
                res.redirect("/home/courses")
            })
            .catch((err) => {
                let result = []
                if (err.name == "SequelizeValidationError") {
                    err.errors.forEach(x => {
                        result.push(x.message)
                    })
                    return res.redirect(`/home/courses/add?errors=${result}`)
                } else {
                    res.send(err)

                }
            })
    }

    static editPage(req, res) {
        const id = req.params.id
        Course.findAll({
            where: { id: +id }
        })
            .then((data) => {
                let errors = req.query.errors
                res.render("editPage", { data, errors })
            })
            .catch((err) => {
                res.render(err);
            })
    }

    static editData(req, res) {
        const body = req.body;
        const { name, imageURL, description, price } = body
        console.log(body);
        Course.update({
            name: name,
            imageURL: imageURL,
            description: description,
            price: +price
        },
            {
                where: {
                    id: +req.params.id
                }
            })
            .then(() => {
                res.redirect("/home/courses")
            })
            .catch((err) => {
                let result = []
                if (err.name == "SequelizeValidationError") {
                    err.errors.forEach(x => {
                        result.push(x.message)
                    })
                    return res.redirect(`/home/courses/edit/${req.params.id}?errors=${result}`)
                } else {
                    res.send(err)

                }
            })
    }

    static mycourses(req, res) {
        let options = {
            where: {}
        }
        if (req.query.searchName) {
            options.where = {
                ...options.where,
                name: {
                    [Op.iLike]: `%${req.query.searchName}%`
                }
            }

        }
        if (req.query.searchDesc) {
            options.where = {
                ...options.where,
                description: {
                    [Op.iLike]: `%${req.query.searchDesc}%`
                }

            }
        }
        const role = req.session.roleuser;
        const userid = req.session.iduser;
        let purchased;
        let output;

        Course.findAll(options), {
            include: {
                model: User
            }
        }
        Course.findAll(options)
            .then(data => {
                output = data;
                return Course.findAll({
                    attributes: ["id"],
                    include: {
                        model: User,
                        where: {
                            id: userid,
                        }
                    }
                })
            })
            .then((data) => {
                purchased = data
                return UserIdentity.findAll({
                    where: {
                        id: userid
                    }
                })
            })
            .then((useridentity) => {
                console.log(useridentity);
                res.render("mykursus", { data: output, convertToRupiah, role, userid, purchased: purchased, useridentity });
            })
            .catch(err => {
                console.log(err, "eeee");
                res.render(err);
            })
    }

    static detailkursus(req, res) {
        let options = {
            where: {}
        }
        if (req.query.searchName) {
            options.where = {
                ...options.where,
                name: {
                    [Op.iLike]: `%${req.query.searchName}%`
                }
            }

        }
        if (req.query.searchDesc) {
            options.where = {
                ...options.where,
                description: {
                    [Op.iLike]: `%${req.query.searchDesc}%`
                }

            }
        }
        const role = req.session.roleuser;
        const userid = req.session.iduser;
        let purchased;
        let output;

        Course.findAll(options), {
            include: {
                model: User
            }
        }
        Course.findAll(options)
            .then(data => {
                output = data;
                return Course.findAll({
                    attributes: ["id"],
                    include: {
                        model: User,
                        where: {
                            id: userid,
                        }
                    }
                })
            })
            .then((data) => {
                purchased = data
                return UserIdentity.findAll({
                    where: {
                        id: userid
                    }
                })
            })
            .then((useridentity) => {
                console.log(useridentity);
                res.render("detailkursus", { data: output, convertToRupiah, role, userid, purchased: purchased, useridentity });
            })
            .catch(err => {
                console.log(err,);
                res.render(err);
            })
    }

    static succes(req, res) {
        const CourseId = req.params.id
        User_Course.create({
            CourseId: +CourseId,
            UserId: req.session.iduser
        })
            .then(() => {
                res.redirect("/home/detailkursus")
            })
            .catch((err) => {
                res.render(err);
            })
    }

    static testimoni(req, res) {
        // let id = req.session.iduser
        res.render("testimoni");
    }

    static delete(req, res) {
        const CourseId = req.params.id
        Course.deleteCourse(CourseId)
            .then(() => res.redirect("/home/courses"))
            .catch(err => {
                res.render(err);
            })
    }
}

module.exports = HomeController