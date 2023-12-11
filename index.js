const express= require('express');
const cors= require('cors');
const {connection} = require('./connection');
const { userRouter } = require('./Routes/user.routes');
const { postRouter } = require('./Routes/post.routes');


require('dotenv').config();

const app= express();

app.use(express.json());
app.use(cors());

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(process.env.PORT, async()=>{
    try {
        
       await connection;
       console.log("Server is started and connected to DB");
        
    }catch(error) {
       console.log("Index Error", error.message);
    }
});


