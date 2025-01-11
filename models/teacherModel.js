const db = require("../db/db");  // to create object for database

const Teacher = {
    createTable: async ()=>{
        const query = 'CREATE TABLE IF NOT EXISTS teachers(t_id INT AUTO_INCREMENT PRIMARY KEY,t_name VARCHAR(255) NOT NULL);';
        await db.query(query);
    },

    addTeacher:async(t_id,t_name)=>{
        const query = "INSERT INTO teachers VALUES(?,?)";
        const [result] = await db.query(query,[t_id,t_name]);
        return result.insertID;
    },

    getAllTeachers: async () => {
        const query = `SELECT * FROM teachers`;
        const [rows] = await db.query(query);
        return rows;
      },
};

module.exports = Teacher;