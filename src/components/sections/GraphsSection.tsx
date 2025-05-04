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
  LinearScale,
  ChartOptions
} from 'chart.js';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';

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
  // Configuration variables - CHANGE THESE
  const GITHUB_USERNAME = 'yourusername'; // Replace with your GitHub username
  const GITHUB_PAT = ''; // Add your GitHub Personal Access Token here
  
  // Styling variables
  const textColor = { color: '#256B2D' };
  const greenColor = 'rgba(37, 107, 45, 0.9)';
  const lightGreenColor = 'rgba(37, 107, 45, 0.3)';
  
  // Animation state
  const [animate, setAnimate] = useState<boolean>(false);
  const [radarAnimate, setRadarAnimate] = useState<boolean>(false);
  const [contributionData, setContributionData] = useState<number[]>([]);
  const [contributionLabels, setContributionLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // ECharts references
  const pieChartRef = useRef<HTMLDivElement>(null);
  const pieChartInstance = useRef<EChartsType | null>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const lineChartInstance = useRef<EChartsType | null>(null);
  
  // Chart.js reference
  const radarChartRef = useRef<any>(null);
  
  useEffect(() => {
    // Trigger animations after component mount
    setAnimate(true);
    
    // Initialize pie chart with a slight delay
    setTimeout(() => {
      initializePieChart();
    }, 500);
    
    // Fetch GitHub contribution data
    fetchGitHubContributions();
    
    // Cleanup function
    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.dispose();
      }
      if (lineChartInstance.current) {
        lineChartInstance.current.dispose();
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
  
  // Effect to initialize line chart when data is available
  useEffect(() => {
    if (contributionData.length > 0 && contributionLabels.length > 0) {
      initializeLineChart();
    }
  }, [contributionData, contributionLabels]);
  
  // Fetch GitHub contribution data using GraphQL API
  const fetchGitHubContributions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!GITHUB_USERNAME) {
        throw new Error('GitHub username not provided');
      }
      
      // If PAT is not provided, generate mock data
      if (!GITHUB_PAT) {
        generateMockContributionData();
        return;
      }
      
      // GraphQL query to fetch contribution data
      const query = `
        query {
          user(login: "${GITHUB_USERNAME}") {
            contributionsCollection {
              contributionCalendar {
                weeks(last: 5) {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;
      
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_PAT}`
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      // Process contribution data
      const calendar = result.data.user.contributionsCollection.contributionCalendar;
      const contributionDays: { date: string; contributionCount: number }[] = [];
      
      // Flatten the weeks array to get all contribution days
      calendar.weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          contributionDays.push({
            date: day.date,
            contributionCount: day.contributionCount
          });
        });
      });
      
      // Sort by date and take the last 30 days
      contributionDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const last30Days = contributionDays.slice(-30);
      
      const labels = last30Days.map(day => {
        const date = new Date(day.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const dayOfMonth = date.getDate();
        return `${month} ${dayOfMonth}`;
      });
      
      const data = last30Days.map(day => day.contributionCount);
      
      setContributionLabels(labels);
      setContributionData(data);
    } catch (error) {
      console.error('Error fetching GitHub contributions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback to mock data
      generateMockContributionData();
    } finally {
      setLoading(false);
    }
  };
  
  // Generate mock contribution data
  const generateMockContributionData = () => {
    const today = new Date();
    const labels: string[] = [];
    const data: number[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      labels.push(`${month} ${day}`);
      
      // Generate weighted random contribution count
      const dayOfWeek = date.getDay();
      let contributions: number;
      
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
  };
  
  // Initialize Pie Chart for hobbies and interests
  const initializePieChart = () => {
    if (pieChartRef.current && !pieChartInstance.current) {
      pieChartInstance.current = echarts.init(pieChartRef.current);
      
      const pieChartOption = {
        backgroundColor: 'transparent',
        title: {
          text: '',
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
          },
          formatter: '{a} <br/>{b}: {c} hrs/week ({d}%)'
        },
        visualMap: {
          show: false,
          min: 1,
          max: 25,
          inRange: {
            colorLightness: [0.2, 0.8]
          }
        },
        series: [
          {
            name: 'Time Spent',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: [
              { value: 25, name: 'Programming' },
              { value: 15, name: 'Art & Design' },
              { value: 10, name: 'Writing' },
              { value: 8, name: 'Gaming' },
              { value: 6, name: 'Reading' },
              { value: 5, name: 'Music' }
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
            animationDelay: function(idx: number) {
              return Math.random() * 300;
            },
            animationDuration: 2500
          }
        ]
      };
      
      // Apply options
      if (pieChartInstance.current) {
        pieChartInstance.current.setOption(pieChartOption);
      }
    }
  };
  
  // Re-initialize pie chart with animation
  const resetPieChartAnimation = () => {
    if (pieChartInstance.current) {
      pieChartInstance.current.dispose();
    }
    pieChartInstance.current = null;
    setTimeout(() => {
      initializePieChart();
    }, 50);
  };
  
  // Initialize Line Chart with GitHub contribution data
  const initializeLineChart = () => {
    if (lineChartRef.current && !lineChartInstance.current) {
      lineChartInstance.current = echarts.init(lineChartRef.current);
      
      const lineChartOption = {
        backgroundColor: 'transparent',
        title: {
          text: ``,
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
          formatter: function(params: any) {
            const data = params[0];
            return `${data.name}: ${data.value} contribution${data.value !== 1 ? 's' : ''}`;
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
            smooth: false,
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
      if (lineChartInstance.current) {
        lineChartInstance.current.setOption(lineChartOption);
      }
    }
  };
  
  // Re-initialize line chart with animation
  const resetLineChartAnimation = () => {
    if (lineChartInstance.current) {
      lineChartInstance.current.dispose();
    }
    lineChartInstance.current = null;
    setTimeout(() => {
      initializeLineChart();
    }, 50);
  };

  // Common options for radar chart
  const commonOptions: ChartOptions<'radar'> = {
    animation: {
      duration: 2000,
      easing: 'easeOutQuart' as const
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Technologies & Skills',
        color: greenColor,
        font: {
          family: 'monospace',
          size: 14
        },
        padding: {
          top: 10,
          bottom: 10
        }
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

  // Get radar chart data with technologies and skills
  const getRadarData = () => {
    return {
      labels: [
        'JavaScript/TypeScript', 
        'React/Next.js', 
        'Node.js/Express', 
        'HTML/CSS',
        'Python',
        'Database/SQL',
        'DevOps/CI/CD',
        'Mobile Dev'
      ],
      datasets: [
        {
          label: 'Proficiency',
          data: (animate || radarAnimate) ? [90, 85, 80, 88, 75, 78, 65, 70] : [0, 0, 0, 0, 0, 0, 0, 0],
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
  };

  const skillsOptions: ChartOptions<'radar'> = {
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

  // Handle hover states
  const handleRadarHover = () => {
    setRadarAnimate(false); // Reset animation state first
    setTimeout(() => {
      setRadarAnimate(true); // Then set it to true to trigger animation
    }, 50);
  };

  const handlePieHover = () => {
    resetPieChartAnimation();
  };

  const handleLineHover = () => {
    resetLineChartAnimation();
  };

  // Handle refresh button for GitHub data
  const handleRefreshGitHub = () => {
    setLoading(true);
    fetchGitHubContributions();
  };

  return (
    <section className="w-full">
      {/* Top row - two charts side by side on larger screens, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Technologies & Skills Chart */}
        <div 
          className="h-72 rounded p-4 transition-all duration-500"
          onMouseEnter={handleRadarHover}
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
          className="h-72 rounded p-4 transition-all duration-500"
          onMouseEnter={handlePieHover}
        >
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
          className="h-72 rounded p-4 transition-all duration-500"
          onMouseEnter={handleLineHover}
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              {error && (
                <p style={{...textColor, fontSize: '0.8rem'}} className="text-opacity-80">
                  {error.includes('GitHub API') ? 'Using mock data. Set PAT for real data.' : error}
                </p>
              )}
            </div>
            {/* <button 
              onClick={handleRefreshGitHub}
              className="text-xs py-1 px-2 rounded" 
              style={{
                backgroundColor: lightGreenColor,
                color: '#fff',
                fontFamily: 'monospace',
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button> */}
          </div>
          
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p style={textColor}>Loading GitHub contribution data...</p>
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