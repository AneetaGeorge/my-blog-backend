import express from 'express';
import {db, connect} from './db.js';

const app = express();
app.use(express.json()); //Parse json req body

app.post('/hello', (req, res)=>{
    res.send(`Hello ${req.body.name}!`);
});

app.get('/api/articles/:name', async (req, res) => {
    const {name} = req.params;
    const article = await db.collection('articles').findOne({name});

    if (article)
    {
        res.json(article);
    }
    else
    {
        res.sendStatus(404);
    }
});

app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params;

    await db.collection('articles').updateOne({name}, 
        {$inc: {'upvotes': 1}});

    const article = await db.collection('articles').findOne({name});

    if (article)
    {
        res.send(`The article ${name} has ${article.upvotes} upvotes!`);
    }
    else
    {
        res.send(`Article ${name} does not exist!`);
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const {author, comment} = req.body;
    const { name } = req.params;

    await db.collection('articles').updateOne({name}, 
        {$push: {comments: {author, comment}}});

    const article = await db.collection('articles').findOne({name});

    if (article)
    {
        res.json(article.comments);
    }
    else
    {
        res.send(`Article ${name} does not exist!`);
    }
});

connect( () => {
    app.listen(8000, ()=>{
        console.log('Server is listening on port 8000');
});
});
