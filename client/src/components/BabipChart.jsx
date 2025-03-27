import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const BABIPChart = ({ playerId }) => {
  const [seasonData, setSeasonData] = useState([]);
  const [careerBabip, setCareerBabip] = useState(null);

  useEffect(() => {
    if (playerId) {
      fetch(`/api/hitter_stats/${playerId}`)
        .then((res) => res.json())
        .then((stats) => {
          const seasons = stats.filter((stat) => stat.season !== 'career');
          const careerStat = stats.find((stat) => stat.season === 'career');
          const careerBabipValue = careerStat && careerStat.babip ? parseFloat(careerStat.babip) : null;
          if (careerBabipValue) {
            setCareerBabip(careerBabipValue);
          }
          const processed = seasons.map((stat) => ({
            ...stat,
            babip: parseFloat(stat.babip),
            careerLine: careerBabipValue,
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
        {/* <Legend /> */}
        <Bar dataKey="babip" name="Season BABIP">
          {seasonData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === seasonData.length - 1 ? '#555555' : '#8884d8'} // Dark grey for latest season
            />
          ))}
        </Bar>
        {careerBabip && (
          <Line
            dataKey="careerLine"
            type="monotone"
            stroke="red"
            dot={false}
            name={`Career BABIP`}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default BABIPChart;