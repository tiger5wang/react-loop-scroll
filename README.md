# react-loop-scroll

react 循环滚动列表

## Getting Started

安装依赖

```bash
$ npm install
$ pnpm install
$ yarn
```

启动服务

```bash
$ pnpm run dev
```

## Props

| 属性名               | 类型                | 默认值 | 说明                                                       |
| -------------------- | ------------------- | ------ | ---------------------------------------------------------- | --- |
| step                 | number              | 1      | 滚动速度                                                   |
| scrollDirection      | string              | 'top'  | 滚动方向，'top'向上，'bottom'向下，'left'向左，'right'向右 |
| isRoller             | boolean             | true   | 是否可以滑轮滚动                                           |     |
| isHoverStop          | boolean             | true   | 是否鼠标 hover 停止滚动                                    |
| rollerScrollDistance | number              | 5      | 滑轮滚动的距离                                             |
| className            | string              | ''     | 自定义 class                                               |
| style                | React.CSSProperties | {}     | 自定义 style                                               |

## Example

```jsx
import React from 'react'
import { LoopScroll } from 'react-loop-scroll'

const App = () => {
  return (
    <LoopScroll scrollDirection="top" style={{ height: '400px' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{
            height: '50px',
            width: '80px',
            border: '1px solid black',
          }}
        >
          滚动元素{i}
        </div>
      ))}
    </LoopScroll>
  )
}

export default App
```
