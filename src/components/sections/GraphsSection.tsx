'use client';
import React from 'react';

export default function GraphsSection() {
  const textColor = { color: '#256B2D' };
  
  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        {/* Radar Chart Placeholder */}
        <div className="w-full md:w-1/2 h-64 border rounded flex items-center justify-center" 
             style={{ borderColor: 'rgba(37, 107, 45, 0.4)' }}>
          <div className="text-sm" style={textColor}>
            <pre className="text-xs" style={textColor}>
{`
entertainment (15%) twitter (70%)
 
 * *
 * *
 * *
coding (75%) --------------- discord (5%)
 * *
 * *
 * *
 
gaming (41%) programming (9%)
`}
            </pre>
          </div>
        </div>
        
        {/* Donut Chart Placeholder */}
        <div className="w-full md:w-1/2 h-64 border rounded flex items-center justify-center"
             style={{ borderColor: 'rgba(37, 107, 45, 0.4)' }}>
          <div className="text-sm" style={textColor}>
            <pre className="text-xs" style={textColor}>
{`
 communication
 /------------\\
 /            \\
 |            |
 |    25%     |
 |            |
 \\            /
 \\------------/
 discord
 /--------\\
 /        \\
 |        |
 |  11%   |
 |        |
 \\        /
 \\--------/
 twitter
`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}