# CSC648-01-FA24-team02 Repository

**Application URL: <https://gameratings-psi.vercel.app/>**

## Before completing Milestone 0

1. On the Github classroom invite link, you will only have to enter your `team number` everything else is a prefix.
2. The name of the repository should look like csc648-S0X-FA24-teamNN.
   - S0X will be one of 01 or 04 (Already prefilled).
   - teamNN should be your team number. Team numbers whose value is less than
     10, please pad with a 0 (e.g. team 1 is Team01 team 11 is Team11). Please
     make sure to also **remove the username from the repository as well**!
     Teams with an incorrectly named repository will have points deducted from
     their milestone 0 grades.
   - Examples: `csc648-04-sp24-Team01`, `csc648-01-sp24-Team05`
3. Add ALL members of your team to this repository. For it to count, **they must
   ACCEPT the invite**.
4. Fill out the table below

| Student Name | Student Email | GitHub Username | Student's role |
| :----------: | :-----------: | :-------------: | :------------: |
|   Andrew Dahlstrom   | adahlstrom@sfsu.edu |      shoreOwl125       |  Team Leader   |
|   Joyce Fu   | jfu@sfsu.edu |      fufu911219        |  Scrum Master   |
|   Jason Avina   | javina2@mail.sfsu.edu |      JasonAvina       |  Scrum Master   |
|   Nadir Ali   | nali1@sfsu.edu |      NadirAli17       |  Github Master   |
|   Kayla Maa   | kmaa@sfsu.edu |      kaylamaa       |  Front-end Lead   |
|   Aidan Bayer-Calvert   | abayercalvert@sfsu.edu |      abccodes       |  Back-end Lead   |
|   Ryan Flannery   | rflannery@sfsu.edu |      ryanvflannery       |  Back-end Lead   |

**NO code should be stored in the root of your repository. You may rename the
`application/` folder to your team's application name if you'd like, but all the
source code should be stored inside that folder.**

Rate My Video Game - Video Game Review & Search Application  
    
Rate My Video Game is a web application designed to help users search, rate, and review video games. Users can search for games based on title, filter games by rating, and view reviews provided by other users. The app is powered by a React frontend and a Node.js/Express backend, with a MySQL database hosted on AWS EC2.  

Features  
Search for video games by title.  
Filter video games by rating.  
Leave reviews and rate video games.  
View game details including description, genre, and user reviews.  
  
Tech Stack  
Frontend: React, HTML, CSS  
Backend: Node.js, Express  
Database: MySQL (hosted on AWS RDS)  
Hosting: AWS EC2 for backend and database  
   
Prerequisites  
Before you can run this project, you need to have the following installed on your local machine:  
Node.js (v14+ recommended)  
MySQL  
Git  
   
You will also need to set up the following:  
An AWS EC2 instance (for hosting the backend)  
An AWS RDS instance (for the MySQL database)  
    
Project Setup  
1. Clone the Repository  
To get started, clone the repository to your local machine:   
git clone https://github.com/your-repo-url.git  
cd rate-my-video-game    
2. Setup Environment Variables    
Create a .env file in both the application/server folder and application/web folder to configure your environment variables.   
For Backend (in application/server/.env):    
NODE_ENV=production    
    
Production DB   
HOST=your-production-db-host    
USER_STRING=your-db-username    
PASSWORD=your-db-password    
DATABASE=your-db-name    
PORT=8000    
JWT_SECRET=your-jwt-secret     

Development DB
DEV_HOST=127.0.0.1     
DEV_USER_STRING=root    
DEV_PASSWORD=    
DEV_DATABASE=your-local-dev-db-name  
    
3. Install Dependencies    
Navigate to the root of both the backend and frontend directories, and install the necessary packages.
   
Backend   
Navigate to the application/server folder:    
cd application/server    
npm install   
      
Frontend    
Navigate to the application/web folder:      
cd application/web    
npm install     

4. Database Setup
If you're running the app locally, set up your MySQL database using the schema provided in the application/server/scripts folder.     
Run the following command to connect to your MySQL database:   
mysql -h your-db-host -u your-db-user -p    
Once connected, create the necessary tables:     
source ./scripts/gamesDevDBSetup.sql     
source ./scripts/userDevDBSetup.sql   
   
5. Run the Application        
Backend    
To start the backend server:    
cd application/server     
npm run dev     
Frontend    
To start the frontend React application:      
cd application/web   
npm start   
     
6. Access the Application
Once the frontend and backend servers are running, you can access the application by opening your browser and visiting:    
http://localhost:3000    
If your project is hosted, replace localhost:3000 with your AWS EC2 public IP or domain name.    
     
7. API Endpoints     
The backend exposes the following API endpoints for interacting with the database:       
Method	Endpoint	Purpose    
POST	/login	Log in the user     
POST	/signup	Register a new user    
GET	/games/search	Search for games by title or filter by rating     
POST	/reviews	Submit a new game review     
GET	/reviews/:gameId	Get reviews for a specific game     
GET	/ratings/:gameId	Get average rating for a game     
     
8. Deploying to AWS EC2     
To deploy this project to your EC2 instance, follow these steps:       
SSH into your EC2 instance:      
ssh -i your-key.pem ec2-user@your-ec2-public-ip     
Transfer project files to the EC2 instance using scp or git.    
scp -i your-key.pem -r /path/to/your/local/project ec2-user@your-ec2-public-ip:/path/to/destination    
Install Node.js and MySQL on the EC2 instance:      
sudo yum update -y    
sudo yum install nodejs mysql     
Install PM2 (a process manager for Node.js apps):     
sudo npm install -g pm2     
Start the backend on the EC2 instance:    
cd /path/to/project/application/server     
npm install     
pm2 start dist/src/index.js     
Host the frontend (React app) using a service like Nginx or a public IP:     
cd /path/to/project/application/web     
npm install    
npm build      
    
9. Troubleshooting    
CORS Issues: Ensure the backend CORS settings allow requests from your frontend.    
Database Connection Errors: Verify the MySQL connection settings and make sure your security group on AWS allows inbound MySQL connections on port 3306.     
   
Contributing    
If you would like to contribute, please fork the repository and submit a pull request.     

License      
This project is licensed under the MIT License.   
