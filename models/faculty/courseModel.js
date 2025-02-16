const db= require('../../db/db');

const getCourses = async()=>
{
    const query ="SELECT * from Course";
    const [results] = await db.query(query);
    return results;
};

module.exports={getCourses};