# Pharmacy Stock Manager

A full-stack web application for managing pharmacy medicine inventory built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend**: React, JavaScript, Vite, shadcn/ui, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose

## Features

- View all medicines in a table format
- Add new medicines with form validation
- Edit existing medicines
- Delete medicines with confirmation
- Real-time inventory updates
- Responsive design with shadcn/ui components

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on default port 27017)
- npm or yarn package manager

## Installation & Setup

### 1. Clone and Setup Backend

```bash
# Install backend dependencies
npm install

# Start the backend server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Setup Frontend

```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start the React development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /medicines` - Get all medicines
- `GET /medicines/:id` - Get a specific medicine
- `POST /medicines` - Create a new medicine
- `PUT /medicines/:id` - Update a medicine
- `DELETE /medicines/:id` - Delete a medicine

## Medicine Model

```javascript
{
  name: String (required),
  brand: String,
  category: String,
  quantity: Number,
  expiryDate: Date,
  price: Number
}
```

## Usage

1. Start MongoDB service on your system
2. Run the backend server: `npm run dev`
3. In a new terminal, navigate to client folder and run: `npm run dev`
4. Open your browser to `http://localhost:3000`
5. Use the form to add medicines and the table to view/edit/delete them

## Project Structure

```
pharmacy-stock-manager/
├── server.js              # Express server setup
├── models/
│   └── Medicine.js        # Mongoose medicine model
├── routes/
│   └── medicineRoutes.js  # API routes
├── package.json           # Backend dependencies
└── client/                # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── ui/          # shadcn/ui components
    │   │   ├── MedicineForm.js
    │   │   └── MedicineTable.js
    │   ├── lib/
    │   │   └── utils.js     # Utility functions
    │   └── App.js           # Main React component
    └── package.json         # Frontend dependencies
```