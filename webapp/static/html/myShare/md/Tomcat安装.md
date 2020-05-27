**Tomcat安装(mac)**

*1.下载tomcat——http://tomcat.apache.org/download-80.cgi

*2.选择core下面的zip或者tar.gz文件

*3.放到Library（资源库）文件夹下面，并且重命名为ApacheTomcat

*4.进入ApacheTomcat文件夹下面bin目录下  #cd /Users/limeng/Library/tomcat/bin

*5.启动ApacheTomcat    #./startup.sh
如果出现-bash: ./startup.sh: Permission denied，说明没有权限，需要chmod修改一下bin目录下的.sh权限

*6.关闭tomcat  #ps -ef|grep tomcat  #kill -9 2235

*7.打印日志   #tail -200f ../logs/catalina.out