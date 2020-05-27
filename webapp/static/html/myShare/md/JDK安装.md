**JDK安装(mac)**

    jdk下载地址  http://www.oracle.com/technetwork/cn/java/javase/downloads/jdk8-downloads-2133151-zhs.html 
    * 1.启动终端Terminal  

    *2.进入当前用户的home目录  #cd ~  

    *3.创建.bash_profile  #touch .bash_profile  

    *4.编辑.bash_profile文件  #open -e .bash_profile  把这些代码拷入，JAVA_HOME后边的路径是你的安装路径 
    /*******注释********/
    如何查看自己java安装的路径 
    //java  环境变量查看
    #whereis Java
    #ls -l  /usr/bin/java
    //如果默认安装 这个命令可以打开jdk安装目录
    #open /Library/Java/

    #JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
    #CLASSPAHT=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
    #PATH=$JAVA_HOME/bin:$PATH:
    #export JAVA_HOME
    #export CLASSPATH
    #export PATH

    *5.保存文件，关闭.bash_profile  

    *6.更新刚配置的环境变量  	#source .bash_profile  

    *7.查看是否成功。#java -version