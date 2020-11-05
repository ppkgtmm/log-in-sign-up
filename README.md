# log-in-sign-up
Simple log in and sign up API created to practice using Node.js, express and mongoDB
## Set up
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) (if not installed)
2. Clone this repository
```
git clone https://github.com/ppkgtmm/log-in-sign-up.git user-api
```
3. Go to project directory
```
cd user-api
```
4. Run the application in background using docker compose
```
docker-compose up -d
```
## Tear down
```
docker-compose down
```
## Data
a user may have the following information stored
1. firstname
2. lastname
3. email
4. password
5. access token
#### Example
```
{
  "firstname": "Andy",
  "lastname": "Smith",
  "email": "andy.s@and.co.op",
  "password": "e9cee71ab932fde863338d08be4de9dfe39ea049bdafb342ce659ec5450b69ae",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"  
}
```
* password is encrypted before storing
## API Endpoints
### Sign up
```
  POST http://localhost:3000/v1/signup
```
##### Request body example
```
{
  "firstname": "Andy",
  "lastname": "Smith",
  "email": "andy.s@and.co.op",
  "password" "123gogogo" 
}
```
* all fields according to the example above should be specified
##### Response example (case with no errors)
```
{
  "success": true,
  "data": {
    "firstname": "Andy",
    "lastname": "Smith",
    "email": "andy.s@and.co.op"
  }
}
```
### Log in
```
  POST http://localhost:3000/v1/login
```
##### Request body example
```
{
  "email": "andy.s@and.co.op",
  "password" "123gogogo" 
}
```
* all fields according to the example above should be specified
##### Response example (case with no errors)
```
{
  "success": true,
  "data": {
    "firstname": "Andy",
    "lastname": "Smith",
    "email": "andy.s@and.co.op",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```
## Status code
### Sign up
* 201 : User has signed up successfully
* 400 : Failed to sign up due to invalid input
  * firstname or lastname exceed 128 characters
  * email has invalid format (valid email should be in form of USERNAME@DOMAIN_NAME.DOMAIN)
  * email was already used for registration
  * password length is less than 8 characters
* 500 : Some error occurred while processing
### Log in
* 200 : User has logged in successfully
* 400 : Failed to log in due to invalid input
  * email or password not provided
  * user with the email provided has not been registered
  * password is incorrect for the account
* 500 : Some error occurred while processing
