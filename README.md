# 开发者交流分享平台 后端部分

[![Node](https://img.shields.io/badge/Powered_by-Node-green.svg?style=flat)](https://nodejs.org/zh-cn/)

由于采用的是前后端分离的开发模式，因此后端部分提供 api 接口给前端调用。



## 安装

```
git clone https://github.com/xiejesses/ITlearn2.0-Server
cd ITlearn2.0-Server
npm install
npm start
```



#### MongoDB 的安装与配置

[下载](https://www.mongodb.com/download-center#community)

选择自定义，例如安装在 `E:\MongoDB\Server\3.4` 

**配置**

1. 添加环境变量

   把 `E:\MongoDB\Server\3.4\bin`  添加到系统环境变量里

2. 安装 MongoDB 服务

   - 在 `E:\MongoDB` 下创建 `data` 目录


   - 在 刚刚创建的 ` data`  里分别创建 `db` 和 `log` 两个目录，用于存放数据和日志

   - 在 `E:\MongoDB` 下创建 `mongod.cfg` 文件，文件内容如下：

     ```
     systemLog:
         destination: file
         # log文件夹路径
         path: e:\MongoDB\data\log\MongoDB.log 
     storage:
         # db文件夹路径
         dbPath: e:\MongoDB\data\db
     ```

**启动**

1. 管理员身份运行 cmd（在搜索框输入cmd，在cmd上点击右键选择用管理员运行），输入 `mongod --config e:\MongoDB\mongod.cfg --install` ，如果失败则运行 `mongod.exe --dbpath "e:\MongoDB\data\db" --logpath "e:\MongoDB\data\log\mongodb.log" --install --serviceName "mongo" --logappend --directoryperdb`
2. 启动服务 ` net start mongodb`
3. 浏览器输入 `http://localhost:27017/` 会显示`It looks like you are trying to access MongoDB over HTTP on the native driver port.` 
4. 关闭服务 ` net stop mongodb`



**创建数据库**

数据库名：ITlearn

集合：`comments` `groups` `replys` `sharelinks` `tags` `topics` `users`



**Note:**  本项目中所使用的 MongoDB 版本为3.4，如在使用 mongoose 过程中发生错误，请注意自己电脑 MongoDB 版本。

[前端安装部分请点此](https://github.com/xiejesses/ITlearn2.0)



## 主要技术列表

-  **express** node.js 框架

- **jsonwebtoken** 创建 token，用于验证注册登录以及 api 接口

- **express-jwt** 校验前端传过来的 token

- **mongoose** MongoDB的一个对象模型工具

  ​

## To Do List

- [ ] 搜索功能
- [ ] 关注标签功能




## 总结

本人的意愿方向是前端，做此后端部分最主要的原因了为了学习前后端分离的开发模式，理解前后端之间的数据交互，相信对于做过后端之后，对自己以后的前端开发更得心应手。



——不懂后端的前端不是好前端


















