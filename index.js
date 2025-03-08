import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
let posts = []; // To store user created posts

app.get("/",(req,res)=>{
    res.render("index",{posts})
});
app.get("/about",(req,res)=>{
    res.render("about")
});
app.get("/post",(req,res)=>{
    res.render("post")
});
app.post("/",(req,res)=>{
    const postData = {
        title :req.body.title,
        accessCode : req.body.accessCode,
        author: req.body.author,
        content : req.body.content,
        date: new Date().toLocaleDateString("en-MM", { month: "long", day: "numeric", year: "numeric" }), // Save formatted date
        postId: posts.length
    }
    console.log("type is " +typeof(postData.postId));
    const exitstingpostIndex = posts.findIndex(p=> p.postId === postData.postId);
    console.log("postdata of id is "+ postData.postId);
    console.log("posts length is "+ posts.length);
    console.log("existing index is "+ exitstingpostIndex);
    if(exitstingpostIndex !== -1){
        posts[exitstingpostIndex] = postData;
        console.log("post updated!",postData.postId);
    }else{
        posts.push(postData);
        console.log("New post added:", postData.postId);

    }
    
    res.render("index",{posts});
});
app.get("/posts/:id",(req,res)=>{
    const postId = parseInt(req.params.id);
    console.log("type of param post id is " + typeof(postId));
    const post = posts.find(p =>p.postId === postId);
    console.log("req.params is for posts/:id " + req.params.id);
    if(post){
        res.render("content",{post});
    }else {
        return res.status(404).send("Post not found");


    }
});
app.get("/delete_access/:postId", (req, res) => {
    const postId = req.params.postId;
    const post = posts.find(p => p.postId == postId); // Find the post by ID

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("delete_access", { post }); // Pass the post object to the template
});

app.post("/delete_access/:id", (req, res) => {
    const accessid = parseInt(req.params.id);
    const deleteIndex = posts.findIndex(p => p.postId === accessid);

    if (deleteIndex === -1) {
        return res.status(404).send("Post not found.");
    }

    const accessCode = req.body.accessCode;
    const postAccessCode = posts[deleteIndex].accessCode;
   console.log(deleteIndex);
    console.log("User entered access code:", accessCode);
    console.log("Stored access code:", postAccessCode);

    if (accessCode === postAccessCode) {
        posts.splice(deleteIndex, 1);
        console.log("Post deleted successfully.");
        res.redirect("/");
    } else {
        console.log("Access code is incorrect.");
        res.redirect(`/delete_access/${accessid }`)
    }
});


app.get("/edit_access/:id",(req,res)=>{
    const postId = parseInt(req.params.id);
    const post = posts.find(post => post.postId === postId);
    if(post){
        res.render("edit_access",{post});
    }else{
        return res.status(404).send("Post NOt found!");
    }
});
app.post("/edit_access/:id",(req,res)=>{
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.postId === postId);
    const editIndex = posts.findIndex(post => postId === post.postId);
    if(!post){
        return res.status(404).send("Post not found!");
    }
    const accessCode = posts[editIndex].accessCode;
    const fillAccessCode = req.body.accessCode;
    if(accessCode === fillAccessCode){
        res.render("edit",{post})
    }else{
        res.render("edit_access",{post})
    }
});
app.post("/posts/:id",(req,res)=>{
    const postId = parseInt(req.params.id);
    const post = posts.find(p=> p.postId === postId);
    if(post){
        post.title = req.body.title;
        post.accessCode = req.body.accessCode;
        post.author = req.body.author;
        post.content = req.body.content;
        console.log("changed are "+ post);
        res.render("content",{post})
    }else{
        return res.status(404).send("Pages not found!");
    }
})
app.listen(port,(req,res)=>{
    console.log("Server is running!");
});