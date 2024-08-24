# 认识sed和gawk

处理文本文件内容

## 文本处理

自动处理大量文件的时候, 使用命令行编辑器会方便一些

### sed编辑器

被称为**流编辑器**, 流编辑器会在编辑器处理数据之前基于预先提供的一组规则来编辑数据流

这些命令要么从命令行中输入，要么存储在一个命令文本文件中。sed编辑器会执行下列操作

(1) 一次从输入中读取一行数据。

(2) 根据所提供的编辑器命令匹配数据。

(3) 按照命令修改流中的数据。

(4) 将新的数据输出到STDOUT。

```bash
sedoptions script file
```

|   选项    |                         描述                         |
| :-------: | :--------------------------------------------------: |
| -e script | 在处理输入时，将script中指定的命令添加到已有的命令中 |
|  -f file  |  在处理输入时，将file中指定的命令添加到已有的命令中  |
|    -n     |       不产生命令输出，使用print命令来完成输出        |

script参数指定了应用于流数据上的单个命令。如果需要用多个命令，要么使用-e选项在命令行中指定，要么使用-f选项在单独的文件中指定。

#### 在命令行定义编辑器命令

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/18$ echo "This is a test" | sed 's/test/big test/'
This is a big test
```

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat data1.txt 
The quick brown fox jumps over the lazy dog. 
The quick brown fox jumps over the lazy dog. 
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed 's/dog/cat/' data1.txt 
The quick brown fox jumps over the lazy cat. 
The quick brown fox jumps over the lazy cat. 
The quick brown fox jumps over the lazy cat.
The quick brown fox jumps over the lazy cat.
```

>   sed编辑器并不会修改文本文件的数据。它只会将修改后的数据发送到STDOUT

#### 在命令行上使用多个命令

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed -e 's/dog/cat/; s/brown/green/' data1.txt 
The quick green fox jumps over the lazy cat. 
The quick green fox jumps over the lazy cat. 
The quick green fox jumps over the lazy cat.
The quick green fox jumps over the lazy cat.
```

>   命令之间必须用分号隔开，并且在命令末尾和分号之间不能有空格

+   如果不想用分号，也可以用bash shell中的次提示符来分隔命令。只要输入第一个单引号标示出sed程序脚本的起始（sed编辑器命令列表），bash会继续提示你输入更多命令，直到输入了标示结束的单引号

```bash
$ sed -e ' 
> s/brown/green/ 
> s/fox/elephant/ 
> s/dog/cat/' data1.txt 
The quick green elephant jumps over the lazy cat. 
The quick green elephant jumps over the lazy cat. 
The quick green elephant jumps over the lazy cat. 
The quick green elephant jumps over the lazy cat.
```

#### 从文件中读取编辑器命令

最后，如果有大量要处理的sed命令，那么将它们放进一个单独的文件中通常会更方便一些。可以在sed命令中用-f选项来指定文件

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat scrip1.sad 
s/brown/green/
s/fox/elephant/
s/dog/cat/

jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed -f scrip1.sad data1.txt 
The quick green elephant jumps over the lazy cat. 
The quick green elephant jumps over the lazy cat. 
The quick green elephant jumps over the lazy cat.
The quick green elephant jumps over the lazy cat.
```

### gawk程序

通常你需要一个用来处理文件中的数据的更高级工具，它能提供一个类编程环境来修改和重新组织文件中的数据。这正是gawk能够做到的

它提供了一种编程语言而不只是编辑器命令。

+   定义变量来保存数据；
+   使用算术和字符串操作符来处理数据；
+   使用结构化编程概念（比如if-then语句和循环）来为数据处理增加处理逻辑；
+   通过提取数据文件中的数据元素，将其重新排列或格式化，生成格式化报告

#### gawk命令格式

```bash
gawkoptions program file
```

|     选项     |                描述                |
| :----------: | :--------------------------------: |
|    -F fs     |  指定行中划分数据字段的字段分隔符  |
|   -f file    |       从指定的文件中读取程序       |
| -v var=value | 定义gawk程序中的一个变量及其默认值 |
|    -mf N     | 指定要处理的数据文件中的最大字段数 |
|    -mr N     |    指定数据文件中的最大数据行数    |
|  -W keyword  |    指定gawk的兼容模式或警告等级    |

#### 从命令读取程序脚本

gawk程序脚本用一对花括号来定义。你必须将脚本命令放到两个花括号（{}）中

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ gawk '{print "hello world"}'
123
hello world
321
hello world
456
hello world
```

>   没有在命令行上指定文件名，所以gawk程序会从STDIN接收数据。在运行这个程序时，它会一直等待从STDIN输入的文本
>
>   gawk程序会针对数据流中的每行文本执行程序脚本。由于程序脚本被设为显示一行固定的文本字符串，因此不管你在数据流中输入什么文本，都会得到同样的文本输出

bash  shell提供了一个组合键来生成EOF（End-of-File）字符。Ctrl+D组合键会在bash中产生一个EOF字符。这个组合键能够终止该gawk程序并返回到命令行界面提示符下

#### 使用数据字段变量

gawk的主要特性之一是其处理文本文件中数据的能力。它会自动给一行中的每个数据元素分配一个变量

+   $0代表整个文本行；
+   $1代表文本行中的第1个数据字段；
+   $2代表文本行中的第2个数据字段；
+   $n代表文本行中的第n个数据字段。

>   gawk在读取一行文本时，会用预定义的字段分隔符划分每个数据字段。gawk中默认的字段分隔符是任意的空白字符（例如空格或制表符）

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ gawk '{print $1}' data2.txt 
One
Two
Three
Fore
Five
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat data2.txt 
One Line of test text
Two Line of test text
Three Line of test text
Fore Line of test text
Five Line of test text
```

>   如果你要读取采用了其他字段分隔符的文件，可以用-F选项指定

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ gawk -F: '{print $1}' /etc/passwd
root
daemon
bin
sys
sync
games
man
...
```

#### 使用多个命令

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ echo "My name is dhx" | gawk '{$4="2b"; print $0}'
My name is 2b
```

>   也可以用次提示符一次一行地输入程序脚本命令

>   没有在命令行中指定文件名，gawk程序会从STDIN中获得数据

#### 从文件中读取程序

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat scrip2.sed 
{print $1 "'s home direction is'" $6}
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ gawk -F: -f scrip2.sed /etc/passwd
root's home direction is'/root
daemon's home direction is'/usr/sbin
bin's home direction is'/bin
sys's home direction is'/dev
...
```

>   可以在程序文件中指定多条命令。要这么做的话，只要一条命令放一行即可，不需要用分号, 在一个大括号中

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat scrip2.sed 
{
	text="'s home direction is'"
	print $1 text $6
}
```

#### 在处理数据前运行脚本

默认情况下，gawk会从输入中读取一行文本，然后针对该行的数据执行程序脚本。有时可能需要在处理数据前运行脚本，比如为报告创建标题

BEGIN关键字就是用来做这个的。它会强制gawk在读取数据前执行BEGIN关键字后指定的程序脚本

但在它显示了文本后，它会快速退出，不等待任何数据。如果想使用正常的程序脚本中处理数据，必须用另一个脚本区域来定义程序

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ gawk 'BEGIN {print "The data1 File Contents"}
> {print $0}' data1.txt
The data1 File Contents
The quick brown fox jumps over the lazy dog. 
The quick brown fox jumps over the lazy dog. 
The quick brown fox jumps over the lazy dog.
```

#### 在处理数据后运行脚本

END关键字允许你指定一个程序脚本，gawk会在读完数据后执行它

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ gawk 'BEGIN {print "The data1 File Contents"}
{print $0}
END { printf "End of file"}' data1.txt
The data1 File Contents
The quick brown fox jumps over the lazy dog. 
The quick brown fox jumps over the lazy dog. 
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
End of file
```

```bash
  1 BEGIN {                                                                               
  2     print "The latest list of user and shell"
  3     print "UserID \t shell"
  4     print "-------\t-------"
  5     FS=":"
  6 }
  7 {
  8 print $1 "        \t " $7
  9 }
 10 
 11 END {
 12     print "This conclude the listing"
 13 }


jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ gawk -f scrip4.gawk /etc/passwd
The latest list of user and shell
UserID 	 shell
-------	-------
root        	 /bin/bash
daemon        	 /usr/sbin/nologin
bin        	 /usr/sbin/nologin

```

## sed编辑器基础

### 更多替换选项

#### 替换标记

替换命令在替换多行中的文本时能正常工作，但默认情况下它只替换每行中出现的第一处。要让替换命令能够替换一行中不同地方出现的文本必须使用**替换标记**

替换标记会在替换命令字符串之后设置

```bash
s/pattern/replacement/flags
```

有4种可用的替换标记：

+   数字，表明新文本将替换第几处模式匹配的地方；
+   g，表明新文本将会替换所有匹配的文本；
+   p，表明原先行的内容要打印出来；
+   w file，将替换的结果写到文件中。

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed 's/test/trail/' data3.txt  # 替换第一个
Line1 trail test
Line2 trail test
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed 's/test/trail/2' data3.txt # 替换第二个
Line1 test trail
Line2 test trail
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed 's/test/trail/g' data3.txt # 替换第三个
Line1 trail trail
Line2 trail trail
```

+   p替换标记会打印与替换命令中指定的模式匹配的行。这通常会和sed的-n选项一起使用。-n选项将禁止sed编辑器输出。但p替换标记会输出修改过的行。将二者配合使用的效果就是只输出被替换命令修改过的行

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat data3.txt 
Line1 test test
Line2 trial trial
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed -n 's/test/trial/p' data3.txt 
Line1 trial test
```

+   w替换标记会产生同样的输出，不过会将输出保存到指定文件中

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed 's/test/trial/w test.txt' data3.txt 
Line1 trial test
Line2 trial trial
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat test.txt 
Line1 trial test
```

>   而只有那些包含匹配模式的行才会保存在指定的输出文件中

#### 替换字符

时你会在文本字符串中遇到一些不太方便在替换模式中使用的字符。Linux中一个常见的例子就是正斜线（/）

```bash
 sed 's/\/bin\/bash/\/bin\/csh/' /etc/passwd 
```

>   要解决这个问题，sed编辑器允许选择其他字符来作为替换命令中的字符串分隔符

```bash
sed 's!/bin/bash!/bin/csh!' /etc/passwd 
```

### 使用地址

如果只想将命令作用于特定行或某些行，则必须用行寻址

有两种方法可以指定地址

```bash
[address]command
```

```bash
address {     
	command1
    command2  
    command3
}
```

#### 数字方式寻址

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed '2s/dog/cat/' data1.txt 
The quick brown fox jumps over the lazy dog. 
The quick brown fox jumps over the lazy cat. 
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
```

+   sed编辑器只修改地址指定的第二行的文本。这里有另一个例子，这次使用了行地址区间

```bash
sed '2,3s/dog/cat/' data1.txt
```

+   如果想将命令作用到文本中从某行开始的所有行，可以用特殊地址——美元符

```bash
sed '2,$s/dog/cat/' data1.txt
```

#### 使用文本模式过滤器

sed编辑器允许指定文本模式来过滤出命令要作用的行

```bash
/pattern/command
```

必须用正斜线将要指定的pattern封起来。sed编辑器会将该命令作用到包含指定文本模式

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed '/jiao/s/bash/csh/' /etc/passwd
gdm:x:126:132:Gnome Display Manager:/var/lib/gdm3:/bin/false
jiao:x:1000:1000:jiao,,,:/home/jiao:/bin/csh
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
sshd:x:127:65534::/run/sshd:/usr/sbin/nologin
```

>   sed编辑器在文本模式中采用了一种称为正则表达式（regular expression）的特性来帮助你创建匹配效果更好的模式

#### 命令组合

在单行上处理多个命令

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed '2{
> s/fox/elephant/
> s/dog/cat/
> }' data1.txt
The quick brown fox jumps over the lazy dog. 
The quick brown elephant jumps over the lazy cat. 
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
```

### 删除行

删除命令d名副其实，它会删除匹配指定寻址模式的所有行。使用该命令时要特别小心，如果你忘记加入寻址模式的话，流中的所有文本行都会被删除

当和指定地址一起使用时，删除命令显然能发挥出最大的功用。可以从数据流中删除特定的文本行，通过行号指定

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed '3d' data2.txt 
One Line of test text
Two Line of test text
Four Line of test text
Five Line of test text
```

sed编辑器的模式匹配特性也适用于删除命令

```bash
$ sed '/number 1/d' data6.txt This is line number 2. This is line number 3. This is line number 4
```

也可以使用两个文本模式来删除某个区间内的行，但这么做时要小心。你指定的第一个模式会“打开”行删除功能，第二个模式会“关闭”行删除功能。sed编辑器会删除两个指定行之间的所有行（包括指定的行）

```bash
sed '/1/,/3/d' data6.txt 
```

>   删除一到三行

+   因为只要sed编辑器在数据流中匹配到了开始模式，删除功能就会打开。这可能会导致意外的结果

```bash
$ cat data7.txt 
This is line number 1. 
This is line number 2.
This is line number 3. 
This is line number 4. 
This is line number 1 again.
This is text you want to keep.
This is the last line in the file.
$ 
$ sed '/1/,/3/d' data7.txt 
This is line number 4
```

### 插入和附加文本

+   插入（insert）命令（i）会在指定行前增加一个新行；
+   附加（append）命令（a）会在指定行后增加一个新行。

它们不能在单个命令行上使用。你必须指定是要将行插入还是附加到另一行。格式如下

```bash
sed '[address]command\new line' 
```

new line中的文本将会出现在sed编辑器输出中你指定的位置。记住，当使用插入命令时，文本会出现在数据流文本的前面

当使用附加命令时，文本会出现在数据流文本的后面

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ echo "Test Line 2" | sed 'a\Test Line 1'
Test Line 2
Test Line 1
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ echo "Test Line 2" | sed 'i\Test Line 1'
Test Line 1
Test Line 2
```

要向数据流行内部插入或附加数据，你必须用寻址来告诉sed编辑器你想让数据出现在什么位置

可以在用这些命令时只指定一个行地址。可以匹配一个数字行号或文本模式，但不能用地址区间。

```bash
$ sed '3i\ > This is an inserted line.' data6.txt 
This is line number 1. 
This is line number 2.
This is an inserted line.
This is line number 3. 
This is line number 4. 
$ 
$sed '3a\ > This is an appended line.' data6.txt 
This is line number 1.
This is line number 2. 
This is line number 3.
This is an appended line.
This is line number 4.
```

想要将新行附加到数据流的末尾，只要用代表数据最后一行的美元符就可以了

```bash
 sed '$a\
 > This is a new line of text.' data6.txt
```

同样的方法也适用于要在数据流起始位置增加一个新行。只要在第一行之前插入新行即可。

要插入或附加多行文本，就必须对要插入或附加的新文本中的每一行使用反斜线，直到最后一行。

```bash
$ sed '1i\ 
> This is one line of new text.\ 
> This is another line of new text.' data6.txt
```

### 修改行

允许修改整行的文本内容

跟插入和附加命令的工作机制一样，你必须在sed命令中单独指定新行

```bash
$ sed '3c\ > This is a changed line of text.' data6.txt 
This is line number 1. 
This is line number 2.
This is a changed line of text. 
This is line number 4.
```

文本模式修改命令会修改它匹配的数据流中的任意文本行

你可以在修改命令中使用地址区间，但结果未必如愿。sed编辑器会用这一行文本来替换数据流中的两行文本，而不是逐一修改这两行文本。

```bash
$ sed '2,3c\ > This is a new line of text.'data6.txt 
This is line number 1.
This is a new line of text.
This is line number 4.
```

### 转换命令

命令（y）是唯一可以处理单个字符的sed编辑器命令

```bash
[address]y/inchars/outchars/
```

转换命令会对inchars和outchars值进行一对一的映射。inchars中的第一个字符会被转换为outchars中的第一个字符, 第二个字符会被转换成outchars中的第二个字符。这个映射过程会一直持续到处理完指定字符。如果inchars和outchars的长度不同，则sed编辑器会产生一条错误消息

```bash
$ sed 'y/123/789/' data8.txt 
This is line number 7. 
This is line number 8. 
This is line number 9. 
This is line number 4. 
This is line number 7 again.
This is yet another line. 
This is the last line in the file.
```

>   会转换所有匹配得上的字符, 所有的数据都会被进行转换

### 回顾打印

有几个命令用来作用于打印的数据流中

+   p用来打印文本行
+   等号用来打印行号
+   l(小写L)用来列出行

#### 打印行

和替换命令中的p标记类似, 可以打印输出的一行, 通常用来打印匹配的行

```bash
$ cat data6.txt 
This is line number 1.
This is line number 2.
This is line number 3.
This is line number 4.
$ 
$ sed -n '/number 3/p' data6.txt 
This is line number 3.
```

也可以用它来快速打印数据流中的某些行

```bash
$ sed -n '2,3p' data6.txt 
This is line number 2. 
This is line number 3.
```

可以在对行进行修改之前打印一遍行

```bash
$ sed -n '/3/{ > p > s/line/test/p > }'data6.txt 
This is line number 3. 
This is test number 3.
```

#### 打印行号

使用等号会在每一行打印出当前的行号

行号由当前的换行符决定

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed '=' data1.txt 
1
The quick brown fox jumps over the lazy dog. 
2
The quick brown fox jumps over the lazy dog. 
3
The quick brown fox jumps over the lazy dog.
4
The quick brown fox jumps over the lazy dog.
```

可以用在数据流中查找对应的行

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed -n '/Three/{
> =
> p
> }' data2.txt
3
Three Line of test text
```

#### 列出行

打印出不可见的ASCII字符

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed -n 'l' data4.txt 
This is\t\ta\ttest$
```

### 使用sed处理文件

替换命令包含一些可以用于文件的标记。还有一些sed编辑器命令也可以实现同样的目标，不需要非得替换文本

#### 写入文件

w命令用来向文件写入行。该命令的格式如下

```bash
[address]w filename
```

>   运行sed编辑器的用户都必须有文件的写权限。

>   地址可以是sed中支持的任意类型的寻址方式，例如单个行号、文本模式、行区间或文本模式

```bash
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ sed '1,2w test.txt' data2.txt 
One Line of test text
Two Line of test text
Three Line of test text
Fore Line of test text
Five Line of test text
jiao@jiao-virtual-machine:~/桌面/linux-shell/19$ cat test.txt 
One Line of test text
Two Line of test text
```

#### 从文件读取数据

读取（read）命令（r）允许你将一个独立文件中的数据插入到数据流中

```bash
[address]r filename
```

你在读取命令中使用地址区间，只能指定单独一个行号或文本模式地址。sed编辑器会将文件中的文本插入到指定地址后

```bash
$ cat data12.txt 
This is an added line. 
This is the second added line. 
$
$ sed '3r data12.txt' data6.txt 
This is line number 1. 
This is line number 2. 
This is line number 3. 
This is an added line.
This is the second added line. 
This is line number 4.
```

+   可以和删除符号一起使用用来处理占位符

```bash
$ cat notice.std Would the following people:
LIST                                    # 占位符
please report to the ship's captain.
$ sed '/LIST/{ 
> r data11.txt 						  # 加入文本
> d 								 # 删除原来的
> }' notice.std 
Would the following people:
Blum, R       Browncoat 
McGuiness, A  Alliance 
Bresnahan, C  Browncoat
Harken, C     Alliance
please report to the ship's captain.
```



































































