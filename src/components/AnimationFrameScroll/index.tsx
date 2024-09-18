/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useRef, useEffect } from 'react'
import classNames from 'classnames'
import './index.css'

// 防抖
export const debounce = (fn: (...args: any[]) => void, delay: number = 200) => {
  let timer: number | null = null
  // 闭包
  return (...args: any[]) => {
    // 判断还在定时，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      return fn(...args)
    }, delay)
  }
}

interface AnimationFrameScrollProps {
  steep?: number //滚动速度，默认是1
  scrollDirection?: string //滚动方向，默认向上滚动
  isRoller?: boolean //是否可以滑轮滚动，默认true
  isHoverStop?: boolean //是否鼠标hover停止滚动，默认true
  rollerScrollDistance?: number //滑轮滚动的距离,默认是5
  className?: string //自定义class
  style?: React.CSSProperties //自定义style
}

const AnimationFrameScroll: React.FC<
  React.PropsWithChildren<AnimationFrameScrollProps>
> = memo(function ({
  steep = 1,
  scrollDirection = 'top',
  isRoller = true,
  isHoverStop = true,
  rollerScrollDistance = 5,
  children,
  className,
  style = {},
}) {
  //滚动距离
  const scrollDistance = useRef(0)
  //滚动容器高度
  const bodyHeight = useRef(0)
  //滚动容器宽度
  const bodyWidth = useRef(0)
  //列表高度
  const listHeight = useRef(0)
  //列表宽度
  const listWidth = useRef(0)
  // 最大滚动距离
  const maxScrollDistance = useRef(0)
  // 是否停止滚动
  const isStop = useRef(false)
  // 是否可以滚动
  const isCanScroll = useRef(true)
  const animationFrame = useRef<null | number>(null)
  const scrollBody = useRef<HTMLDivElement>(null)
  const listBody = useRef<HTMLDivElement>(null)
  const listBody2 = useRef<HTMLDivElement>(null)
  // 是否横向滚动
  const isHorizontal = scrollDirection === 'left' || scrollDirection === 'right'
  const st =
    scrollDirection === 'top' || scrollDirection === 'left' ? steep : -steep

  /**
   * 停止requestAnimationFrame
   */
  const clearAnimation = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }
  }

  /**
   * 初始化滚动距离
   * @param listSize 列表总高度或宽度
   * @param bodySize 滚动容器高度或宽度
   */
  const initScrollDistance = (listSize: number, bodySize: number) => {
    const tempScrollDistance = Math.abs(scrollDistance.current)
    if (scrollDistance.current < 0) {
      if (tempScrollDistance >= maxScrollDistance.current) {
        scrollDistance.current = -(listSize - bodySize)
      }
    } else {
      scrollDistance.current = -listSize
    }
  }

  /**
   * requestAnimationFrame计算移动距离
   */
  const run = () => {
    isHorizontal
      ? initScrollDistance(listWidth.current, bodyWidth.current)
      : initScrollDistance(listHeight.current, bodyHeight.current)

    !isStop.current && (scrollDistance.current -= st)
    const style = isHorizontal
      ? `translate(${scrollDistance.current}px, 0px)`
      : `translate(0px, ${scrollDistance.current}px)`

    listBody.current!.style.transform = style
    listBody2.current!.style.transform = style

    animationFrame.current = window.requestAnimationFrame(run)
  }

  /**
   * 初始化数据并判断时候要滚动
   */
  const initData = () => {
    console.log('-------initData--------')
    if (scrollBody.current && listBody.current && listBody2.current) {
      scrollDistance.current = 0
      bodyHeight.current = scrollBody.current.clientHeight
      bodyWidth.current = scrollBody.current.clientWidth
      listHeight.current = listBody.current.clientHeight
      listWidth.current = listBody.current.clientWidth

      // 赋值最大滚动距离
      maxScrollDistance.current = isHorizontal
        ? 2 * listWidth.current - bodyWidth.current
        : 2 * listHeight.current - bodyHeight.current

      if (
        listHeight.current > bodyHeight.current ||
        listWidth.current > bodyWidth.current
      ) {
        // 需要滚动的情况
        isCanScroll.current = true
        listBody2.current.className = listBody.current.className
        listBody2.current.innerHTML = listBody.current.innerHTML
        start()
      } else {
        // 不需要滚动的情况
        isCanScroll.current = false
        listBody2.current.innerHTML = ''
        listBody2.current.className = ''
        listBody.current.style.transform = `translate(0px, 0px)`
        stop()
      }
    }
  }

  /**
   * 开始滚动
   */
  const start = () => {
    isStop.current = false
    clearAnimation()
    isCanScroll.current && run()
  }

  /**
   * 停止滚动
   */
  const stop = () => {
    isStop.current = true
    clearAnimation()
  }

  /**
   * 鼠标移入事件
   */
  const onMouseenter = () => {
    isHoverStop && stop()
  }

  /**
   * 鼠标移出事件
   */
  const onMouseleave = () => {
    isHoverStop && start()
  }

  /**
   * 滚轮事件
   */
  const onmMousewheel = (e: any) => {
    if (!isCanScroll.current || !isRoller) {
      return false
    }
    const dis = e.deltaY
    if (dis > 0) {
      scrollDistance.current -= rollerScrollDistance
    } else {
      scrollDistance.current += rollerScrollDistance
    }
    clearAnimation()
    run()
  }

  const resizeObserver = new ResizeObserver(debounce(initData, 300))

  useEffect(() => {
    if (scrollBody.current) {
      resizeObserver.observe(scrollBody.current)
    }
    return () => {
      resizeObserver.disconnect()
      clearAnimation()
    }
  }, [scrollBody, scrollDirection])

  return (
    <div
      className={classNames('custom-list', className)}
      ref={scrollBody}
      onMouseEnter={onMouseenter}
      onMouseLeave={onMouseleave}
      onWheel={onmMousewheel}
      style={{ ...style }}
    >
      <div
        ref={listBody}
        className={classNames('list-body', {
          'list-body-horizontal': isHorizontal,
          'list-body-scroll': isCanScroll.current,
        })}
      >
        {React.Children.map(children, (item: React.ReactNode) => (
          <div>{item}</div>
        ))}
      </div>

      <div ref={listBody2}></div>
    </div>
  )
})

export default AnimationFrameScroll
