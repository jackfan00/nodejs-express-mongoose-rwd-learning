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
  
4. npm install mongoose --save (nodejs mongoDB driver)  

5. 程式功能解說:
          
          - 中文小說網站
          - 提供作家自由上傳作品
          - 書籍排行分類: 點擊 推薦 收藏 新書 更新
          - 讀者書架收藏 閱讀紀錄
          - 版面安排手機閱讀優先

6. 程式碼:

          - routes/index.js, views/*.pug: 主要網站功能
          - routes/author.js, views/forauthor/*.pug: 作家相關網站功能
          
