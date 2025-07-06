'use client';
import React, { useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { useGraphsData } from './GraphsData';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default function GraphsSection() {
  const {
    // State
    loading,
    error,
    
    // Refs
    pieChartRef,
    lineChartRef,
    
    // Chart data and options
    getRadarData,
    skillsOptions,
    
    // Event handlers
    handleRadarHover,
    handlePieHover,
    handleLineHover,
    
    // Constants
    textColor
  } = useGraphsData();
  
  // Chart.js reference
  const radarChartRef = useRef<ChartJS<"radar">>(null);

  return (
    <section className="w-full">
      {/* Top row - two charts side by side on larger screens, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Technologies & Skills Chart */}
        <div 
          className="h-72 rounded p-4 transition-all duration-500 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
          onMouseEnter={handleRadarHover}
          style={{
            transformOrigin: 'center',
            willChange: 'transform'
          }}
        >
          <div className="h-full">
            <Radar 
              ref={radarChartRef}
              data={getRadarData()} 
              options={skillsOptions}
            />
          </div>
        </div>
        
        {/* Interests & Hobbies Chart - ECharts */}
        <div 
          className="h-72 rounded p-4 transition-all duration-500 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
          onMouseEnter={handlePieHover}
          style={{
            transformOrigin: 'center',
            willChange: 'transform'
          }}
        >
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-lg font-semibold" style={textColor}>
              Interests & Hobbies
            </h3>
          </div>
          <div 
            ref={pieChartRef} 
            className="h-full w-full" 
          />
        </div>
      </div>
      
      {/* Bottom row - full width chart */}
      <div className="w-full">
        {/* GitHub Contributions - ECharts Line */}
        <div 
          className="h-72 rounded p-4 transition-all duration-500 hover:shadow-lg transform hover:scale-[1.01] cursor-pointer"
          onMouseEnter={handleLineHover}
          style={{
            transformOrigin: 'center',
            willChange: 'transform'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold" style={textColor}>
              GitHub Contributions (Last 30 Days)
            </h3>
            <div>
              {error && (
                <p style={{...textColor, fontSize: '0.8rem'}} className="text-opacity-80">
                  {error.includes('GitHub API') ? 'Using mock data. Set PAT for real data.' : error}
                </p>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p style={textColor} className="ml-4">Loading GitHub contribution data...</p>
            </div>
          ) : (
            <div 
              ref={lineChartRef} 
              className="h-64 w-full" 
            />
          )}
        </div>
      </div>
    </section>
  );
}