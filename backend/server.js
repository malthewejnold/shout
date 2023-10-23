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
    res.json({message: "Der er hul igennem!"})
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
            // TODO: FIX
            shouts = await Shout.find({}).sort('-createdAt').exec();
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

app.delete("/shout", async (req, res) => {
    let deleteID = req.body.deleteID;

    try {
        let deletedShout = await Shout.findByIdAndDelete(deleteID);
		
        if (deletedShout) {
            res.status(200).send({ message: 'Shout succesfully deleted', deletedShout });
        } else {
            res.status(404).send({ error: `No document found with ID: ${deleteID}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Server Error" });
    }
});

app.listen(PORT, () => console.log(`Listing on port: ${PORT}...`));