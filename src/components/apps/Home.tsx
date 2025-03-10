import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">ようこそ</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">
          サイドバーからアプリを選択してください。
        </p>
      </div>
    </div>
  );
};

export default Home; 