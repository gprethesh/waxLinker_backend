const passport = require("passport");
const Twitter = require("twitter-api-client");
const { Api, JsonRpc, RpcError } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig"); // development only
let fetch;
import("node-fetch").then((module) => {
  fetch = module.default;
});
const { TextEncoder, TextDecoder } = require("util");

exports.authenticateTwitter = async (req, res, next) => {
  try {
    const actor = req.query.actor;
    res.cookie("actor", actor, { signed: true });
    await passport.authenticate("twitter")(req, res, next);
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    res.status(500).json({
      status: "error",
      message: `An error occurred: ${error}`,
    });
  }
};

exports.twitterCallback = async (req, res) => {
  try {
    console.log("Session data:", req.session);
    console.log("Request query data:", req.query);

    const actor = req.signedCookies.actor;
    const user_id = actor;

    console.log(`user_id`, user_id);

    // Create Twitter API client
    const twitterClient = new Twitter.TwitterClient({
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken: req.user.twitter_token,
      accessTokenSecret: req.user.twitter_tokenSecret,
    });

    // Retrieve user's Twitter username
    const response = await twitterClient.accountsAndUsers.accountSettings();
    const twitterUsername = response.screen_name;

    // Setup EOSJS
    const privateKeys = [process.env.EOS_PRIVATE_KEY];
    const signatureProvider = new JsSignatureProvider(privateKeys);
    const rpc = new JsonRpc(process.env.BLOCKCHAIN_URL, { fetch });
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });

    // Prepare and send the transaction
    const twitterId = twitterUsername;

    const result = await api.transact(
      {
        actions: [
          {
            account: process.env.BLOCKCHAIN_WAXLINKER,
            name: "addinfo",
            authorization: [
              {
                actor: process.env.BLOCKCHAIN_WAXLINKER,
                permission: "active",
              },
            ],
            data: {
              user_id,
              twitterId,
            },
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );

    const successMessage = encodeURIComponent(
      "Successfully linked Wax Wallet with Twitter account."
    );
    res.redirect(
      `/?success=${successMessage}&twitterUsername=${twitterUsername}&transactionId=${result.transaction_id}`
    );

    // res.status(200).json({
    //   status: "success", // Fixed the string 'success'
    //   twitterUsername: twitterUsername,
    //   result: result.transaction_id,
    // });
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    // res.status(500).json({
    //   status: "error",
    //   message: `An error occurred: ${error}`,
    // });

    const encodedError = encodeURIComponent(
      `An error occurred: ${error.message}`
    );
    res.redirect(`/?error=${encodedError}`);
  }
};
