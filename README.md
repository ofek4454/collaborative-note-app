# Project Name: Notes Management App

## Overview

The Notes Management App is a web application built to manage and organize notes within notebooks. It provides features such as creating, editing, and deleting notes, viewing note history, and reverting to previous versions. The app utilizes Firebase Firestore for real-time data management and authentication.

## Features

1. **User Authentication**:

   - Users can sign in and out using Firebase Authentication.
   - Each user's data is securely stored and isolated.

2. **Notebooks and Notes Management**:

   - Users can create multiple notebooks.
   - Each notebook can contain multiple notes.
   - Notes can be created, edited, and deleted.

3. **Note Locking**:

   - Notes can be locked to prevent editing by others.

4. **Note History**:

   - Changes to notes are tracked in a history subcollection.
   - Users can view previous versions of notes.
   - Notes can be reverted to any previous version.

5. **Real-time Updates**:
   - All data changes are reflected in real-time across all connected clients.

## Technologies Used

- **Frontend**: React, Bootstrap, React Bootstrap
- **Backend**: Firebase Firestore, Firebase Authentication
- **Icons**: React Icons
- **State Management**: React Hooks, Firebase Hooks

## Database Schema

The following is the structure of the Firestore database used in the app:

- **notebooks (collection)**
  - **notebookId1 (document)**
    - **name**: string (Name of the notebook)
    - **uid**: string (User ID of the notebook owner)
    - **notes (subcollection)**
      - **noteId1 (document)**
        - **title**: string (Title of the note)
        - **content**: string (Content of the note)
        - **uid**: string (User ID of the note owner)
        - **createdAt**: timestamp (Timestamp of note creation)
        - **lastModified**: timestamp (Timestamp of last modification)
        - **lockedBy**: string (User ID of the user who locked the note)
        - **history (subcollection)**
          - **histId1 (document)**
            - **title**: string (Title of the note version)
            - **content**: string (Content of the note version)
            - **changedAt**: timestamp (Timestamp of the change)
            - **changedBy**: string (User ID of the user who made the change)

## How to Run the Project

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd notes-management-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run the App:**

   ```bash
   npm start
   ```

4. **Open the browser:**

- Navigate to http://localhost:3000 to view the app.

## Acknowledgements

We would like to acknowledge the following resources and libraries that made this project possible:

- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Firebase](https://firebase.google.com/): A platform developed by Google for creating mobile and web applications, providing backend services like authentication, database, and hosting.
- [React Bootstrap](https://react-bootstrap.github.io/): A library that integrates Bootstrap with React for easy UI development.
- [React Icons](https://react-icons.github.io/react-icons/): A collection of popular icons used in React projects.

## Contact

For any queries, please contact Ofek Gorgi at [ofek4454@gmail.com].
