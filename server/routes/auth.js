import express from "express";
import axios from "axios";

const router = express.Router();  // allows us to use routes in different file

// create '/login' endpoint:	http://localhost:1337/auth/login
// 'async' because requires api calls
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;  // get/deconstruct 'username' and 'password' from request body
    // api call to chat engine:
    const chatEngineResponse = await axios.get(
      "https://api.chatengine.io/users/me",
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": username,
          "User-Secret": password,
        },
      }
    );

    res.status(200).json({ response: chatEngineResponse.data });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

// create '/signup' endpoint:	http://localhost:1337/auth/signup
// 'async' because requires api calls
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;  // get/deconstruct 'username' and 'password' from request body

    const chatEngineResponse = await axios.post(
      "https://api.chatengine.io/users/",
      {
        username: username,
        secret: password,   // chat engine uses 'secret', rather than 'password'
      },
      {
        headers: { "Private-Key": process.env.PRIVATE_KEY },  // from .env
      }
    );

    res.status(200).json({ response: chatEngineResponse.data });
  } catch (error) {
    console.error("error", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
