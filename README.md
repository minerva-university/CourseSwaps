# CourseSwaps


## Installation

### Frontend


To run the frontend, run the following commands in your virtual environment:
```bash
cd frontend
npm install
```

In the frontend directory, create a file called `.env` and add the following line:
```bash
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_APP_API_URL=http://127.0.0.1:7000
```

To run the frontend, in the same frontend directory, run the following command:
```bash
npm run dev
```

### Backend

To run the backend, run the following commands in your virtual environment:
```bash
cd backend
pip install -r requirements.txt
```

In the backend directory, create a file called `.env` and add the following line:
```bash
DATABASE_URL=sqlite:///database.db
SECRET_KEY=YOURSUPERSECRETKEY
```

To run the backend, in the same backend directory, run the following command:
```bash
python app.py
```