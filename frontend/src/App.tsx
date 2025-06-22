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
                const response = await fetch('/news-manifest.json');
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
                <h1>LLM Daily News</h1>
            </header>
            
            <div className="main-container">
                <aside className="sidebar">
                    <div className="calendar-container">
                        <div className="calendar-label">Select date</div>
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
                        <div className="tabs-label">Select model</div>
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
