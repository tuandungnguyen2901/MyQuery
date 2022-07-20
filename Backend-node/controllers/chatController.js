const { connect } = require("getstream");
const StreamChat = require("stream-chat").StreamChat;

require("dotenv").config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const createUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const serverClient = connect(api_key, api_secret, app_id);

    const chatToken = serverClient.createUserToken(userId);

    res.status(200).json({ chatToken, userId });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};

const getUser = async (req, res) => {
  try {
    const { username } = req.body;

    const serverClient = connect(api_key, api_secret, app_id);
    const client = StreamChat.getInstance(api_key, api_secret);

    const { users } = await client.queryUsers({ name: username });

    if (!users.length)
      return res.status(400).json({ message: "User not found" });

    const chatToken = serverClient.createUserToken(users[0].id);
    
    res.status(200).json({
      chatToken,
      user: users[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};

module.exports = { createUser, getUser };
