import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

type Article = {
    title: string;
    description: string;
    source: string;
    link: string;
};
type Manifest = Record<
    string,
    { date: string; path: string; articles: Article[] }[]
>;

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

function App() {
    const [manifest, setManifest] = useState<Manifest>({});
    const [activeModel, setActiveModel] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetch('/news-manifest.json')
            .then(res => res.json())
            .then((data: Manifest) => {
                setManifest(data);
                const models = Object.keys(data);
                if (models.length > 0) setActiveModel(models[0]);
            });
    }, []);

    const models = Object.keys(manifest);

   
    const availableDates = activeModel && manifest[activeModel] 
        ? manifest[activeModel].map(item => new Date(item.date))
        : [];


    const filteredNews = activeModel && selectedDate && manifest[activeModel]
        ? manifest[activeModel].filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === selectedDate.toDateString();
        })
        : activeModel && manifest[activeModel]
        ? manifest[activeModel]
        : [];

    return (
        <div>
            <header>LLM Daily News</header>
            

            <div className="calendar-container">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholderText="Select date"
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    maxDate={new Date()}
                    includeDates={availableDates}
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                />
                {selectedDate && (
                    <button 
                        className="clear-date-btn"
                        onClick={() => setSelectedDate(null)}
                    >
                       Show all news
                    </button>
                )}
            </div>

            <div className="tabs">
                {models.map(model => (
                    <div
                        key={model}
                        className={`tab${activeModel === model ? ' active' : ''}`}
                        onClick={() => setActiveModel(model)}
                    >
                        {model}
                    </div>
                ))}
            </div>
            <div className="content">
                {activeModel && filteredNews.length > 0 ? (
                    filteredNews.map(({ date, path, articles }) => (
                        <section key={path} className="news-section">
                            <div className="news-date">{formatDate(date)}</div>
                            <div className="articles">
                                {articles.length === 0 ? (
                                    <div className="no-articles">[No articles]</div>
                                ) : (
                                    articles.map((a, i) => (
                                        <div key={a.link || i} className="article">
                                            <h3>
                                                <a href={a.link} target="_blank" rel="noopener noreferrer">
                                                    {a.title}
                                                </a>
                                            </h3>
                                            <p>{a.description}</p>
                                            <div className="article-meta">
                                                <span className="source">{a.source}</span>
                                                {a.link && (
                                                    <a href={a.link} target="_blank" rel="noopener noreferrer">
                                                        Read more →
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    ))
                ) : activeModel && selectedDate ? (
                    <p className="placeholder">No news for this selected date</p>
                ) : (
                    <p className="placeholder">[Select a model tab]</p>
                )}
            </div>
        </div>
    );
}

export default App;
