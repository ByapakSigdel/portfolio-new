'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChartOptions, ChartData } from 'chart.js';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';

// Define types for charts and data
export type ContributionDay = {
  date: string;
  contributionCount: number;
};

export interface EChartTooltipParams {
  name: string;
  value: number;
  dataIndex: number;
}

export interface GraphsDataHook {
  // State
  animate: boolean;
  radarAnimate: boolean;
  contributionData: number[];
  contributionLabels: string[];
  loading: boolean;
  error: string | null;
  
  // Refs
  pieChartRef: React.RefObject<HTMLDivElement>;
  lineChartRef: React.RefObject<HTMLDivElement>;
  pieChartInstance: React.MutableRefObject<EChartsType | null>;
  lineChartInstance: React.MutableRefObject<EChartsType | null>;
  
  // Chart data and options
  getRadarData: () => ChartData<'radar'>;
  skillsOptions: ChartOptions<'radar'>;
  
  // Event handlers
  handleRadarHover: () => void;
  handlePieHover: () => void;
  handleLineHover: () => void;
  
  // Constants
  textColor: { color: string };
  greenColor: string;
  lightGreenColor: string;
}

export const useGraphsData = (): GraphsDataHook => {
  // Configuration variables - CHANGE THESE
  const GITHUB_USERNAME = 'yourusername'; // Replace with your GitHub username
  const GITHUB_PAT = ''; // Add your GitHub Personal Access Token here
  
  // Font family constant
  const CHART_FONT_FAMILY = '"Cascadia Code", "Fira Code", "Consolas", "Courier New", monospace';
  
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
  const pieChartRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const pieChartInstance = useRef<EChartsType | null>(null);
  const lineChartRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const lineChartInstance = useRef<EChartsType | null>(null);
  
  // Fetch GitHub contribution data
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
      const contributionDays: ContributionDay[] = [];
      
      // Flatten the weeks array to get all contribution days
      calendar.weeks.forEach((week: { contributionDays: ContributionDay[] }) => {
        week.contributionDays.forEach((day: ContributionDay) => {
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
            fontFamily: CHART_FONT_FAMILY,
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: greenColor,
          textStyle: {
            fontFamily: CHART_FONT_FAMILY,
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
              fontFamily: CHART_FONT_FAMILY
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
            animationDelay: function() {
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
            fontFamily: CHART_FONT_FAMILY,
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: greenColor,
          textStyle: {
            fontFamily: CHART_FONT_FAMILY,
            fontSize: 12,
            color: '#fff'
          },
          formatter: function(params: EChartTooltipParams[]) {
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
            fontFamily: CHART_FONT_FAMILY,
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
            fontFamily: CHART_FONT_FAMILY,
            fontSize: 12,
            fontWeight: '600'
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
            fontFamily: CHART_FONT_FAMILY
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
              color: greenColor,
              borderColor: greenColor, // Remove white border
              borderWidth: 0 // Set border width to 0
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
                borderWidth: 0, // Remove white border on hover
                borderColor: greenColor
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
          family: CHART_FONT_FAMILY,
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
          family: CHART_FONT_FAMILY,
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: CHART_FONT_FAMILY,
          size: 12
        },
        padding: 10,
        displayColors: true
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  // Enhanced radar chart options with smoother animations
  const skillsOptions: ChartOptions<'radar'> = {
    ...commonOptions,
    animation: {
      duration: 1200, // Slightly faster than before
      easing: 'easeInOutQuart' as const, // Smoother easing
      animateRotate: true,
      animateScale: true,
      onProgress: function(animation) {
        // Add subtle scale effect during animation
        const progress = animation.currentStep / animation.numSteps;
        const scale = 0.95 + (progress * 0.05); // Scale from 0.95 to 1.0
        if (this.canvas) {
          this.canvas.style.transform = `scale(${scale})`;
        }
      },
      onComplete: function() {
        // Reset scale after animation
        if (this.canvas) {
          this.canvas.style.transform = 'scale(1)';
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
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
            family: CHART_FONT_FAMILY,
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          backdropColor: 'transparent',
          color: greenColor,
          font: {
            family: CHART_FONT_FAMILY,
            size: 10
          },
          z: 10,
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100,
        // Add smooth transitions for scale changes
        animate: true
      }
    },
    // Add hover effects
    elements: {
      point: {
        hoverRadius: 8,
        hoverBorderWidth: 3,
        radius: 4,
        borderWidth: 2
      },
      line: {
        borderWidth: 2,
        tension: 0.1 // Add slight curve for smoother lines
      }
    }
  };

  // Enhanced radar data with smoother transitions
  const getRadarData = (): ChartData<'radar'> => {
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
          pointBorderColor: greenColor,
          pointHoverBackgroundColor: greenColor,
          pointHoverBorderColor: greenColor,
          // Add smooth transition properties
          tension: 0.1,
          fill: true,
          // Enhanced hover effects
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
          pointRadius: 4,
          pointBorderWidth: 2
        }
      ]
    };
  };

  // Handle hover states
  const handleRadarHover = () => {
    // Reset animation state to trigger re-render
    setRadarAnimate(false);
    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
      setRadarAnimate(true);
    });
  };

  const handlePieHover = () => {
    resetPieChartAnimation();
  };

  const handleLineHover = () => {
    resetLineChartAnimation();
  };

  // Effects
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
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
  }, [contributionData, contributionLabels]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // State
    animate,
    radarAnimate,
    contributionData,
    contributionLabels,
    loading,
    error,
    
    // Refs
    pieChartRef,
    lineChartRef,
    pieChartInstance,
    lineChartInstance,
    
    // Chart data and options
    getRadarData,
    skillsOptions,
    
    // Event handlers
    handleRadarHover,
    handlePieHover,
    handleLineHover,
    
    // Constants
    textColor,
    greenColor,
    lightGreenColor
  };
};