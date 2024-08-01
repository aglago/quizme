Certainly! Integrating cloud storage options like Google Drive can significantly enhance the user experience. Here's an approach to add Google Drive integration, which you can use as a template for other cloud platforms:

1. First, you'll need to set up Google Drive API:
   - Go to the Google Cloud Console
   - Create a new project or select an existing one
   - Enable the Google Drive API
   - Create credentials (OAuth 2.0 Client ID)
   - Set up the OAuth consent screen

2. Install the necessary packages:
```
npm install @react-oauth/google @types/gapi @types/gapi.auth2
```

3. Update your QuizGenerator component to include Google Drive picker:

```typescript
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { generateQuiz } from "../services/quizService";
import { QuizPreferences as QuizPreferencesType, QuizQuestion } from "../services/quizService";
import { useQuizPreferences } from "@/hooks/useQuizPreferences";
import QuizPreferences from "./QuizPreferences";
import { GoogleLogin } from '@react-oauth/google';

interface QuizGeneratorProps {
  onQuizGenerated: (questions: QuizQuestion[], preferences: QuizPreferencesType) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated }) => {
  // ... (existing state variables)
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);

  useEffect(() => {
    // Load the Google API client library
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("picker", () => {});
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = (credentialResponse: any) => {
    setIsGoogleAuthenticated(true);
    // You might want to store the token for later use
    localStorage.setItem('googleToken', credentialResponse.credential);
  };

  const openGoogleDrivePicker = () => {
    if (!isGoogleAuthenticated) {
      alert("Please log in with Google first");
      return;
    }

    const token = localStorage.getItem('googleToken');
    
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .setOAuthToken(token)
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  };

  const pickerCallback = async (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const fileId = data.docs[0].id;
      try {
        const response = await axios.get(`http://localhost:3000/api/quiz/google-drive-file/${fileId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('googleToken')}`
          }
        });
        setTextInput(response.data);
      } catch (error) {
        console.error("Error fetching file from Google Drive:", error);
        setError("Failed to fetch file from Google Drive. Please try again.");
      }
    }
  };

  // ... (rest of the existing code)

  return (
    <div className="quiz-generator">
      <div className="input-area">
        <textarea
          name="text for quiz generation"
          value={textInput}
          onChange={handleTextInputChange}
          placeholder="Enter text for quiz generation or attach a file"
        />
        <div className="file-upload">
          <input
            type="file"
            title="Upload file..."
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            className="hidden"
          />
          <button type="submit" onClick={() => fileInputRef.current?.click()}>
            {file ? "File attached" : "Attach file"}
          </button>
          <button onClick={openGoogleDrivePicker}>Select from Google Drive</button>
        </div>
      </div>

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.log('Login Failed');
        }}
      />

      <QuizPreferences 
        preferences={quizPreferences} 
        onPreferenceChange={handlePreferenceChange}
      />

      <button type="submit" onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default QuizGenerator;
```

4. On your backend, you'll need to add a new endpoint to handle fetching files from Google Drive:

```typescript
import { google } from 'googleapis';

router.get('/api/quiz/google-drive-file/:fileId', async (req, res) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: req.headers.authorization?.split(' ')[1]
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.get({
      fileId: req.params.fileId,
      alt: 'media'
    });

    res.send(response.data);
  } catch (error) {
    console.error('Error fetching file from Google Drive:', error);
    res.status(500).send('Error fetching file from Google Drive');
  }
});
```

This setup allows users to:
1. Log in with their Google account
2. Select a file from their Google Drive
3. Use the content of that file for quiz generation

To add support for other cloud platforms like Dropbox or OneDrive, you would follow a similar pattern:
1. Set up the API and get the necessary credentials
2. Implement the authentication flow
3. Use the platform's file picker or API to let users select files
4. Fetch the selected file's content and use it for quiz generation

Remember to handle errors gracefully and provide clear feedback to users throughout the process. Also, ensure you comply with each platform's terms of service and implement proper security measures to protect user data.