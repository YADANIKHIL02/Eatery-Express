# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables for AI Features

If you are using Generative AI features in this application (which use Genkit and Google AI), you will need to set up an environment variable for your Google API key.

1.  Create a file named `.env.local` in the root directory of your project (if it doesn't already exist).
2.  Add your Google API key to this file in the following format:

    ```
    GOOGLE_API_KEY=your_actual_google_api_key_here
    ```

    Replace `your_actual_google_api_key_here` with the API key you obtained from Google AI Studio or Google Cloud.

3.  **Restart your Next.js development server** after creating or modifying the `.env.local` file for the changes to take effect.

This API key is necessary for the application to make calls to Google's Generative AI models. Without it, AI-powered features like personalized recommendations will likely result in an Internal Server Error.
# Quickplate
