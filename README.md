# WEB_ENG_PROJECT

## Firebase setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root and copy values from `.env.example`.

3. Fill in your Firebase project values in `.env`.

4. Run the app:

```bash
npm run dev
```

## Notes

- Firebase initialization is in `src/firebase.js`.
- User login and signup use Firebase Authentication.
- User profile metadata (`username`, `userType`) is stored in Firestore `users/{uid}`.
- For admin login, set `userType: "admin"` in the corresponding Firestore user document.