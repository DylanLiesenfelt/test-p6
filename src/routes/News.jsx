import { useState, useEffect } from "react"
import './news.css'

const News = ({ticker}) => {

    const [news, setNews] = useState([])

    useEffect(() => {
        const getNewsFeed = async () => {
            try {
                const response = await fetch (`http://localhost:5000/api/newsfeed?ticker=${ticker}`)
                const data = await response.json();
                setNews(data)

            } catch(error) {
                console.error('Error getting news feed:', error)
            }  
        };

        getNewsFeed();
    }, [ticker]);

    return (
        <>
            <div id="news-container">
                <header id="news-header">
                    <h3>${ticker} News</h3>
                </header>
                <div id="news-feed">
                    {news.map((item, index) => (
                        <a
                            key={index}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-card"
                        >   
                            <div className="story-desc">
                                <h4>{item.title}</h4>
                                <p>{item.summary}</p>
                                <small>{new Date(item.published).toLocaleString()}</small>
                            </div>
                            {item.thumbnail && (
                                <div
                                    className="story-thumbnail"
                                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                                />
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}

export default News