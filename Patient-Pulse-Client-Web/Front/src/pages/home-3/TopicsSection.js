import React from 'react';
import { Link } from 'react-router-dom';

const NewsAndUpdates = () => {

    // Example news articles with real links and images
    const newsArticles = [
        {
            id: 1,
            title: "Advancements in Ayurvedic Medicine",
            excerpt: "New research highlights the effectiveness of Ayurvedic treatments for chronic illnesses...",
            date: "October 15, 2024",
            link: "https://www.healthnews.com/advancements-in-ayurvedic-medicine",
            image: "https://www.nagarjunaayurveda.com/image/blog78.png", // Replace with actual image URL
        },
        {
            id: 2,
            title: "Natural Remedies for Stress Relief",
            excerpt: "A study reveals the benefits of natural remedies in reducing stress and promoting well-being...",
            date: "October 12, 2024",
            link: "https://www.naturemedicine.com/natural-remedies-stress-relief",
            image: "https://www.nagarjunaayurveda.com/image/blog77.jpg", // Replace with actual image URL
        },
        {
            id: 3,
            title: "Herbal Supplements: What You Should Know",
            excerpt: "Herbal supplements can support health, but it's important to be informed before using them...",
            date: "October 10, 2024",
            link: "https://www.herbalscience.com/herbal-supplements-101",
            image: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/ayurvedic-732x549-thumbnail-732x549.jpg", // Replace with actual image URL
        },
    ];

    return (
        <div className="react_news_updates pt---100 pb---100">
            <div className="container">
                <div className="react__title__section react__title__section-all">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h6 className="wow animate__fadeInUp" data-wow-duration="0.3s"> Latest Medical News </h6>
                            <h2 className="react__tittle wow animate__fadeInUp" data-wow-duration="0.5s"> News & Updates </h2>
                        </div>
                    </div>
                </div>
                
                <div className="row pt---30">
                    {newsArticles.map(article => (
                        <div key={article.id} className="col-md-4 wow animate__fadeInUp" data-wow-duration="0.3s">
                            <div className="news-item">
                                <img src={article.image} alt={article.title} className="news-image" />
                                <h3 className="news-title">
                                    <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
                                </h3>
                                <p className="news-excerpt">{article.excerpt}</p>
                                <span className="news-date">{article.date}</span>
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className="read-more">
                                    Read More 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NewsAndUpdates;
