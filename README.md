# CourseSwaps

## Demo

Check out a live demo of the website here: [Live demo](https://youtu.be/RNSnFxqx_X8?si=uEljs68I76IxEtB8)

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
Recommended Python version: 3.11

In the backend directory, create a file called `.env` and add the following line:
```bash
DATABASE_URL=sqlite:///database.db
SECRET_KEY=YOURSUPERSECRETKEY
```

To run the backend, in the same backend directory, run the following command:
```bash
python app.py
```


### Running Test 
Check out a live demonstration of setting up testing here: [Loom Video Demo](https://www.loom.com/share/700103ecd4be4bbdbd251db1bc9d2f91?sid=eea3ab3f-e1aa-4563-b962-028a8d3a5a4d)

To **setup** the tests:
 1. Click on the tests folder 
 2. Create a new file to test a specific functionality -- preferably bunch tests in the same blueprint of file together.
 3. The naming convention for the test should be (test_what you are testing) for example test_authentification
 3. Run the test by clicking the titration flask icon. You should be able to run the specific file that you want. 
 4. After runing the specific file click on the back-end section to run tests in all back-end files to ensure your code hasnt broken other segments of the app.