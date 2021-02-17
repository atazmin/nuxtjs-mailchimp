import express from 'express';
import Mailchimp from 'mailchimp-api-v3';

const API_KEY = process.env.MAILCHIMP_API_KEY || '124e31162f9699b2d99f27dd2c3d3325-us7'
const AUDIENCE_ID = process.env.MAILCHIMP_LIST_ID || 'fb2441aba0';
const mailchimp = new Mailchimp(API_KEY);

const app = express();
app.use(express.json());

app.post('/subscribe', async(req, res) => {
  const { email: email_address } = req.body

  try {
    const response = await mailchimp.request({
      method: 'post',
      path: `/lists/${AUDIENCE_ID}/members`,
      body: {
        email_address,
        status: "subscribed"
      }
    })
    res.status(response.statusCode).json(response.status);
  } catch(error) {
    res.status(error.status).send(error)
  }
})

module.exports = app
