# Steps for Setup of Project
1) Use the sample env in the public directory located in both Frontend and Backend
2) FIll the env variables with required values
3) run `npm i` then  `npm run dev` on both Frontend and Backend
## Hasura PostgreSQL Table Schema Structure
 def users{
 column 1:id uuid primary key
 column 2:name text
 column 3:email text
 column 4:password text
 column 5:created_at(suggested by Hasura)
 column 6:updated_at(suggested by Hasura)
 column 7:balance numeric 
 column 8:access_token text
 }
 
   
