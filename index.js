import express from 'express';
import cors from 'cors'
import mongoConnect from './config/mongodb.config.js';

import todoRoute from './routes/todo.route.js'

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 6972;

mongoConnect()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/', todoRoute)

app.listen(port, () => {
    console.log(`ATDO server running at port : ${port}`);
});