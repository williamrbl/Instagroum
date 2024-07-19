# Instagroum 📸

**Instagroum** is a clone of Instagram, featuring a connected database to store and manage images. This project is currently a work in progress, with the next major step being the implementation of the "Create Account" feature.

## Current Progress

- 📷 Image storage and retrieval
- 📷 Take your own pictures directly in the app or upload a file

## Next Steps

- 🛠️ Finishing the "Create Account" functionality

## Getting Started

To connect, for the moment, use the following credentials:
- **Username:** `william.rbl`
- **Password:** `williampassword`

### Prerequisites

1. **Firestore Database Setup:** Ensure you have a Firestore database configured.
2. **Environment Variables:** Create two `.env` files as described below.

### Environment Variables

#### Frontend Folder

Create a `.env` file with the following variable:
API=<link to backend server>

#### Backend Folder

Create a `.env` file with the following variables:

- VUE_APP_EMAIL_USER= your-email-user 
- VUE_APP_EMAIL_PASS= your-email-password
- VUE_APP_MAIL_SERVICE= your-mail-service
- VUE_APP_SERVICE_EXTENSION= service-extension # e.g., for 'smtp.gmail.com', this would be 'com'

Google Firestore API
- VUE_APP_STORAGE_BUCKET= your-storage-bucket
- VUE_APP_serviceAccountKey= your-service-account-key

## Installation

1. **Clone the Repository:**
   ```
   git clone <repository-url>
   cd Instagroum
### Install Dependencies:

For the frontend:
```
cd frontend
npm install
```
For the backend:
```
cd backend
npm install
```
### Start the Development Server:

For the frontend:
```
cd /front
npx quasar dev
```
For the backend:
```
cd /backend
npm run start
```
Usage
Once the setup is complete, you can start using Instagroum by logging in with the provided credentials. Stay tuned for more updates as I continue to develop and enhance the platform.
