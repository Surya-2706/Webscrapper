import React, { useState } from 'react';
import axios from 'axios';
import Header from './Component/Header';
import { Container, Chip, TextField, Button, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const App = () => {
    const [url, setUrl] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');


    const isValidUrl = (urlString) => {
        try {
            const url = new URL(urlString);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (err) {
            return false;
        }
    };

    const handleScrape = async (e) => {
        e.preventDefault();

        setError("")
        if (!isValidUrl(url)) {
            setError('Please enter a valid public URL (must start with http:// or https://)');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("https://webscrapper-dhn1.onrender.com/scrape", { url }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data);

            setResults([...results, response.data]);
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.error || 'Failed to fetch content');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results?.filter(item =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='root-wrapper'>
            <div className="header_wrapper">
                <Header />
            </div>
            <div className="content_wrapper">
                <div className='search_wrapper'>
                    <div className="search_container">
                        <div className="search_iput">
                            <div className="content">
                                <div className="search_heading">
                                    Extract Content from Any Article
                                </div>
                                <div className="search_subheading">
                                    Paste any public article URL and let AI extract the title, summary, and key points for you.
                                </div>
                                <div className='input_wrapper'>
                                    <input type="text" placeholder="Enter URL to extract content" value={url} onChange={(e) => setUrl(e.target.value)} />
                                    <button onClick={(e) => handleScrape(e)} disabled={loading || !url}>
                                        <span style={{ width: '20px', height: '20px' }}>
                                            <svg class="svg-inline--fa fa-wand-magic-sparkles" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="wand-magic-sparkles" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"></path></svg>
                                        </span>
                                        {loading ? 'Extracting...' : 'Extract'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-600 mt-4">
                            ⚠️ {error}
                        </div>
                    )}
                </div>
                <TextField
                    fullWidth
                    label="Search summaries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Url</TableCell>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Summary</strong></TableCell>
                                <TableCell><strong>Keywords</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredResults.map((item, index) => (
                                <TableRow key={index} hover>
                                    <TableCell><a href={item.url}>Link</a></TableCell>
                                    <TableCell>{item?.title}</TableCell>
                                    <TableCell style={{ whiteSpace: 'pre-wrap' }}>{item?.summary}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {(item.keywords || []).map((kw, i) => (
                                                <Chip key={i} label={kw} size="small" />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default App;
