import express, { response } from 'express';

const app = express();
app.use(express.json()); //Parse json req body

let articles = [{
    "name": "learn-react",
    "upvotes": 0,
    "comments": []
},{
    "name": "learn-node",
    "upvotes": 0,
    "comments": []
},{
    "name": "mongodb",
    "upvotes": 0,
    "comments": []
},]


app.post('/hello', (req, res)=>{
    // console.log(request.body);
    res.send(`Hello ${req.body.name}!`);
});

app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params;
    const article = articles.find(a => a.name == name);

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
