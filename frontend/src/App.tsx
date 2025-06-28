import { useEffect, useState, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

type Article = {
    title: string;
    description: string;
    source: string;
    link: string;
};

type NewsItem = {
    date: string;
    path: string;
    articles: Article[];
};

type Manifest = Record<string, NewsItem[]>;

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const ArticleItem = ({ article }: { article: Article }) => (
    <div className="article">
        <h3>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
            </a>
        </h3>
        <p>{article.description}</p>
        <div className="article-meta">
            <span className="source">{article.source}</span>
            {article.link && (
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                    Read more →
                </a>
            )}
        </div>
    </div>
);

const NewsSection = ({ date, path, articles }: NewsItem) => (
    <section key={path} className="news-section">
        <div className="news-date">{formatDate(date)}</div>
        <div className="articles">
            {articles.length === 0 ? (
                <div className="no-articles">[No articles]</div>
            ) : (
                articles.map((article, index) => (
                    <ArticleItem key={article.link + index} article={article} />
                ))
            )}
        </div>
    </section>
);

const TabItem = ({ 
    model, 
    isActive, 
    onClick 
}: { 
    model: string; 
    isActive: boolean; 
    onClick: () => void;
}) => (
    <div
        className={`tab${isActive ? ' active' : ''}`}
        onClick={onClick}
    >
        {model}
    </div>
);

function App() {
    const [manifest, setManifest] = useState<Manifest>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [activeModel, setActiveModel] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const getLatestAvailableDate = useCallback((modelData: NewsItem[]) => {
        if (!modelData || modelData.length === 0) return null;
        

        const sortedDates = modelData
            .map(item => new Date(item.date))
            .sort((a, b) => b.getTime() - a.getTime());
        
        return sortedDates[0];
    }, []);

    useEffect(() => {
        const loadManifest = async () => {
            try {
                setLoading(true);
                setError(null);
                const timestamp = Date.now();
                const response = await fetch(`/news-manifest.json?t=${timestamp}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Manifest = await response.json();
                setManifest(data);
                const models = Object.keys(data);
                if (models.length > 0) {
                    const firstModel = models[0];
                    setActiveModel(firstModel);
                    
              
                    const firstModelData = data[firstModel];
                    if (firstModelData && firstModelData.length > 0) {
                        const latestDate = getLatestAvailableDate(firstModelData);
                        setSelectedDate(latestDate);
                    }
                }
            } catch (err) {
                console.error('Error loading manifest:', err);
                setError(err instanceof Error ? err.message : 'Failed to load news data');
            } finally {
                setLoading(false);
            }
        };

        loadManifest();
    }, [getLatestAvailableDate]);

    const models = useMemo(() => Object.keys(manifest), [manifest]);

    const availableDates = useMemo(() => {
        if (!activeModel || !manifest[activeModel]) return [];
        return manifest[activeModel].map(item => new Date(item.date));
    }, [activeModel, manifest]);

    const filteredNews = useMemo(() => {
        if (!activeModel || !manifest[activeModel]) return [];
        
        if (selectedDate) {
            return manifest[activeModel].filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.toDateString() === selectedDate.toDateString();
            });
        }
        
        return manifest[activeModel];
    }, [activeModel, manifest, selectedDate]);

    const handleModelChange = useCallback((model: string) => {
        setActiveModel(model);
        

        const modelData = manifest[model];
        if (modelData && modelData.length > 0) {
            const latestDate = getLatestAvailableDate(modelData);
            setSelectedDate(latestDate);
        } else {
            setSelectedDate(null);
        }
    }, [manifest, getLatestAvailableDate]);

    const handleDateChange = useCallback((date: Date | null) => {
        setSelectedDate(date);
    }, []);

    if (loading) {
        return (
            <div>
                <header>
                    <h1>LLM Daily News</h1>
                </header>
                <div className="content-area">
                    <div className="content">
                        <p className="placeholder">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <header>
                    <h1>LLM Daily News</h1>
                </header>
                <div className="content-area">
                    <div className="content">
                        <p className="placeholder">Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header>
                <div className="header-content">
                    <h1>LLM Daily News</h1>
                    <a 
                        href="https://github.com/eugene-taran/llm-news" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="github-link"
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                            className="github-icon"
                        >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                </div>
            </header>
            
            <div className="main-container">
                <aside className="sidebar">
                    <div className="calendar-container">
                        <div className="calendar-label">Date</div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            placeholderText="Select date"
                            dateFormat="dd/MM/yyyy"
                            className="date-picker"
                            maxDate={new Date()}
                            includeDates={availableDates}
                            isClearable
                            showYearDropdown
                            scrollableYearDropdown
                        />
                    </div>

                    <div className="tabs-container">
                        <div className="tabs-label">Models</div>
                        <div className="tabs">
                            {models.map(model => (
                                <TabItem
                                    key={model}
                                    model={model}
                                    isActive={activeModel === model}
                                    onClick={() => handleModelChange(model)}
                                />
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="content-area">
                    <div className="content">
                        {activeModel && filteredNews.length > 0 ? (
                            filteredNews.map((newsItem) => (
                                <NewsSection key={newsItem.path} {...newsItem} />
                            ))
                        ) : activeModel && selectedDate ? (
                            <p className="placeholder">No news for this selected date</p>
                        ) : (
                            <p className="placeholder">Select a model to view news</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
