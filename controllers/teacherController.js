const Teacher = require("../models/teacherModel");

const teacherController = {
    createTable: async(req,res)=>{
        try{
            await Teacher.createTable();
            res.send("Created Successfully!");
        }
        catch(err)
        {
            console.error(err);
            res.status(500).send("Error Creating table");
        }
    },

    addTeacher:async(req,res)=>{
        try{
            const {t_id,t_name} = req.body;
            const id_res = await Teacher.addTeacher(t_id,t_name);
            res.send(`Teacher added successfully with ID: ${id_res}`);
        }
        catch(err)
        {
            console.error(err);
            res.status(500).send("Error adding teacher");
        }
    },

    getTeacher:async(req,res)=>{
        try{
            const teachers = await Teacher.getAllTeachers();
            res.json(teachers);
        }
        catch(err)
        {
            console.error(err);
            res.status(500).send("Error fetching teacher");
        }
    }
};

module.exports = teacherController;