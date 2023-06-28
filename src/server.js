import express, { response } from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json()); //Parse json req body

app.post('/hello', (req, res)=>{
    // console.log(request.body);
    res.send(`Hello ${req.body.name}!`);
});

app.get('/api/articles/:name', async (req, res) => {
    const {name} = req.params;
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('my-blog-db');
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
   
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('my-blog-db');
    await db.collection('articles').updateOne({name}, 
        {$inc: {'upvotes': 1}});

    const article = await db.collection('articles').findOne({name});

    if (article)
    {
        article.upvotes += 1;
        res.send(`The article ${name} has ${article.upvotes} upvotes!`);
    }
    else
    {
        res.send(`Article ${name} does not exist!`);
    }
});

app.post('/api/articles/:name/comments', (req, res) => {
    const {author, comment} = req.body;
    const { name } = req.params;
    const article = articles.find(a => a.name == name);

    if (article)
    {
        article.comments.push({author, comment});
        res.send(article.comments);
    }
    else
    {
        res.send(`Article ${name} does not exist!`);
    }
});

app.listen(8000, ()=>{
    console.log('Server is listening on port 8000');
});
