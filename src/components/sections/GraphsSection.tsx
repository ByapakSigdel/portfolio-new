'use client';
import React from 'react';

export default function GraphsSection() {
  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        {/* Radar Chart Placeholder */}
        <div className="w-full md:w-1/2 h-64 border border-green-500/40 rounded flex items-center justify-center">
          <div className="text-green-500 text-sm">
            <pre className="text-xs">
{`
entertainment (15%)     twitter (70%)
       *                     *
      * *                   * *
     *   *                 *   *
    *     *               *     *
coding (75%) --------------- discord (5%)
    *     *               *     *
     *   *                 *   *
      * *                   * *
       *                     *
gaming (41%)       programming (9%)
`}
            </pre>
          </div>
        </div>
        
        {/* Donut Chart Placeholder */}
        <div className="w-full md:w-1/2 h-64 border border-green-500/40 rounded flex items-center justify-center">
          <div className="text-green-500 text-sm">
            <pre className="text-xs">
{`
           communication
          /------------\\
         /              \\
        |                |
        |      25%       |
        |                |
         \\              /
          \\------------/
             discord
          /--------\\
         /          \\
        |            |
        |    11%     |
        |            |
         \\          /
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