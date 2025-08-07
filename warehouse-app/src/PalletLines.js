import React from 'react';

const PalletLines = ({ orientation = 'vertical' }) => {
  const longLineStyle = { position: 'absolute', backgroundColor: 'rgb(255, 249, 230)' };
  const transLineStyle = { position: 'absolute', backgroundColor: 'rgb(245, 191, 93)' };
  if (orientation === 'vertical') {
    const long1 = { ...longLineStyle, width: '2px', height: '100%', left: '3px', top: '0' };
    const long2 = { ...longLineStyle, width: '2px', height: '100%', left: '7px', top: '0' };
    const long3 = { ...longLineStyle, width: '2px', height: '100%', left: '11px', top: '0' };
    const long4 = { ...longLineStyle, width: '2px', height: '100%', left: '15px', top: '0' };
    const trans1 = { ...transLineStyle, height: '3px', width: '100%', top: '0', left: '0' };
    const trans2 = { ...transLineStyle, height: '3px', width: '100%', top: '50%', left: '0', transform: 'translateY(-50%)' };
    const trans3 = { ...transLineStyle, height: '3px', width: '100%', bottom: '0', left: '0' };
    return (
      <>
        <div style={long1}></div>
        <div style={long2}></div>
        <div style={long3}></div>
        <div style={long4}></div>
        <div style={trans1}></div>
        <div style={trans2}></div>
        <div style={trans3}></div>
      </>
    );
  } else {
    const long1 = { ...longLineStyle, height: '2px', width: '100%', top: '3px', left: '0' };
    const long2 = { ...longLineStyle, height: '2px', width: '100%', top: '7px', left: '0' };
    const long3 = { ...longLineStyle, height: '2px', width: '100%', top: '11px', left: '0' };
    const long4 = { ...longLineStyle, height: '2px', width: '100%', top: '15px', left: '0' };
    const trans1 = { ...transLineStyle, width: '3px', height: '100%', left: '0', top: '0' };
    const trans2 = { ...transLineStyle, width: '3px', height: '100%', left: '50%', top: '0', transform: 'translateX(-50%)' };
    const trans3 = { ...transLineStyle, width: '3px', height: '100%', right: '0', top: '0' };
    return (
      <>
        <div style={long1}></div>
        <div style={long2}></div>
        <div style={long3}></div>
        <div style={long4}></div>
        <div style={trans1}></div>
        <div style={trans2}></div>
        <div style={trans3}></div>
      </>
    );
  }
};

export default PalletLines;