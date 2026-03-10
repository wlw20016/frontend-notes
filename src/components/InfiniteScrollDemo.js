import React, { useState, useEffect, useRef } from 'react';

export default function InfiniteScrollDemo() {
  // 1. 状态管理：用来代替原生 JS 里的全局变量
  const [items, setItems] = useState([1, 2, 3]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. 引用管理：代替 document.getElementById
  const rootRef = useRef(null);     // 外部滚动容器
  const sentinelRef = useRef(null); // 哨兵元素
  
  // 使用 ref 来保存最新的 loading 状态，防止闭包陷阱
  const isLoadingRef = useRef(isLoading);
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // 3. 加载逻辑
  const loadMore = () => {
    if (isLoadingRef.current) return;
    
    setIsLoading(true);
    // 模拟网络请求
    setTimeout(() => {
      setItems((prevItems) => {
        const nextItemCount = prevItems.length;
        const newItems = Array.from({ length: 10 }).map((_, i) => nextItemCount + i + 1);
        return [...prevItems, ...newItems];
      });
      setIsLoading(false);
    }, 500);
  };

  // 4. 核心：在 useEffect 中管理 IntersectionObserver 的生命周期
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingRef.current) {
          loadMore();
        }
      },
      {
        // 重点注意这里：因为我们做了一个局部滚动的演示框，所以必须指定 root 为外层容器
        root: rootRef.current, 
        rootMargin: '0px 0px 100px 0px'
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel); // 开始监听
    }

    // 组件卸载时的清理工作：极其重要，防止内存泄漏！
    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, []); // 依赖项为空，只在组件挂载时初始化一次观察者

  return (
    // 外层容器：限定了高度，出现内部滚动条
    <div 
      ref={rootRef} 
      style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        maxHeight: '400px', // 限制高度
        overflowY: 'auto',  // 允许局部滚动
        backgroundColor: '#fff',
        padding: '10px'
      }}
    >
      <h3 style={{ textAlign: 'center', margin: '10px 0' }}>无限滚动 React 组件演示</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {items.map((item) => (
          <div 
            key={item} 
            style={{
              width: '90%', height: '80px', margin: '10px 0',
              background: '#f8f9fa', border: '1px solid #e9ecef',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color: '#495057', borderRadius: '8px'
            }}
          >
            数据项 {item}
          </div>
        ))}
      </div>

      {/* 哨兵元素 */}
      <div 
        ref={sentinelRef} 
        style={{ 
          height: '60px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: '#adb5bd', fontSize: '14px'
        }}
      >
        {isLoading ? '正在拼命加载中...' : '下拉加载更多'}
      </div>
    </div>
  );
}