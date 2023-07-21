import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();
const router = express.Router();  // allows us to use routes in different file

// create '/text' endpoint:	http://localhost:1337/openai/text
// 'async' because requires api calls
router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;  // get 'text' and 'activeChatId' from request body
    // from openai documentation:
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text, // passed-in as prop
      temperature: 0.5, // higher values = more random; lower = more focused
      max_tokens: 2048, // how verbose the response can be
      top_p: 1, // default (similar to 'temperature' - should only alter one or the other)
      frequency_penalty: 0.5, // model's likelihood to repeat the same line
      presence_penalty: 0,  // model's likelihood to talk about new topics
    });

    // make api call:
    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].text },  // 'response' from above (openai call)
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

// route for code generation/correction:
// pretty much the same as above
router.post("/code", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const response = await openai.createCompletion({
      model: "code-davinci-002",  // different model
      prompt: text,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].text },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error("error", error.response.data.error);  // console log errors
    res.status(500).json({ error: error.message }); // return status 500 with error message in json format
  }
});

// route for input prompt completion/suggestion:
router.post("/assist", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Finish my thought: ${text}`, // tell openai 'finish my thought'
      temperature: 0.5,
      max_tokens: 1024, // don't need as many tokens since short response
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    // OMITTED = post to chatbot server; since we don't want request/response in chat window

    res.status(200).json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
