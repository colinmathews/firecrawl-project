import React from 'react';
import { TopicCard, TopicLoader } from 'components';
import { useButton } from 'app/components/button';

const HomePage = () => {
  const buttonProps = useButton('yellow-link', 'default');

  return (
    <div className="home-page">
      <div className="topics-section">
        <TopicLoader />
        <div className="topics-list">
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
        <button {...buttonProps} className="what-new-button mt-3">
          What's New?
        </button>
      </div>
    </div>
  );
};

export default HomePage;