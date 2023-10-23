const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// DB conn
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
    );

// DB schema
const shoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [String]
}, {timestamps: true})

const Shout = mongoose.model("shout", shoutSchema)

// Helper function
function isValidShout(body) {
    return (body.name && body.name.trim() != "" && body.content && body.content.trim() != "")
}

function tagParser(text) {
    return text.match(/#([a-z0-9]{1,30})/gi);
}

app.get("/", (req, res) => {
    res.json({message: "Hello"})
});

app.get("/shout", async (req, res) => {
    let tag = req.query.tags ? "#" + req.query.tags : undefined;
    let name = req.query.name;
    let shouts;

    try {
        if (tag) {
            shouts = await Shout.find({tags: tag}).exec();
        } else if (name) {
            shouts = await Shout.find({name: name}).exec();
        } else {
            shouts = await Shout.find({}).exec();
        }
    
        res.json({shouts, count: shouts.length});
    } catch(e) {
        res.json({e});
    }

})

app.post("/shout", async (req, res) => {
    if (isValidShout(req.body)) {
        let name = req.body.name.toString();
        let content = req.body.content.toString();
        let tags = tagParser(content);
        try {
            let shout = await Shout.create({
                name,
                content,
                tags
            });
            res.json(shout);
        } catch(e) {
            res.json({e})
        }
    } else {
        res.status(400);
        res.json({message: "Invalid shout"});
    }
});

app.delete("/shout", async(req, res) => {
    let deleteID = req.body.deleteID.toString()

    res.message(deleteID)

    blogSchema.findByIdAndDelete(deleteID, function (err, docs) {
        if (!err){
            console.log( docs);
        }
        else{
            console.log(err);
        }
     });

});

app.listen(PORT, () => console.log(`Listing on port: ${PORT}...`));