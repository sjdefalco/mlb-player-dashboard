import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const CareerChart = ({ playerId, statKey, title, color, endpoint }) => {
  const [seasonData, setSeasonData] = useState([]);
  const [careerAvg, setCareerAvg] = useState(null);

  useEffect(() => {
    if (playerId) {
      fetch(endpoint)
        .then((res) => res.json())
        .then((stats) => {
          const seasons = stats.filter((stat) => stat.season !== 'career');
          const careerStat = stats.find((stat) => stat.season === 'career');
          const careerValue = careerStat && careerStat[statKey] ? parseFloat(careerStat[statKey]) : null;
          if (careerValue) {
            setCareerAvg(careerValue);
          }
          const processed = seasons.map((stat) => ({
            ...stat,
            value: parseFloat(stat[statKey]),
            careerLine: careerValue,
          }));
          setSeasonData(processed);
        })
        .catch((err) => console.error(`Error fetching ${title} stats:`, err));
    }
  }, [playerId, statKey, endpoint, title]);

  if (!seasonData || seasonData.length === 0) {
    return <div>No {title} data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={seasonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="season" />
        <Tooltip />
        <Bar dataKey="value" name={`Season ${title}`}>
          {seasonData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === seasonData.length - 1 ? '#555555' : color}
            />
          ))}
        </Bar>
        {careerAvg && (
          <Line
            dataKey="careerLine"
            type="monotone"
            stroke="red"
            dot={false}
            name={`Career ${title}`}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CareerChart;