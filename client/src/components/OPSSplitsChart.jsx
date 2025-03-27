import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend, Cell } from 'recharts';

const OPSSplitsChart = ({ playerId }) => {
  const [splitsData, setSplitsData] = useState([]);

  useEffect(() => {
    if (playerId) {
      fetch(`/api/hitter_stats/${playerId}/splits`)
        .then(res => res.json())
        .then(data => {
            const formattedData = [
              { name: 'L15', ops: parseFloat(data.last15.ops) },
              { name: 'L30', ops: parseFloat(data.last30.ops) },
              { name: 'Season', ops: parseFloat(data.season.ops) }
            ];
            setSplitsData(formattedData);
          })
        .catch(err => console.error('Error fetching OPS splits:', err));
    }
  }, [playerId]);

  if (splitsData.length === 0) {
    return <div>No OPS splits available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={splitsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="ops" name="OPS">
          {splitsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === splitsData.length - 1 ? '#555555' : '#8884d8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OPSSplitsChart;