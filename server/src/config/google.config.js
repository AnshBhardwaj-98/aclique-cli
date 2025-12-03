import dotenv from "dotenv";
dotenv.config();

export const config = {
  googleApiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  acliqueModel: process.env.ACLIQUE_MODEL,
};
