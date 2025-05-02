'use client';
import React, { useState, useEffect, useRef } from 'react';
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
import * as echarts from 'echarts';

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
  const textColor = { color: '#256B2D' };
  const greenColor = 'rgba(37, 107, 45, 0.9)';
  const lightGreenColor = 'rgba(37, 107, 45, 0.3)';
  
  // Animation state
  const [animate, setAnimate] = useState(false);
  const [username, setUsername] = useState(''); // GitHub username
  const [contributionData, setContributionData] = useState([]);
  const [contributionLabels, setContributionLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ECharts references
  const pieChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const lineChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  
  useEffect(() => {
    // Trigger animations after component mount
    setAnimate(true);
    
    // Set your GitHub username here
    setUsername('yourusername'); // Replace with your actual GitHub username
    
    // Initialize pie chart
    initializePieChart();
    
    // Cleanup function
    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.dispose();
        pieChartInstance.current = null;
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.dispose();
        lineChartInstance.current = null;
      }
    };
  }, []);
  
  // Handle window resize for ECharts
  useEffect(() => {
    const resizeHandler = () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.resize();
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.resize();
      }
    };
    
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);
  
  // Effect to fetch GitHub contribution data when username changes
  useEffect(() => {
    if (username) {
      fetchGitHubContributions();
    }
  }, [username]);
  
  // Effect to initialize line chart when data is available
  useEffect(() => {
    if (contributionData.length > 0 && contributionLabels.length > 0) {
      initializeLineChart();
    }
  }, [contributionData, contributionLabels]);
  
  const fetchGitHubContributions = async () => {
    setLoading(true);
    try {
      // For demonstration purposes, we'll use a proxy API or generate data
      // In a production app, you would use GitHub's GraphQL API with proper authentication
      
      // Since GitHub's API requires authentication for contribution data,
      // and we can't include auth tokens in client-side code,
      // we'll generate realistic data here
      
      // This would normally be an API call like:
      // const response = await fetch(`https://api.github.com/users/${username}/contributions`);
      // const data = await response.json();
      
      // Generating realistic contribution data for last 30 days
      const today = new Date();
      const labels = [];
      const data = [];
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        labels.push(`${month} ${day}`);
        
        // Generate weighted random contribution count
        // More contributions on weekdays (1-5), fewer on weekends (0, 6)
        const dayOfWeek = date.getDay();
        let contributions;
        
        if (dayOfWeek > 0 && dayOfWeek < 6) {
          // Weekdays: 0-12 contributions with higher probability of more
          contributions = Math.floor(Math.random() * 13);
          if (Math.random() > 0.6) {
            contributions += Math.floor(Math.random() * 8);
          }
        } else {
          // Weekends: 0-5 contributions
          contributions = Math.floor(Math.random() * 6);
        }
        
        data.push(contributions);
      }
      
      setContributionLabels(labels);
      setContributionData(data);
    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
      // Fallback data in case of error
      const fallbackLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const fallbackData = [5, 8, 12, 7];
      
      setContributionLabels(fallbackLabels);
      setContributionData(fallbackData);
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize Pie Chart
  const initializePieChart = () => {
    if (pieChartRef.current && !pieChartInstance.current) {
      pieChartInstance.current = echarts.init(pieChartRef.current);
      
      const pieChartOption = {
        backgroundColor: 'transparent',
        title: {
          text: 'Frameworks',
          left: 'center',
          top: 10,
          textStyle: {
            color: greenColor,
            fontFamily: 'monospace',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: greenColor,
          textStyle: {
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#fff'
          }
        },
        visualMap: {
          show: false,
          min: 5,
          max: 35,
          inRange: {
            colorLightness: [0.2, 0.8]
          }
        },
        series: [
          {
            name: 'Frameworks',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: [
              { value: 35, name: 'React' },
              { value: 25, name: 'Next.js' },
              { value: 10, name: 'Vue' },
              { value: 5, name: 'Angular' },
              { value: 15, name: 'Express' },
              { value: 10, name: 'Django' }
            ].sort(function(a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              color: greenColor,
              fontFamily: 'monospace'
            },
            labelLine: {
              lineStyle: {
                color: lightGreenColor
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: greenColor,
              shadowBlur: 20,
              shadowColor: 'rgba(37, 107, 45, 0.5)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      
      // Apply options
      pieChartInstance.current.setOption(pieChartOption);
    }
  };
  
  // Initialize Line Chart with GitHub contribution data
  const initializeLineChart = () => {
    if (lineChartRef.current && !lineChartInstance.current) {
      lineChartInstance.current = echarts.init(lineChartRef.current);
      
      const lineChartOption = {
        backgroundColor: 'transparent',
        title: {
          text: 'GitHub Contributions (Last 30 Days)',
          left: 'center',
          top: 10,
          textStyle: {
            color: greenColor,
            fontFamily: 'monospace',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: greenColor,
          textStyle: {
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#fff'
          },
          formatter: function(params) {
            const data = params[0];
            return `${data.name}: ${data.value} contributions`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: contributionLabels,
          axisLine: {
            lineStyle: {
              color: greenColor
            }
          },
          axisLabel: {
            color: greenColor,
            fontFamily: 'monospace',
            fontSize: 10,
            rotate: 45,
            interval: 'auto'
          }
        },
        yAxis: {
          type: 'value',
          name: 'Contributions',
          nameTextStyle: {
            color: greenColor,
            fontFamily: 'monospace'
          },
          axisLine: {
            lineStyle: {
              color: greenColor
            }
          },
          splitLine: {
            lineStyle: {
              color: lightGreenColor,
              opacity: 0.3
            }
          },
          axisLabel: {
            color: greenColor,
            fontFamily: 'monospace'
          }
        },
        series: [
          {
            name: 'Contributions',
            type: 'line',
            smooth: true,
            data: contributionData,
            symbolSize: 8,
            itemStyle: {
              color: greenColor
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: greenColor
                  },
                  {
                    offset: 1,
                    color: 'rgba(37, 107, 45, 0.1)'
                  }
                ]
              }
            },
            emphasis: {
              itemStyle: {
                borderWidth: 2,
                borderColor: '#fff'
              }
            },
            animationDuration: 2000,
            animationEasing: 'cubicOut'
          }
        ]
      };
      
      // Apply options
      lineChartInstance.current.setOption(lineChartOption);
    }
  };

  // Common options for radar chart
  const commonOptions = {
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(37, 107, 45, 0.9)',
        titleFont: {
          family: 'monospace',
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: 'monospace',
          size: 12
        },
        padding: 10,
        displayColors: true
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  // Languages Data - Radar Chart
  const languagesData = {
    labels: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'C++'],
    datasets: [
      {
        label: 'Proficiency',
        data: animate ? [85, 78, 92, 65, 70, 60] : [0, 0, 0, 0, 0, 0],
        backgroundColor: lightGreenColor,
        borderColor: greenColor,
        borderWidth: 2,
        pointBackgroundColor: greenColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: greenColor
      }
    ]
  };

  const languagesOptions = {
    ...commonOptions,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(37, 107, 45, 0.3)'
        },
        grid: {
          color: 'rgba(37, 107, 45, 0.2)'
        },
        pointLabels: {
          color: greenColor,
          font: {
            family: 'monospace',
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          backdropColor: 'transparent',
          color: greenColor,
          font: {
            family: 'monospace',
            size: 10
          },
          z: 10,
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  return (
    <section className="w-full">
      {/* Top row - two charts side by side on larger screens, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Languages Chart */}
        <div className="h-72 rounded p-4 transition-all duration-500">
          <div className="h-full">
            <Radar data={languagesData} options={languagesOptions} />
          </div>
        </div>
        
        {/* Frameworks Chart - ECharts */}
        <div className="h-72 rounded p-4 transition-all duration-500">
          <div 
            ref={pieChartRef} 
            className="h-full w-full" 
          />
        </div>
      </div>
      
      {/* Bottom row - full width chart */}
      <div className="w-full">
        {/* GitHub Contributions - ECharts Line */}
        <div className="h-72 rounded p-4 transition-all duration-500">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p style={textColor}>Loading GitHub contribution data...</p>
            </div>
          ) : (
            <div 
              ref={lineChartRef} 
              className="h-full w-full" 
            />
          )}
        </div>
      </div>
    </section>
  );
}