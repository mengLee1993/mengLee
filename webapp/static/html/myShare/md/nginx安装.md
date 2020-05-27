**nginx安装(mac)**

    *1.安装Command Line tools   #xcode-select —install

    *2.安装brew命令   #ruby -e “(curl -fsSL http://row.githubusercontent.com/Homebrew/install/master/install)”

    *3.安装nginx    #brew install nginx

    *4.启动nginx    #sudo nginx

    *5.安装成功，默认端口号8080

    *6.打开文件夹物理路径，配置nginx    #vim /usr/local/etc/nginx/nginx.conf

    *7.进入nginx.conf文件，按“I”键编辑

    *8.第一行换为user root owner
    ￼
    *9.按”esc”推出编辑，输入:wq保存nginx.conf文件

    *10.重新启动nginx    #sudo nginx -s reload

    *11.终止nginx    sudo nginx -s stop

    *12.进入文件夹下面    #cd /usr/local/etc/nginx/

    *13.服务器     #vim  /usr/local/nginx/conf/nginx.conf