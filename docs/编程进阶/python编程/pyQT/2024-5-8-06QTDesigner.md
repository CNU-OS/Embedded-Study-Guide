# QTDesigner

辅助的图形化界面

![image-20240508183240778](https://picture-01-1316374204.cos.ap-beijing.myqcloud.com/image/202405081832937.png)

这一个界面的图形设置好以后进行保存

![image-20240508183502338](https://picture-01-1316374204.cos.ap-beijing.myqcloud.com/image/202405081835383.png)

```python
import sys

from PyQt5.QtWidgets import *
from PyQt5 import uic

if __name__ == '__main__':
    app = QApplication(sys.argv)

    ui = uic.loadUi("./2024-5-8-test.ui")
    ui.show()

    app.exec()
```

> 使用这一个可以加载这一个ui



