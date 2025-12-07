import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { DIVISIONS, TYPES } from './constants';
import { ViewState, TravelGuideData, ChatMessage, TravelPreferences } from './types';
import { fetchDestinationGuide, createChatSession, sendMessageToChat, fetchTravelRecommendation } from './services/geminiService';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { MapCard } from './components/MapCard';
import { WebSourceCard } from './components/WebSourceCard';
import { Spinner } from './components/Spinner';
import { TripPlannerForm } from './components/TripPlannerForm';
import { Footer } from './components/Footer';
import { Chat } from '@google/genai';

export const App: React.FC = () => {
    const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
    const [activeTab, setActiveTab] = useState<'divisions' | 'types'>('types');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data State
    const [guideData, setGuideData] = useState<TravelGuideData | null>(null);

    // Chat State
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, chatLoading]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        await loadDestination(searchQuery);
    };

    const loadDestination = async (name: string) => {
        setLoading(true);
        setError(null);
        setViewState(ViewState.DESTINATION_DETAIL);
        setSelectedDestination(name);
        setGuideData(null);

        try {
            // Fetch guide data
            const data = await fetchDestinationGuide(name);
            setGuideData(data);

            // Initialize chat session for this destination
            const newChat = createChatSession();
            setChatSession(newChat);
            setChatHistory([{
                role: 'model',
                text: `Welcome to the guide for ${data.locationName}! I can answer deep questions about itineraries, safety concerns, or detailed costs.`,
                timestamp: Date.now()
            }]);

        } catch (err: any) {
            setError(err.message || "Failed to load destination.");
        } finally {
            setLoading(false);
        }
    };

    const handlePlanTrip = async (prefs: TravelPreferences) => {
        setLoading(true);
        setError(null);
        // Don't change viewState yet, show loading inside form or overlay? 
        // Actually, let's switch to detail view but with a "Planner" context
        setGuideData(null);

        try {
            const data = await fetchTravelRecommendation(prefs);
            setViewState(ViewState.DESTINATION_DETAIL);
            setSelectedDestination("My Personal Plan");
            setGuideData(data);

            const newChat = createChatSession();
            setChatSession(newChat);
            setChatHistory([{
                role: 'model',
                text: `I've designed this trip specifically for your ${prefs.mood.toLowerCase()} mood and ${prefs.budget.toLowerCase()} budget. Feel free to ask for adjustments!`,
                timestamp: Date.now()
            }]);

        } catch (err: any) {
            setError(err.message || "Failed to plan trip.");
            // Stay on planner view but show error
        } finally {
            setLoading(false);
        }
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !chatSession) return;

        const userMsg: ChatMessage = { role: 'user', text: chatInput, timestamp: Date.now() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setChatLoading(true);

        const responseText = await sendMessageToChat(chatSession, userMsg.text);

        setChatHistory(prev => [...prev, {
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        }]);
        setChatLoading(false);
    };

    const handleDownloadPdf = () => {
        const element = document.getElementById('guide-content');
        if (!element) return;

        const opt = {
            margin: [0.5, 0.5],
            filename: `${selectedDestination ? selectedDestination.replace(/\s+/g, '_') : 'itinerary'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Use the library
        html2pdf().set(opt).from(element).save();
    };

    const goHome = () => {
        setViewState(ViewState.HOME);
        setGuideData(null);
        setSelectedDestination(null);
        setSearchQuery('');
    };

    // --- RENDER FUNCTIONS ---

    const renderHome = () => (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl top-20 -left-48 animate-float"></div>
                <div className="absolute w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl top-40 right-0 animate-float delay-100"></div>
                <div className="absolute w-96 h-96 bg-accent-pink/20 rounded-full blur-3xl bottom-20 left-1/3 animate-float delay-200"></div>
            </div>

            <div className="flex-1 relative z-10">
                {/* Hero Section */}
                <div className="relative text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1673051787560-13622b325a9a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            className="w-full h-full object-cover opacity-30"
                            alt="Bangladesh Nature"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-800/90 to-dark-900"></div>
                    </div>
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
                        <div className="mb-8 inline-block">
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 gradient-text uppercase animate-slide-up">
                                AMAR DESH
                            </h1>
                            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink rounded-full"></div>
                        </div>
                        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-10 font-light animate-slide-up delay-100">
                            The Ultimate <span className="font-bold text-accent-cyan">AI-Powered</span> Travel Guide for Bangladesh
                        </p>

                        <div className="flex flex-col gap-6 w-full max-w-2xl justify-center items-center animate-slide-up delay-200">
                            <form onSubmit={handleSearch} className="w-full relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
                                <input
                                    type="text"
                                    placeholder="Search any destination in Bangladesh..."
                                    className="relative w-full px-6 py-4 rounded-full bg-dark-200/80 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 border border-white/10 shadow-2xl text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-purple hover:to-accent-pink text-white px-8 rounded-full font-bold transition-all duration-300 glow-cyan hover:scale-105"
                                >
                                    Search
                                </button>
                            </form>

                            <button
                                onClick={() => setViewState(ViewState.TRIP_PLANNER)}
                                className="group w-full md:w-auto px-10 py-4 glass-card rounded-full font-bold flex items-center justify-center gap-3 transition-all duration-300 hover-lift glow-purple hover:glow-pink"
                            >
                                <svg className="w-6 h-6 text-accent-pink group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                <span className="bg-gradient-to-r from-accent-pink via-accent-purple to-accent-cyan bg-clip-text text-transparent font-extrabold text-lg">Plan My Trip</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Browse Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                    {/* Tabs */}
                    <div className="flex justify-center mb-12 glass-card rounded-full p-2 w-fit mx-auto">
                        <button
                            onClick={() => setActiveTab('types')}
                            className={`relative pb-3 px-8 py-3 text-base font-bold transition-all duration-300 rounded-full ${activeTab === 'types'
                                ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Browse by Type
                        </button>
                        <button
                            onClick={() => setActiveTab('divisions')}
                            className={`relative pb-3 px-8 py-3 text-base font-bold transition-all duration-300 rounded-full ${activeTab === 'divisions'
                                ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Browse by Division
                        </button>
                    </div>

                    {/* Content Grid */}
                    <div className="min-h-[400px]">
                        {activeTab === 'types' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {TYPES.map((cat, idx) => (
                                    <div key={idx} className="glass-card rounded-2xl p-6 hover-lift group animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                                        <h3 className="text-xl font-bold text-white mb-5 group-hover:text-accent-cyan transition-colors">{cat.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {cat.places.map((place, pIdx) => (
                                                <button
                                                    key={pIdx}
                                                    onClick={() => loadDestination(place)}
                                                    className="text-sm glass px-4 py-2 rounded-full border border-white/20 hover:border-accent-cyan hover:bg-accent-cyan/20 text-slate-300 hover:text-white transition-all duration-300"
                                                >
                                                    {place}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'divisions' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {DIVISIONS.map((div, idx) => (
                                    <div key={idx} className="glass-card rounded-2xl overflow-hidden hover-lift animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 px-6 py-5 border-b border-white/10">
                                            <h3 className="text-xl font-bold text-white">{div.name}</h3>
                                        </div>
                                        <div className="p-6">
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {div.places.map((place, pIdx) => (
                                                    <li key={pIdx}>
                                                        <button
                                                            onClick={() => loadDestination(place)}
                                                            className="text-slate-300 hover:text-accent-cyan transition-colors text-sm text-left w-full truncate flex items-center gap-2 group"
                                                        >
                                                            <span className="text-accent-pink group-hover:scale-125 transition-transform">📍</span>
                                                            <span className="group-hover:translate-x-1 transition-transform">{place}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

    const renderPlanner = () => (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl top-10 right-10 animate-float"></div>
                <div className="absolute w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl bottom-10 left-10 animate-float delay-200"></div>
            </div>

            <header className="glass-card sticky top-0 z-40 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
                    <button
                        onClick={goHome}
                        className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all mr-3 group"
                    >
                        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold gradient-text">Back to Home</h1>
                </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-4 relative z-10">
                <TripPlannerForm
                    onPlanTrip={handlePlanTrip}
                    onCancel={goHome}
                    loading={loading}
                />
            </div>
            <Footer />
        </div>
    );

    const renderDetail = () => (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-accent-emerald/10 rounded-full blur-3xl top-0 right-0 animate-float"></div>
                <div className="absolute w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl bottom-0 left-0 animate-float delay-200"></div>
            </div>

            {/* Header */}
            <header className="glass-strong sticky top-0 z-40 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goHome}
                            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all group"
                        >
                            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-lg md:text-xl font-bold gradient-text capitalize truncate max-w-[150px] md:max-w-md">
                            {selectedDestination}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownloadPdf}
                            disabled={loading || !guideData}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-purple hover:to-accent-pink text-white rounded-xl transition-all text-xs md:text-sm font-bold glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download as PDF"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="hidden sm:inline">Download PDF</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">

                {/* Left Column: Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {loading ? (
                        <div className="glass-card rounded-2xl p-12 text-center animate-slide-up">
                            <Spinner />
                            <h3 className="mt-6 text-lg font-medium text-white">Creating your guide...</h3>
                            <div className="mt-4 space-y-2 max-w-md mx-auto">
                                <p className="text-sm text-slate-400 animate-pulse">Searching updated transport costs...</p>
                                <p className="text-sm text-slate-400 animate-pulse delay-100">Checking safety advisories...</p>
                                <p className="text-sm text-slate-400 animate-pulse delay-200">Finding best local food spots...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="glass-card rounded-2xl p-8 text-center border border-red-500/30 bg-red-500/10">
                            <h3 className="font-bold text-lg mb-2 text-red-400">Something went wrong</h3>
                            <p className="text-red-300">{error}</p>
                            <button onClick={goHome} className="mt-4 px-6 py-2 glass-card rounded-full text-sm font-medium hover:bg-white/10 transition-all">Go Back</button>
                        </div>
                    ) : guideData ? (
                        <>
                            {/* Wrap the printable content in a specific ID */}
                            <div id="guide-content" className="glass-card rounded-2xl overflow-hidden animate-slide-up">
                                {/* Dynamic Header Image Pattern */}
                                <div className="h-48 md:h-64 w-full animated-gradient relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-dark-900/40"></div>
                                    <h2 className="relative z-10 text-3xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-2xl">{guideData.locationName}</h2>
                                </div>

                                <div className="p-6 md:p-8">
                                    <MarkdownRenderer content={guideData.content} />
                                </div>
                            </div>

                            {/* Mobile only: Sources & Maps appear below content on small screens */}
                            <div className="lg:hidden space-y-6">
                                {/* Maps Grounding Results */}
                                {guideData.groundingChunks.some(c => c.maps) && (
                                    <div className="glass-card rounded-xl p-5">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Locations Found
                                        </h3>
                                        <div className="space-y-3">
                                            {guideData.groundingChunks.filter(c => c.maps).map((chunk, idx) => (
                                                <MapCard key={idx} chunk={chunk} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Right Column: AI Chat & Sources (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Sources (Web Grounding) */}
                    {!loading && guideData && guideData.groundingChunks.some(c => c.web) && (
                        <div className="glass-card rounded-xl p-4">
                            <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                <svg className="w-4 h-4 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                Web Sources
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                {guideData.groundingChunks.filter(c => c.web).map((chunk, idx) => (
                                    <WebSourceCard key={idx} chunk={chunk} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Desktop Maps Grounding */}
                    {!loading && guideData && guideData.groundingChunks.some(c => c.maps) && (
                        <div className="hidden lg:block glass-card rounded-xl p-5">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Locations Found
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {guideData.groundingChunks.filter(c => c.maps).map((chunk, idx) => (
                                    <MapCard key={idx} chunk={chunk} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Assistant Chat - Sticky on Desktop */}
                    <div className={`glass-strong rounded-xl flex flex-col h-[550px] glow-purple ${!loading && guideData ? 'lg:sticky lg:top-24' : ''}`}>
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 rounded-t-xl">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-accent-cyan/20 rounded-lg text-accent-cyan border border-accent-cyan/30">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Travel Assistant</h3>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
                                        Thinking Mode Active
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/30 custom-scrollbar">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                                    <div className={`max-w-[90%] rounded-2xl p-3 text-sm backdrop-blur-xl ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white rounded-br-none glow-cyan'
                                        : 'glass border border-white/20 text-white rounded-bl-none'
                                        }`}>
                                        <MarkdownRenderer content={msg.text} />
                                    </div>
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="flex justify-start">
                                    <div className="glass border border-white/20 rounded-2xl rounded-bl-none p-4 text-sm flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-medium">Thinking</span>
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-accent-purple rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-accent-pink rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleChatSubmit} className="p-3 border-t border-white/10 bg-dark-900/40 rounded-b-xl">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask about costs, scams, safe routes..."
                                    className="flex-1 px-4 py-2.5 glass border border-white/10 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all"
                                    disabled={loading || chatLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || chatLoading || !chatInput.trim()}
                                    className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-purple hover:to-accent-pink text-white p-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-cyan"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );

    return (
        <>
            {viewState === ViewState.HOME && renderHome()}
            {viewState === ViewState.TRIP_PLANNER && renderPlanner()}
            {viewState === ViewState.DESTINATION_DETAIL && renderDetail()}
        </>
    );
};