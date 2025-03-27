import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  Cell  // <-- import Cell explicitly
} from 'recharts';

const OPSChart = ({ playerId }) => {
  const [seasonData, setSeasonData] = useState([]);
  const [careerOps, setCareerOps] = useState(null);

  useEffect(() => {
    if (playerId) {
      fetch(`/api/hitter_stats/${playerId}`)
        .then((res) => res.json())
        .then((stats) => {
          const seasons = stats.filter((stat) => stat.season !== 'career');
          const careerStat = stats.find((stat) => stat.season === 'career');
          const careerOpsValue = careerStat && careerStat.ops ? parseFloat(careerStat.ops) : null;
          if (careerOpsValue) {
            setCareerOps(careerOpsValue);
          }
          const processed = seasons.map((stat) => ({
            ...stat,
            ops: parseFloat(stat.ops),
            careerLine: careerOpsValue,
          }));
          setSeasonData(processed);
        })
        .catch((err) => console.error('Error fetching hitter stats:', err));
    }
  }, [playerId]);

  if (!seasonData || seasonData.length === 0) {
    return <div>No stats available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={seasonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="season" />
        <Tooltip />
        <Legend />
        <Bar dataKey="ops" name="Season OPS">
          {seasonData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === seasonData.length - 1 ? "#555555" : "#8884d8"} // recent year dark grey
            />
          ))}
        </Bar>
        {careerOps && (
          <Line
            dataKey="careerLine"
            type="monotone"
            stroke="red"
            dot={false}
            name={`Career OPS`}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default OPSChart;