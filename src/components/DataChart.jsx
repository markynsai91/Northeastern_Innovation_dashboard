import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataChart = ({ data }) => {
  // Process data readiness information
  const getDataReadiness = () => {
    const dataCategories = {
      'Data Ready': 0,
      'Collection Planned': 0,
      'No Data': 0
    };

    data.projects.forEach(project => {
      const status = project.dataStatus;
      if (status.includes('Yes')) {
        dataCategories['Data Ready']++;
      } else if (status.includes('planned')) {
        dataCategories['Collection Planned']++;
      } else {
        dataCategories['No Data']++;
      }
    });

    return {
      labels: Object.keys(dataCategories),
      datasets: [{
        label: 'Projects',
        data: Object.values(dataCategories),
        backgroundColor: [
          '#4caf50', // Green for Data Ready
          '#ff9800', // Orange for Collection Planned  
          '#f44336'  // Red for No Data
        ],
        borderColor: [
          '#4caf50',
          '#ff9800', 
          '#f44336'
        ],
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} projects (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        grid: {
          color: '#e0e0e0'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        top: 10
      }
    }
  };

  const chartData = getDataReadiness();

  return (
    <div className="data-chart-container">
      <Bar data={chartData} options={chartOptions} />
      <div className="data-readiness-summary">
        <div className="readiness-item">
          <span className="readiness-indicator ready"></span>
          <span className="readiness-text">Data Ready: Projects with active measurement systems</span>
        </div>
        <div className="readiness-item">
          <span className="readiness-indicator planned"></span>
          <span className="readiness-text">Collection Planned: Projects preparing data systems</span>
        </div>
        <div className="readiness-item">
          <span className="readiness-indicator none"></span>
          <span className="readiness-text">No Data: Projects without measurement plans</span>
        </div>
      </div>
    </div>
  );
};

export default DataChart;