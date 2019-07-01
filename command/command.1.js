#!/usr/bin/env node

const program = require('commander')
const inqurer = require('inquirer');

/**
 * options methods
 * 第一个参数 选项文档 由一个 单个字符 和一个长字符组成(长字符可以作为Command的属性访问例如：program.debug) 可以用 ","或者|分割。例如 option('-d, --debug')
 * 第二个参数 为命令的描述内容。例如 option('-d, --debug')
 * 第三个参数 给<take> 或 [type] 指定默认值
 * 
 * Common options types, boolean and value;
 * 选项的值默认为boolean类型，也可以用 "<type>"或者 "[type]" 的形式接收一个值。在未传入或调用相关命令之前两种形式的值都为undefined;
 * 可以制定一个以'on-'为开头的长命名方式指定默认值为布尔值 true 。 如果使用调用相关命令该值为false
 * 还可以为options指定一个函数 该函数接收2个参数 第一个参数是用户指定的值，第二个为上一个选项的值；该函数为options返回一个新值。
 */

// program.option('-d , --debug','describing')
//        .option('-t, --test <type>','this is testing command')
//        .option('-c, --choose <type>', 'specified type default value of choose', 'red')
//        .option('-o, --no-cheese', 'test -no command')
//        .option('-b, --brackets [type]', 'test -no command')

// program.parse(process.argv);
// if(program.debug) {
//   console.log('this is debug command: ' + program.debug)
// }
// if(program.test) {
//   console.log('this is test command:' + program.test)
// }
// console.log(program.opts())

// node .\bin\command.js -b
// { debug: undefined,
//   test: undefined,
//   choose: 'red',
//   cheese: true,
//   brackets: true }


// function addition(useValue,provide) {
//   console.log(useValue);
//   console.log(provide);
//   return `${useValue}${provide}`
// }

// program.option('-s, --save <value>','save user data',addition,'ming' )

// program.parse(process.argv);
// console.log(program.save)

// node .\bin\command.js -s xiao
// xiao
// ming 
// xiaoming

//指定版本
// program.version('0.0.1', '-v, --version');

//子命令。必须指定一个action,第一个参数用户指定的值，第二个是相关选项。选项里可以拿到上一个命令的值。 如果要让一个命令行选项接受多个参数可以在命令后面增加 [otherParams...]，此时action的第二个参数为传入的除第一个参数的值剩下的值组合成的数组。

// program.command('rm <dir> [dirs...]').option('-r , --recursive <type>', 'remove recursively').action((dir,otherDirs) => {
//   console.log(dir)
//   console.log(otherDirs)
// }) 

// program.parse(process.argv);

// tcmd rm 1 2 3
// 1
// [ '2', '3' ]

// program
//   .version('0.1.0')
//   .command('install [name]', 'install one or more packages')
//   .command('search [query]', 'search with optional query')
//   .command('list', 'list packages installed', {isDefault: true})
//   .parse(process.argv);
// program.parse(process.argv);
const questions = [
    {
        type: 'list',
        name: 'theme',
        message: 'What do you want to do?',
        choices: [
            'Order a pizza',
            'Make a reservation',
            new inqurer.Separator(),
            'Ask for opening hours',
            {
                name: 'Contact support',
                disabled: 'Unavailable at this time'
            },
            'Talk to the receptionist'
        ]
    },
    // {
    //     type: 'input',
    //     name: 'name',
    //     message: "what's your name?"
    // },
    // {
    //     type: 'input',
    //     name: 'age',
    //     message: "what's your AGE?"
    // }
]
inqurer.prompt(questions).then(answers => {
    console.log(answers)
})





