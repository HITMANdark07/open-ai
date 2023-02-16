import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await openai.createImage({
      prompt: req.body.message,
      n: 1,
      size: "256x256",
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({
      message: "Something went Wrong",
    });
  }
}
