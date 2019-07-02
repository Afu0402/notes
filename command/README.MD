# 用node.js开发一个简单的命令行工具。

## 简要
在日常开发中像vue-cli，create-react-dev这种命令行工具可以很方便的快速搭建好一个新项目。那在自己平常的工作中或自己使用的情况下中，公司内部或者个人会有肯定也会封装一些贴近公司风格的开发模板。一些小的库。或者个人也会有自己开发的一些小工具。我们也可以尝试开发这么一个命令行工具。


## 目标
* 命令行交互方式创建项目并生成相应的开发文件。
* 通过Npm包进行管理，方便使用。
* 可以支持添加多种模板

## 准备工作
需要引入如下包
* commander 一个方便开发node.js命令行工具的库。
* download-git-repo 可以在后台直接拉取github,gitlab等第三方代码管理库的项目代码。
* inquirer 一个方便开发命令行交互的库。
* ora 在命令行里显示Loading...等效果。
* read-metadata 读取json文件并生成一个简单的对象。
## 思路
先在package.json里面把命令映射的到相应的文件

    "bin": {
      "afu-dev-cli": "./bin/command.js"
      } ,

然后运行 npm link 把afu-dev-cli 链接到全局的环境变量里。就可以直接使用afu-dev-cli xxx 运行命令。


    const program = require('commander');
    const inqurer = require('inquirer');

    program 
    .version(require('../package.json').version)
    .command('create <name>')
    .description('select project template and generate project')
    .action((name) => {
        inqurer.prompt(list).then(answers => {
            pullProjectAndRewritePackage(answers.template,name)
        })
    })
上面的代码是利用commander这个库添加 "create" 这个命令 该命令接受一个参数<name> 也就是即将要创建的项目名和文件名 例如 afu-dev-cli create your-project-name.
action 定义了当触发这个命令的时候要做的事情，这里的参数name就是用户传进来的 项目名参数。这里是直接调用了

    inqurer.prompt(list).then(answers => {
            pullProjectAndRewritePackage(answers.template,name)
        })

这里的 inqurer.prompt 就是提供命令行交互的库 他会生成一个模板列表供用户选择。接下来直接调用了 “pullProjectAndRewritePackage” 函数：

    
    const ora = require('ora');
    const download = require('download-git-repo');
    const spinner = ora('Loading...');

    const pullProjectAndRewritePackage = (template, dir) => {
      spinner.start();
      download(`Afu0402/${template}`, dir, function(error) {
        if (error) {
          spinner.fail(error.message);
        } else {
          rewriterPackageJson(dir);
          spinner.succeed(
            `success and into ${dir} and run npm install or yarn install`
          );
          process.exit(1);
        }
      });
    };

pullProjectAndRewritePackage 函数总共做了如下几件事：  
* 打开Loadng...效果 因为生成项目需要花费一些时间。
* 根据用户定义好的模板去仓库下载相应的模板文件。
* 调用 rewriterPackageJson 函数修改package.json里面的内容（目前主要修改项目名和版本号
* 关掉Loading提示用户模板代码生成成功 并退出进程。

## 结语
利用这个命令行工具可以把一些常用的开发模板放进去，这样以后想用的时候就不需要复制黏贴手动修改项目名等重复工作。当然命令行工具的威力不仅仅如此。你甚至可以一键打包后并自动上传到服务器更新线上代码。只要你足够懒，想让程序自动帮你干些事，就可以试试开发一个属于自己的命令行工具。

afu-dev-cli项目地址：https://github.com/Afu0402/afu-dev-cli


相关工具库文档地址：  
* ora: https://github.com/sindresorhus/ora
* inquirer: https://github.com/SBoudrias/Inquirer.js
* commander: https://github.com/tj/commander.js
* download-git-repo: https://github.com/flipxfx/download-git-repo
* read-metadata: https://www.npmjs.com/package/read-metadata





