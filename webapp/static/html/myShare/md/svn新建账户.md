**svn新建账户**

    *1.找到SVN的安装目录
        如果SVN进程已经启动，可以通过ps -ef | grep svn查询
        如果SVN进程未启动，可以通过 find  / -name svn查询
    *2.进入该目录的conf文件夹，其中包含authz、passwd、svnserve.conf三个文件
    *3.vim passwd修改passwd加上想要添加的svn账号和密码，格式为：
        username1 = password1
        username2 = password2
        如果文件为只读，登录root用户修改，su。然后wq保存。
    *4.再进入authz，添加上在passwd中加入的用户名，格式为：
        www=username1,username2
        然后保存wq
    *5.重启svn进程（测试不需要重启就可以生效）
        找到svn的进程ID ps -ef | grep svn,然后使用kill -9 processid杀掉进程，或者通过killall svnserve杀掉进程
        启动svn：sudo 	安装路径
        这种方式启动的svn是在默认端口3690，通过netstat -nultp可以看到启动的端口，如果想在指定端口启动可以通过如下命令启动：
        svnserve -d -r 安装目录   --listen-port 10001

