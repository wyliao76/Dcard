# Dcard
A practice project

Make sure memcached is installed on your machine before running this project.

Install first with: npm install

To run it: npm start

To test it: npm test

Explanation: 我研究了之後知道這個技術叫做 rate limiting, 我想到的做法有三種, nginx, in-memory storage, database storage.

Nginx可以輕鬆的做到 rate limiting, 但我不知道怎麼紀錄與顯示次數, Database storage 我認為太慢了, 而且還要清除過期資料, In-memory storage 效能好, 也很容易達到所有的要求, 所以最後我選擇用最熟悉的memcached來做
