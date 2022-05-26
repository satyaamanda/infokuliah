'use strict';
const fs = require("fs");
module.exports = {
  up(queryInterface, Sequelize) {

    const courses = JSON.parse(fs.readFileSync("./data/courses.json", "utf-8")).map(el => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    })
    return queryInterface.bulkInsert('Courses', courses, {});
  },

  down(queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Courses', null, {});
  }
};
