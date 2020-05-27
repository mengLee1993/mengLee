**gulp安装(服务器)**

    *1.svn更新 cd到当前目录 #svn update

    *2.查看文件  #less run.log  shift+g//到文件最后。 u/d//q

    *3.编辑文件  #vim run.log   #vi run.log   #:wq/:aq!

    *4.查看当前目录 #pwd

    *5.查看java进程  #ps -eaf | grep java

    *6.执行脚本    #sh start.sh

    *7.查看磁盘空间    #df -h

    *8.启动注册中心：查找到当前目录执行   #sh start.sh  prod one(two|three)

    *9.上传文件   #rz a.txt

    *10.下载文件   #sz a.txt

    *11.重启tomcat
        _1.查看进程
        #ps -aux | grep ecm
        _2.杀掉进程
        #kill -9 进程号
        _3.路径
        #cd /app/work/apache-tomcat-8.0.45/bin
        _4.重启
        #sh startup.sh

    *12.隐藏和显示隐藏文件夹
        _1.将隐藏的文件显示出来在终端输入
        #defaults write com.apple.finder AppleShowAllFiles -boolean true;killall Finder
        _2.讲显示的文件隐藏在终端输入
        #defaults write com.apple.finder AppleShowAllFiles -boolean false;killall Finder

    *13.安装软件，显示任何来源
        _1.显示任何来源
        #sudo spctl --master-disable
        _2.隐藏任何来源
        #sudo spctl --master-enable

    *14.禁止谷歌自动升级
        #cd /Library/Google/GoogleSoftwareUpdate
        #sudo mv GoogleSoftwareUpdate.bundle GoogleSoftwareUpdate.bundle.bak

