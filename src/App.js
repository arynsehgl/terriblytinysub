import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App = () => {
  const [wordFrequency, setWordFrequency] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (wordFrequency.length > 0) {
      setShowChart(true);
    }
  }, [wordFrequency]);

  const fetchWordFrequency = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const text = response.data;
      const words = text.split(/\s+/); 
      const frequencyMap = words.reduce((map, word) => {
        map[word] = (map[word] || 0) + 1;
        return map;
      }, {});
      const sortedFrequency = Object.entries(frequencyMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20); 
      setWordFrequency(sortedFrequency);
    } catch (error) {
      console.error('Error fetching word frequency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = wordFrequency
      .map(([word, frequency]) => `${word},${frequency}`)
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word_frequency.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={fetchWordFrequency} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
      {showChart && (
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={wordFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" angle={-45} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="1" fill="#c31432" />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={exportToCSV}>Export</button>
        </div>
      )}
    </div>
  );
};

export default App;





