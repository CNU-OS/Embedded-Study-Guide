# Day2汇编指令以及Makefile

```c
; hello-os
; TAB=4

		ORG		0x7c00			; 记录程序加载的地方

; 用于标准的Fat12格式

		JMP		entry
		DB		0x90
		DB		"HELLOIPL"	
		DW		512				
		DB		1				
		DW		1			
		DB		2			
		DW		224				
		DW		2880			
		DB		0xf0			
		DW		9				
		DW		18			
		DW		2				
		DD		0				
		DD		2880			
		DB		0,0,0x29		
		DD		0xffffffff	
		DB		"HELLO-OS   "	
		DB		"FAT12   "		
		RESB	18				

; 核心程序

entry:
		MOV		AX,0			; 初始化寄存器
		MOV		SS,AX
		MOV		SP,0x7c00
		MOV		DS,AX
		MOV		ES,AX

		MOV		SI,msg
putloop:
		MOV		AL,[SI]			;获取一个字符
		ADD		SI,1			; SI加一
		CMP		AL,0
		JE		fin
		MOV		AH,0x0e			; 显示一个文字
		MOV		BX,15			; 指定文字的颜色
		INT		0x10			; 使用BIOS的中断函数
		JMP		putloop
fin:
		HLT						; CPU停止, 等待
		JMP		fin				; 循环

msg:
		DB		0x0a, 0x0a		; 实际的打印内容
		DB		"hello, world"
		DB		0x0a			
		DB		0

		RESB	0x7dfe-$		

		DB		0x55, 0xaa


; 启动区之外的输出
		DB		0xf0, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00
		RESB	4600
		DB		0xf0, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00
		RESB	1469432

```

>   ORG: 开始执行的时候把机器指令加载到的位置, 这里是0x7c00

+   AX: 累加寄存器
+   CX: 计数寄存器
+   DX: 数据寄存器
+   BX: 基址寄存器
+   SP: 栈地址寄存器
+   BP: 基地址寄存器
+   SI: 源变址寄存器
+   DI: 目的变址寄存器

>   以上的寄存器是16位的

+   AL: 累加寄存器低位
+   CL: 计数寄存器低位
+   DL: 数据寄存器低位
+   BL: 基地址寄存器低位
+   AH: 高位
+   CH
+   DH
+   BH

AX的低8位是AL

>   以上的是八位的

EAX, ECX, EDX, EBX, ESP, EBP, ESI, EDI

>   这是32位的寄存器

只有BX, BP, SI, DI这几个寄存器的值可以使用[ x ]来进行取地址

+   BOIS

储存在电脑的主板上面的ROM里面, INT16是用来控制显卡的

AH = 0x0e, AL: character code, BH=0, BL=color code, 返回值无

+   初始地址

最开始的内存是BIOS实现功能使用的, 在0xf000附近存在BIOS本体

在0xfc00到0xfdff是启动区的位置

## Makefile

>   1.  "make -r"选项用于指示make命令在解析Makefile时不使用默认的规则和隐式规则。这个选项通常用于覆盖默认的行为，以便更精确地控制构建过程。
>   2.  当使用`make -C`命令时，`-C`选项用于指定要在其中执行`make`命令的目录。这对于在不同的目录中构建和管理代码非常有用。

```makefile

# 默认

default :
	../z_tools/make.exe img

# 实际的生成规则

ipl.bin : ipl.nas Makefile
	../z_tools/nask.exe ipl.nas ipl.bin ipl.lst

helloos.img : ipl.bin Makefile
	../z_tools/edimg.exe   imgin:../z_tools/fdimg0at.tek \
		wbinimg src:ipl.bin len:512 from:0 to:0   imgout:helloos.img

# 

asm :
	../z_tools/make.exe -r ipl.bin
# 这个是之后启动虚拟机使用的文件
img :
	../z_tools/make.exe -r helloos.img
# 生成img文件之后启动
run :
	../z_tools/make.exe img
	copy helloos.img ..\z_tools\qemu\fdimage0.bin
	../z_tools/make.exe -C ../z_tools/qemu
# 这个是安装命令, 一般不需要
install :
	../z_tools/make.exe img
	../z_tools/imgtol.com w a: helloos.img

clean :
	-del ipl.bin
	-del ipl.lst

src_only :
	../z_tools/make.exe clean
	-del helloos.img

```

```c
default :
	qemu-win.bat
```

>   run最后调用的

```bat
@set SDL_VIDEODRIVER=windib
@set QEMU_AUDIO_DRV=none
@set QEMU_AUDIO_LOG_TO_MONITOR=0
qemu.exe -L . -m 32 -localtime -std-vga -fda fdimage0.bin
```

