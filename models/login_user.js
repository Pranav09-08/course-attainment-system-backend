const db = require("../db/db");

const Login={
    
    // to get the user by id
    findByEmail:async (email)=>{
        const query = "Select * FROM teachers WHERE email = ?"; //query to get user
        const [rows] = await db.query(query,[email]);
        return rows[0]; // return the first matching user
    }
};

module.exports = Login;