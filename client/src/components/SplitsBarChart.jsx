import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

const SplitsBarChart = ({ playerId, statKey, title, color, endpoint }) => {
  const [splitsData, setSplitsData] = useState([]);

  useEffect(() => {
    if (playerId) {
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          const formattedData = [
            { name: 'L30', value: parseFloat(data.last30[statKey]) },
            { name: 'L15', value: parseFloat(data.last15[statKey]) },
            { name: 'Season', value: parseFloat(data.season[statKey]) }
          ];
          setSplitsData(formattedData);
        })
        .catch(err => console.error(`Error fetching ${title} splits:`, err));
    }
  }, [playerId, statKey, endpoint, title]);

  if (splitsData.length === 0) {
    return <div>No {title} splits available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={splitsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" name={title}>
          {splitsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === splitsData.length - 1 ? '#555555' : color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SplitsBarChart;