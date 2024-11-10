import React from 'react';
import './ScrollableList.css'; // Create a CSS file for custom styles

const ScrollableList = ({items}) => {
    // Example list of items

    return (
        <div className="scrollable-container">
            {items?.map((item, index) => (
                <div key={index} className="scrollable-item">
                    {item}
                </div>
            ))}
        </div>
    );
};

export default ScrollableList;