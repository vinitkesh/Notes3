require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const User = require('./models/user.model');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');

const app = express();



const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');
const { error } = require('console');

app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.json({ data: 'Hello World' });
});

// Create Account -POST
////////////////////////////////////////////////////////////////////////////////////////////
app.post('/create-account', async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: true, message: 'All fields are required' });
    
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: 'user already exists ',
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '3600m', // Corrected typo
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: 'Account created successfully',
  });
});

/////////////////////////////////////////////////////////////////////////////////////
// LOGIN POST REQUEST 


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: true, message: 'All fields are required' });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ error: true, message: 'Invalid email or password' });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '3600m', // Corrected typo
    });

    return res.json({
      error: false,
      message: 'Login successful',
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: 'Invalid Credentials',
    });
  }
});

/////////////////////////////////////////////////////////////////////////

app.get("/get-user" , authenticateToken, async (req,res) => {
    const { user } = req.user;

    const isUser = await User.findOne({_id: user._id});

    if(!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName, 
            email: isUser.email , 
            "_id": isUser._id ,
            createdOn: isUser.createdOn
        },
        message : ""
    })



});

///////////////////////////////////////////////////////////////////////
// add note

app.post("/add-note" , authenticateToken, async(req,res) => {
    const{ title, content, tags } = req.body;
    const { user } = req.user;

    if(!title){
        return res.status(400).json({error: true, message: "Title is required"});
    }
    if(!content){
        return res.status(400).json({error: true, message: "Content is required"});
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Added sucessfully"
        });
    } catch (error) {
        return res.status(500).json({
            error:true,
            message: "Internal Server Error"
        });
    }
});
// Edit Note

app.put("/edit-note/:noteId" , authenticateToken, async(req,res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags && typeof isPinned === 'undefined') {
      return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
      if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
      }

      if (title) note.title = title;
      if (content) note.content = content;
      if (tags) note.tags = tags;
      if (typeof isPinned !== 'undefined') note.isPinned = isPinned; 

      await note.save();

      return res.json({
          error: false,
          note,
          message: "Note updated successfully",
      });
  } catch (error) {
      return res.status(500).json({
          error:true,
          message: "Internal Server Error"
      })
  }
});


// Get ALL Notes 
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
        error: false,
        notes,
        message: "All notes retrieved successfully",
    });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        
        });
    }

});

///////////////////////////////////////////////////////
// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });
        return res.json({
            error: false,
            message: "Note deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });

      if (!note) {
          return res.status(404).json({ error: true, message: "Note not found" });
      }

      // Check if isPinned is defined explicitly, since false is a valid value
      if (typeof isPinned !== 'undefined') note.isPinned = isPinned;
      
      await note.save();

      return res.json({
          error: false,
          note,
          message: "Note updated successfully",
      });
  } catch (error) {
      return res.status(500).json({
          error: true,
          message: "Internal Server Error",
      });
  }
});


app.get("/search-notes/", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { user } = req.user;

  if (!query) {
      return res.status(400).json({
          error: true,
          message: "Query is required",
      });
  }

  try {
      const sanitizedQuery = query.trim();  // Sanitize the query

      const matchingNotes = await Note.find({
          userId: user._id,
          $or: [
              { title: { $regex: new RegExp(sanitizedQuery, "i") } },
              { content: { $regex: new RegExp(sanitizedQuery, "i") } },
              { tags: { $regex: new RegExp(`\\b${sanitizedQuery}\\b`, "i") } },  // Improved tag search
          ],
      });

      return res.json({
          error: false,
          notes: matchingNotes,
          message: "Notes retrieved successfully",
      });

  } catch (error) {
      console.error(error);  // Log the actual error for debugging
      return res.status(500).json({
          error: true,
          message: "Internal Server Error",
      });
  }
});



/////////////////////////////////////////////

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running');
}
);

module.exports = app;
