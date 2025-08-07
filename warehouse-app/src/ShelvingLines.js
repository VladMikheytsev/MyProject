import React from 'react';

const ShelvingLines = ({ orientation = 'vertical' }) => {
  const lineStyle = { position: 'absolute', backgroundColor: 'rgb(20, 18, 16)' };
  if (orientation === 'vertical') {
    const style1 = { ...lineStyle, height: '2px', width: '100%', top: '0', left: '0' };
    const style2 = { ...lineStyle, height: '2px', width: '100%', bottom: '0', left: '0' };
    return (
      <>
        <div style={style1}></div>
        <div style={style2}></div>
      </>
    );
  } else {
    const style1 = { ...lineStyle, width: '2px', height: '100%', left: '0', top: '0' };
    const style2 = { ...lineStyle, width: '2px', height: '100%', right: '0', top: '0' };
    return (
      <>
        <div style={style1}></div>
        <div style={style2}></div>
      </>
    );
  }
};

export default ShelvingLines;