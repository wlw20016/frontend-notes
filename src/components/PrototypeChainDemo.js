import React, { useState, useEffect } from 'react';

export default function PrototypeChainDemo() {
  const [step, setStep] = useState(0);

  const steps = [
    { 
      target: "实例对象 p", 
      desc: "const p = new Person('张三')",
      detail: "首先在实例对象 p 自身查找属性。" 
    },
    { 
      target: "Person.prototype", 
      desc: "p.__proto__",
      detail: "找不到，顺着 __proto__ 向上，来到构造函数的原型对象。" 
    },
    { 
      target: "Object.prototype", 
      desc: "Person.prototype.__proto__",
      detail: "还找不到，继续向上，来到顶层对象原型。" 
    },
    { 
      target: "null", 
      desc: "Object.prototype.__proto__",
      detail: "最终指向 null，原型链的尽头，返回 undefined。" 
    }
  ];

  return (
    <div style={{ 
      padding: '24px', 
      border: '1px solid var(--ifm-color-emphasis-300)', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: 'var(--ifm-background-color)'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>模拟属性查找： p.toString()</h3>
      
      <div style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {steps.map((item, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              opacity: step >= index ? 1 : 0,
              transform: step >= index ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.5s ease-in-out',
              visibility: step >= index ? 'visible' : 'hidden',
              height: step >= index ? 'auto' : '0'
            }}
          >
            {/* 连接线和箭头 */}
            {index > 0 && step >= index && (
              <div style={{ 
                height: '40px', 
                width: '2px', 
                backgroundColor: 'var(--ifm-color-primary)',
                position: 'relative',
                margin: '5px 0'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '-4px',
                  width: '10px',
                  height: '10px',
                  borderBottom: '2px solid var(--ifm-color-primary)',
                  borderRight: '2px solid var(--ifm-color-primary)',
                  transform: 'rotate(45deg)'
                }}></div>
              </div>
            )}
            
            {/* 核心节点 */}
            <div style={{ 
              padding: '12px 24px', 
              background: 'var(--ifm-color-primary)', 
              color: '#fff', 
              borderRadius: '6px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              width: '240px',
              textAlign: 'center'
            }}>
              {item.target}
            </div>
            
            {/* 描述信息 */}
            <div style={{ fontSize: '14px', color: 'var(--ifm-color-emphasis-600)', marginTop: '8px', fontFamily: 'monospace' }}>
              {item.desc}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ifm-color-emphasis-700)', marginTop: '4px', maxWidth: '280px', textAlign: 'center' }}>
              {item.detail}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          className="button button--primary"
          onClick={() => setStep(s => Math.min(s + 1, steps.length - 1))}
          disabled={step === steps.length - 1}
        >
          {step === 0 ? '开始查找' : '沿着 __proto__ 向上'}
        </button>
        <button
          className="button button--secondary"
          onClick={() => setStep(0)}
          disabled={step === 0}
        >
          重置动画
        </button>
      </div>
    </div>
  );
}