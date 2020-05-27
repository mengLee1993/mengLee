**gulp安装(服务器)**

    gulp: command not found 解决

    问题：执行 npm install -g gulp 后， 执行 gulp -v 查看当前版本，出现 gulp: command not found 错误提示， package.json 的 devDependencies 里也木有 gulp 依赖。

    解决：重设路径后再执行 npm install -g gulp 就可以正常安装了。   #npm config set prefix /usr/local

