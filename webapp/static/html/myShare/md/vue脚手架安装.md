**vue脚手架安装(本地)**

    1.安装淘宝镜像     #npm install -g cnpm --registry=https://registry.npm.taobao.org

    2.全局安装vue-cil，也就是所谓的脚手架  #cnpm install -g vue-cli

    3.安装webpack    #cnpm install webpack@3.8.1 -g

    3.检查vue是否安装  #vue -V    (-V是大写字母V)

    4.然后初始化项目   #vue init webpack 项目名

    5.安装依赖     #cnpm i

    6.运行项目    #cnpm run dev

    7.遇到问题
        _1.如果提示“无法识别”，有可能是npm的版本过低。
        解决办法：#npm install -g npm（更新一下版本就好了）
        _2. 如果安装失败的话。
        解决办法：#npm cache clean（清除一下缓存就好了）


