import fetch from "node-fetch";
import UserDataModel from "../models/UserDataModel";
import Game from "../models/GameModel";
import { UserData as UserDataInterface } from "../interfaces/UserData";
import { Game as GameInterface } from "../interfaces/Game";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const userDataModel = new UserDataModel();
const gameModel = new Game();

function parseJSONField(field: string | string[] | null | undefined): string[] {
  if (Array.isArray(field)) return field;
  if (typeof field === "string") return JSON.parse(field);
  return [];
}

export const getGameRecommendations = async (userId: number): Promise<any> => {
  const userData: UserDataInterface | null = await userDataModel.getUserDataById(
    userId
  );
  if (!userData) throw new Error("User data not found");

  const interests = parseJSONField(userData.interests);
  const genres = parseJSONField(userData.genres);

  const games: GameInterface[] = await gameModel.getAllGames(50);

  const prompt = `
    Based on the user's interests: "${interests.join(
      ", "
    )}" and preferred genres: "${genres.join(
    ", "
  )}", recommend up to 3 video games.
  `;

  // Define the function schema for function calling
  const functions = [
    {
      name: "get_recommendations",
      description: "Get a list of recommended games for the user",
      parameters: {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                game_id: { type: "integer" },
                title: { type: "string" },
                genre: { type: "string" },
                review_rating: { type: "number" },
              },
              required: ["game_id", "title", "genre", "review_rating"],
            },
          },
        },
        required: ["recommendations"],
      },
    },
  ];

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-0613", // Use a model that supports function calling
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that provides game recommendations.",
          },
          { role: "user", content: prompt },
        ],
        functions: functions,
        function_call: { name: "get_recommendations" },
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log("Full API Response:", JSON.stringify(data, null, 2));

    // Extract the function call arguments
    if (data.choices && data.choices[0]?.message?.function_call) {
      const function_call = data.choices[0].message.function_call;
      if (function_call.name === "get_recommendations") {
        const recommendations = JSON.parse(function_call.arguments);
        return recommendations;
      } else {
        throw new Error(`Unexpected function called: ${function_call.name}`);
      }
    } else {
      console.error("Failed to get function call response:", data);
      throw new Error("No valid recommendations returned from OpenAI API.");
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
