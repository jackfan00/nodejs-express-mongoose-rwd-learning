# nodejs-express-mongoose-rwd-learning

1. enviroment: CentOS 6.8

2. download necessary tools:

          - nodejs: https://nodejs.org/, 
                    a. extract tar file , then edit ~/.bashrc , add  "export PATH=$PATH:<nodejs-extract-directory>/bin"
                    b. source ~/.bashrc
      
          - mongoDB: https://www.mongodb.com/download-center#community, select "RHEL6 linux 64-bit", 
                    a. extract tar file, then edit ~/.bashrc , add  "export PATH=$PATH:<mongodb-extract-directory>/bin"
                    b. source ~/.bashrc
                    c. mkdir ./data/db
                    d. mongod --dbpath=./data/db --rest
                    e. check http://localhost:28017
      
          - express-generator: "npm install express-generator -g"

3. create web-site page

          - express --view=pug myapp
          - cd myapp
          - npm install (install dependence in the package.json)
          - DEBUG=myapp:* npm start
          - check http://localhost:3000
  
  
