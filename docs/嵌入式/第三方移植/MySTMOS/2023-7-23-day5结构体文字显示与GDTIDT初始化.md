# day5结构体文字显示与GDT/IDT初始化

+   从之前保存在内存中的位置获取信息

```c
	binfo_scrnx = (short *) 0x0ff4;
	binfo_scrny = (short *) 0x0ff6;
	binfo_vram = (int *) 0x0ff8;
	xsize = *binfo_scrnx;
	ysize = *binfo_scrny;
	vram = (char *) *binfo_vram;
```

```assembly
SCRNX	EQU		0x0ff4			; 分辨率x
SCRNY	EQU		0x0ff6			; Y
VRAM	EQU		0x0ff8			; 图像缓冲区的位置
```

+   使用一个结构体

```c
struct BOOTINFO {
    //获取启动区, 键盘状态, 设置的颜色种类, 保留
	char cyls, leds, vmode, reserve;
    //获取长宽
	short scrnx, scrny;
    //获取地址
	char *vram;
};

void HariMain(void)
{
	char *vram;
	int xsize, ysize;
	struct BOOTINFO *binfo;

	init_palette();
    //设置结构体的位置
	binfo = (struct BOOTINFO *) 0x0ff0;
	xsize = (*binfo).scrnx;
	ysize = (*binfo).scrny;
	vram = (*binfo).vram;
    ...
}
```

```assembly
; haribote-os
; TAB=4

; BOOT_INFO娭學
CYLS	EQU		0x0ff0			; 设定启动区
LEDS	EQU		0x0ff1
VMODE	EQU		0x0ff2			; 设定颜色的数目
SCRNX	EQU		0x0ff4			; 分辨率x
SCRNY	EQU		0x0ff6			; Y
VRAM	EQU		0x0ff8			; 图像缓冲区的位置

		ORG		0xc200			; 程序的保存地址

		MOV		AL,0x13			; 设置显卡
		MOV		AH,0x00
		INT		0x10
		MOV		BYTE [VMODE],8	; 记录画面模式
		MOV		WORD [SCRNX],320
		MOV		WORD [SCRNY],200
		MOV		DWORD [VRAM],0x000a0000

; 使用BIOS获取键盘上的各种LED的状态

		MOV		AH,0x02
		INT		0x16 			; keyboard BIOS
		MOV		[LEDS],AL		; 保存状态
```

+   显示文字

```c
/*
*参数1: 显卡的地址
* 2: 一行的距离
* 3.横纵坐标
* 4.显示的颜色
* 5.字模
*/
void putfont8(char *vram, int xsize, int x, int y, char c, char *font)
{
	int i;
	char *p, d /* data */;
	for (i = 0; i < 16; i++) {
		p = vram + (y + i) * xsize + x;
		d = font[i];
		if ((d & 0x80) != 0) { p[0] = c; }
		if ((d & 0x40) != 0) { p[1] = c; }
		if ((d & 0x20) != 0) { p[2] = c; }
		if ((d & 0x10) != 0) { p[3] = c; }
		if ((d & 0x08) != 0) { p[4] = c; }
		if ((d & 0x04) != 0) { p[5] = c; }
		if ((d & 0x02) != 0) { p[6] = c; }
		if ((d & 0x01) != 0) { p[7] = c; }
	}
	return;
}
```

```c
void putfonts8_asc(char *vram, int xsize, int x, int y, char c, unsigned char *s)
{
    //获取字库
	extern char hankaku[4096];
	for (; *s != 0x00; s++) {
        //传入地址以及计算出的字模
		putfont8(vram, xsize, x, y, c, hankaku + *s * 16);
		x += 8;
	}
	return;
}
```

## GDT

在汇编文件的时候使用ORG声明程序写入的位置, 但是如果写入的位置错误, 就会出现问题

这种的使用十分的麻烦, 解决方法就是分层, 每一层的的地址看起来都是0开始的, 也可以使用分页解决

是通过段寄存器实现的, 比如MOV AL, [DS:EBX], DS保存的实际上是段的起始地址, 16位的时候则使用的是DS*16

+   表示一个段

>   段的大小
>
>   段的起始位置
>
>   段的属性管理

系统使用64位的数据表示这些信息

段寄存器使用的是16位, 但是由于低三位不能使用, 可以表示的有8191位的数字

记录的数据记录在GDT里面

```c
struct SEGMENT_DESCRIPTOR {
	short limit_low, base_low;
	char base_mid, access_right;
	char limit_high, base_high;
};
```

>   初始化的位置在0x00270000-0x0027ffff, 是随机选择的, 存在GDTR寄存器里面
>   段限长设置的是段的地址, 最小单位是G决定的, 0表示一字节, 1表示4KB
>
>   段基地址表示开始的地址,type表示的是段的属性, DPK设置的是段的限权, 设备只有有限权才可以访问, 有四级
>
>   P=1说明这一段可以使用, 如不可用使用段强行访问会发生中断
>
>   AVl是软件设置的
>
>   D/B有两种, 被type设置为代码段的时候D=1是32位程序, D=0是16位程序, 如果是向下扩展的数据段则是B, B=1代表可以访问4GB, 否则是64K, 表示的是堆栈的时候B=1表示的是esp为段顶寄存器, 否则是sp
>
>   

## IDT

中断记录表, 初始化之前最好先初始化GDT

```c
struct GATE_DESCRIPTOR {
	short offset_low, selector;
	char dw_count, access_right;
	short offset_high;
};
```

>   初始化在0x26f800-26ffff, 在0x280000-0x2f ffff的位置是bootpack.h
>
>   可以在任意地址, 由IDTR设置

>   IDT 表中可以存放三种类型的门描述符:
>
>   -   中断门描述符
>   -   陷阱门描述符
>   -   任务门描述符
>
>   中断门和陷阱门含有一个长指针(即段选择符和偏移值)，处理器使用这个长指针把程序执行权转移到代码段中的异常或中断的处理程序中。这两个段的主要区别在于处理器操作EFLAGS寄存器IF标志上。IDT中任务门描述符的格式与GDT和LDT中任务门的格式相同。
>
>   任务门描述符中含有一个任务TSS段的选择符，该任务用于处理异常和/或中断。
>

## 初始化

```c
void init_gdtidt(void)
{
	//初始化地址
	struct SEGMENT_DESCRIPTOR *gdt = (struct SEGMENT_DESCRIPTOR *) 0x00270000;//设置地址
	struct GATE_DESCRIPTOR    *idt = (struct GATE_DESCRIPTOR    *) 0x0026f800;
	int i;

	/* GDT初始化 */
	for (i = 0; i < 8192; i++) {
		set_segmdesc(gdt + i, 0, 0, 0);
	}
	set_segmdesc(gdt + 1, 0xffffffff, 0x00000000, 0x4092);//设置第一段, 大小是4GB, 地址是0, 属性是0x4092
	set_segmdesc(gdt + 2, 0x0007ffff, 0x00280000, 0x409a);//设置第一段, 大小是512K, 地址是0x00280000, 属性是0x409a, 这是为了bootpack.hrb的位置, hrb是以ORG为1为前提翻译的机器语言
	load_gdtr(0xffff, 0x00270000);

	/* IDT初始化 */
	for (i = 0; i < 256; i++) {
		set_gatedesc(idt + i, 0, 0, 0);
	}
    //设置GDTR寄存器
	load_idtr(0x7ff, 0x0026f800);

	return;
}
void set_segmdesc(struct SEGMENT_DESCRIPTOR *sd, unsigned int limit, int base, int ar)
{
	if (limit > 0xfffff) {
		ar |= 0x8000; /* G_bit = 1 */
		limit /= 0x1000;
	}
	sd->limit_low    = limit & 0xffff;
	sd->base_low     = base & 0xffff;
	sd->base_mid     = (base >> 16) & 0xff;
	sd->access_right = ar & 0xff;
	sd->limit_high   = ((limit >> 16) & 0x0f) | ((ar >> 8) & 0xf0);
	sd->base_high    = (base >> 24) & 0xff;
	return;
}
//第一个参数是地址, 第二个参数是函数指针, 第三个参数是段地址, 第四个参数是段的属性
void set_gatedesc(struct GATE_DESCRIPTOR *gd, int offset, int selector, int ar)
{
	gd->offset_low   = offset & 0xffff;
	gd->selector     = selector;
	gd->dw_count     = (ar >> 8) & 0xff;
	gd->access_right = ar & 0xff;
	gd->offset_high  = (offset >> 16) & 0xffff;
	return;
}
```

```assembly
_load_gdtr:		; void load_gdtr(int limit, int addr);
		MOV		AX,[ESP+4]		; limit
		MOV		[ESP+6],AX
		LGDT	[ESP+6]
		RET

_load_idtr:		; void load_idtr(int limit, int addr);
		MOV		AX,[ESP+4]		; limit
		MOV		[ESP+6],AX
		LIDT	[ESP+6]
		RET
```



































