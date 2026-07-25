import { GoogleGenAI } from "@google/genai";

const recipeSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A short and appealing recipe title.",
    },
    description: {
      type: "string",
      description: "A short description of the meal.",
    },
    preparationTime: {
      type: "integer",
      description: "Preparation time in minutes.",
    },
    cookingTime: {
      type: "integer",
      description: "Cooking time in minutes.",
    },
    totalTime: {
      type: "integer",
      description: "Total preparation and cooking time in minutes.",
    },
    servings: {
      type: "integer",
      description: "Number of servings.",
    },
    difficulty: {
      type: "string",
      description: "Beginner, Intermediate, or Advanced.",
    },
    ingredients: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Complete ingredient list with realistic quantities and units.",
    },
    instructions: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Clear, ordered cooking instructions. Each item is one step.",
    },
    substitutions: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Useful substitutions for unavailable ingredients.",
    },
    wasteTip: {
      type: "string",
      description:
        "One practical storage, leftovers, or food-waste reduction tip.",
    },
    nutrition: {
      type: "object",
      properties: {
        calories: {
          type: "integer",
          description: "Estimated calories per serving.",
        },
        protein: {
          type: "integer",
          description: "Estimated protein in grams per serving.",
        },
        carbohydrates: {
          type: "integer",
          description: "Estimated carbohydrates in grams per serving.",
        },
        fat: {
          type: "integer",
          description: "Estimated fat in grams per serving.",
        },
        fiber: {
          type: "integer",
          description: "Estimated fiber in grams per serving.",
        },
      },
      required: [
        "calories",
        "protein",
        "carbohydrates",
        "fat",
        "fiber",
      ],
    },
  },
  required: [
    "title",
    "description",
    "preparationTime",
    "cookingTime",
    "totalTime",
    "servings",
    "difficulty",
    "ingredients",
    "instructions",
    "substitutions",
    "wasteTip",
    "nutrition",
  ],
};

function sendJson(response, status, body) {
  response.status(status).json(body);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return sendJson(response, 405, {
      error: "Only POST requests are allowed.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return sendJson(response, 500, {
      error: "The Gemini API key has not been configured.",
    });
  }

  try {
    const {
      ingredients,
      preferences,
    } = request.body ?? {};

    if (!Array.isArray(ingredients) || ingredients.length < 2) {
      return sendJson(response, 400, {
        error: "Please provide at least two ingredients.",
      });
    }

    if (!preferences || typeof preferences !== "object") {
      return sendJson(response, 400, {
        error: "Recipe preferences are missing.",
      });
    }

    const cleanIngredients = ingredients
      .map((ingredient) => String(ingredient).trim())
      .filter(Boolean)
      .slice(0, 30);

    const allergies =
      Array.isArray(preferences.allergies) &&
      preferences.allergies.length > 0
        ? preferences.allergies.join(", ")
        : "None specified";

    const prompt = `
Create one practical recipe using the user's available ingredients and
preferences.

Available ingredients:
${cleanIngredients.join(", ")}

Preferences:
- Meal type: ${preferences.mealType}
- Diet: ${preferences.diet}
- Allergies that must be avoided: ${allergies}
- Maximum total cooking time: ${preferences.cookingTime} minutes
- Cooking skill: ${preferences.skillLevel}
- Servings: ${preferences.servings}
- Budget: ${preferences.budget}

Requirements:
- Prioritize the available ingredients.
- Small pantry basics such as salt, pepper, oil, water, and common spices
  may be added when necessary.
- Never include an ingredient listed as an allergy.
- Respect the selected diet.
- Keep the total time within the requested maximum whenever realistically
  possible.
- Give exact quantities.
- Make instructions clear and safe for a home cook.
- State that meat, poultry, seafood, or eggs must be cooked thoroughly
  when included.
- Nutrition values must be reasonable estimates per serving.
- Return only the structured recipe data.
`;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
        },
        });

        const recipe = JSON.parse(result.text);

    return sendJson(response, 200, {
      recipe,
    });
  } catch (error) {
    console.error("Gemini generation error:", error);

    return sendJson(response, 500, {
      error:
        "PantryPal could not generate a recipe. Please try again.",
    });
  }
}