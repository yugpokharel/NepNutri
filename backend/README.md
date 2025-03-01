cd backend

3.Install the backend dependencies:
npm install

4Configure the PostgreSQL Database:
.Open pgAdmin (or your preferred PostgreSQL tool) and create a new database (e.g., nepnutri_db).
.Update the database configuration in the backend (likely in a file like config.js or .env). For example:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=nepnutri_db
DB_USER=your_username
DB_PASSWORD=your_password

Replace your_username and your_password with your PostgreSQL credentials.

4.Run the backend server:
npx nodemon index.js
The backend should now be running (e.g., on http://localhost:5000).
