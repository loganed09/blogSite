const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

const homeStartingContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
const aboutContent = 'Nulla aliquet enim tortor at auctor urna. Elementum nibh tellus molestie nunc. Elit pellentesque habitant morbi tristique senectus et. Vitae auctor eu augue ut lectus arcu bibendum at. Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna. Sed enim ut sem viverra aliquet. Mi proin sed libero enim sed faucibus turpis in. Metus dictum at tempor commodo ullamcorper. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. At risus viverra adipiscing at in tellus integer feugiat scelerisque. Massa enim nec dui nunc mattis enim ut tellus elementum. Faucibus turpis in eu mi bibendum. Odio ut sem nulla pharetra diam.';
const contactContent = 'Feugiat nisl pretium fusce id velit ut tortor pretium. Est ullamcorper eget nulla facilisi etiam. Nam libero justo laoreet sit amet cursus sit amet dictum. Lacinia at quis risus sed vulputate odio. Posuere urna nec tincidunt praesent semper feugiat. Non enim praesent elementum facilisis leo. Porttitor lacus luctus accumsan tortor posuere ac ut. Aliquet eget sit amet tellus cras adipiscing. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Nec feugiat in fermentum posuere urna nec tincidunt. Vitae nunc sed velit dignissim sodales ut eu. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Ac turpis egestas integer eget aliquet nibh praesent tristique magna. Massa vitae tortor condimentum lacinia quis vel eros donec ac. Fermentum posuere urna nec tincidunt praesent. Pellentesque habitant morbi tristique senectus. Id interdum velit laoreet id donec.';


//const posts = [];


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/blogTutorial', {useNewUrlParser: true})

const postSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: [true, 'You need a title']
    },
    content: {
        type: String,
        required: [true, 'You need content']
    }
});

const Post = mongoose.model('Post', postSchema)


app.get('/', (req, res) => {
    Post.find({}).then((foundPosts) => {
        res.render('home', {
            homeStartingContent: homeStartingContent,
            posts :  foundPosts})
    })
} )

app.get('/about', (req, res) => {
    res.render('about', {aboutContent: aboutContent})
})

app.get('/contact', (req, res) => {
    res.render('contact', {contactContent: contactContent})
})

app.get('/compose', (req, res) => {
    res.render('compose')
})

app.post('/compose', (req, res) => {
    const post = new Post ({
        title: req.body.postTitle,
        content: req.body.postContent
    });

    post.save().then(() => {res.redirect('/')}).catch(err=>{console.log(err)});
})

app.get('/posts/:postId', (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postName);
    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}).then((post) => {
        res.render("post", {title: post.title, content: post.content})
    }).catch(err=>{console.log(err)});
    // posts.forEach( post => {
    //     const storedTitle = post.title;
    //     const storedContent = post.content

    //     if (_.lowerCase(storedTitle) === requestedTitle) {
    //         res.render('post', {postTitle: storedTitle, postContent: storedContent})
    //     }
    // })
   
})




app.listen(3000, () => {
    console.log('Server started on port 3000');
});



