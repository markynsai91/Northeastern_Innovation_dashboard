import React, { useEffect, useRef } from 'react';

const MaturityPipeline = ({ data, onStageFilter, activeStage, getProjectStage }) => {
  const containerRef = useRef(null);

  // Analyze maturity stages
  const analyzeMaturity = () => {
    const stages = { 'Emerging': 0, 'Growing': 0, 'Mature': 0 };

    data.projects.forEach(project => {
      const stage = getProjectStage(project);
      stages[stage]++;
    });

    return stages;
  };

  // Create pipeline visualization
  const createPipeline = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Create stages container
    const stagesContainer = document.createElement('div');
    stagesContainer.className = 'pipeline-stages';

    const stages = analyzeMaturity();
    const maxCount = Math.max(...Object.values(stages));

    Object.entries(stages).forEach(([stage, count]) => {
      const stageDiv = document.createElement('div');
      stageDiv.className = 'pipeline-stage';

      const height = maxCount > 0 ? (count / maxCount) * 120 : 8;

      const bar = document.createElement('div');
      bar.className = `pipeline-bar ${activeStage === stage ? 'active' : ''}`;
      bar.style.height = `${Math.max(8, height)}px`;
      bar.dataset.stage = stage;
      
      // Add click handler for filtering by maturity stage
      bar.addEventListener('click', () => {
        onStageFilter(stage);
      });

      const countLabel = document.createElement('div');
      countLabel.className = 'pipeline-count';
      countLabel.textContent = count;

      const label = document.createElement('div');
      label.className = 'pipeline-label';
      
      // Add emojis and enhanced labels
      const stageLabels = {
        'Emerging': '🌱 Emerging',
        'Growing': '📈 Growing', 
        'Mature': '🏛️ Mature'
      };
      
      label.textContent = stageLabels[stage] || stage;

      bar.appendChild(countLabel);
      stageDiv.appendChild(bar);
      stageDiv.appendChild(label);
      stagesContainer.appendChild(stageDiv);
    });

    // Add explanatory note
    const note = document.createElement('div');
    note.className = 'pipeline-note';
    note.innerHTML = `
      <div class="pipeline-note-title">Maturity Classification</div>
      <div class="pipeline-note-content">
        <strong>🌱 Emerging</strong> (&lt; 1 year): New initiatives in early development phase<br>
        <strong>📈 Growing</strong> (1-3 years): Projects with momentum, expanding and refining<br>
        <strong>🏛️ Mature</strong> (3+ years): Established programs with proven track records
      </div>
    `;

    container.appendChild(stagesContainer);
    container.appendChild(note);
  };

  useEffect(() => {
    createPipeline();
  }, [data, activeStage]);

  return (
    <div className="innovation-pipeline" ref={containerRef}>
      <div className="loading">Processing maturity data</div>
    </div>
  );
};

export default MaturityPipeline;