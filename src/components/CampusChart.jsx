import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CampusChart = ({ data }) => {
  // Process campus data
  const getCampusData = () => {
    const campusData = {};
    data.projects.forEach(p => {
      const campus = p.campus;
      campusData[campus] = (campusData[campus] || 0) + 1;
    });

    const sortedData = Object.entries(campusData).sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedData.map(([campus]) => campus),
      datasets: [{
        data: sortedData.map(([, count]) => count),
        backgroundColor: [
          '#002D72', // Northeastern Navy
          '#C41E3A', // Northeastern Red  
          '#1976d2', // Blue
          '#388e3c', // Green
          '#f57c00', // Orange
          '#7b1fa2', // Purple
          '#5d4037', // Brown
          '#455a64', // Blue Grey
          '#e91e63', // Pink
          '#00acc1'  // Cyan
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: () => {},
        labels: {
          padding: 10,
          usePointStyle: true,
          font: {
            size: 11
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);

                return {
                  text: `${label} (${data.datasets[0].data[i]})`,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  pointStyle: 'circle',
                  hidden: isNaN(data.datasets[0].data[i]),
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} projects (${percentage}%)`;
          }
        }
      }
    }
  };

  const chartData = getCampusData();

  return (
    <div className="campus-chart-container">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default CampusChart;
