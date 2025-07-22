import React from "react";
import { List, Loader2, ChevronDown, ChevronUp, Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GrievanceCard from '../components/GrievanceCard';
import LatestGrievanceCard from '../components/LatestGrievanceCard';
import img1 from '../assets/Screenshot_2025-07-18_205109-removebg-preview.png';
import img2 from '../assets/Screenshot_2025-07-18_205341-removebg-preview.png';
import img3 from '../assets/Screenshot_2025-07-18_205657-removebg-preview.png';
import img4 from '../assets/Screenshot_2025-07-18_205816-removebg-preview.png';
import img5 from '../assets/Screenshot_2025-07-18_210026-removebg-preview.png';
import img6 from '../assets/Screenshot_2025-07-18_210118-removebg-preview.png';
import img7 from '../assets/Screenshot_2025-07-18_210234-removebg-preview.png';
// import img8 from '../assets/Screenshot 2025-07-18 205109.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchGrievances } from '../services/grievanceService';

const HomePage = ({setShowLoginModal}) => {
    const navigate = useNavigate();

    const {latestGrievances, grievanceStats} = useSelector((state) => state.grievance);
    const {user} = useSelector((state) => state.profile);

    const isLoggedIn = !!user;
    const userAccountType = user?.accountType || null;
    
    const PieChartData = [
        {name: 'Resolved', value: grievanceStats?.resolved || 0, color: '#10B981'},
        {name: 'Pending', value: grievanceStats?.pending || 0, color: '#F59E0B'},
        {name: 'Rejected', value: grievanceStats?.rejected || 0, color: '#EF4444'},
    ];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent}) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-sm">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const grievancesForInfiniteScroll = latestGrievances.length > 0 
        ? [...latestGrievances, ...latestGrievances] 
        : [];

    const faqs = [
        {
            question: "What is RAAH?",
            answer: "RAAH is a platform designed to simplify grievance redressal for citizens at the district level, allowing you to report issues and track their resolution.",
        },
        {
            question: "How do I submit a grievance?",
            answer: "You can submit a grievance by logging in and filling out the grievance submission form available on your dashboard.",
        },
        {
            question: "Can I track the status of my grievance?",
            answer: "Yes, after submitting a grievance, you can track its progress and receive updates through your profile dashboard.",
        },
        {
            question: "Who can use this platform?",
            answer: "Any citizen of the district can use RAAH to report issues and seek redressal.",
        },
        {
            question: "Is my information kept confidential?",
            answer: "Yes, your personal information and grievance details are kept confidential and are only accessible to authorized personnel.",
        },
    ];

    const [openIndex, setOpenIndex] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    const [displayedGrievances, setDisplayedGrievances] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const LIMIT = 10;

    React.useEffect(() => {
        // On mount, fetch the first page
        setDisplayedGrievances([]);
        setPage(1);
        setHasMore(true);
        fetchMoreGrievances(true);
    }, []);

    const fetchMoreGrievances = async (isFirst = false) => {
        setLoading(true);
        setError(null);
        try {
            const nextPage = isFirst ? 1 : page + 1;
            const params = { page: nextPage, limit: LIMIT };
            const response = await fetchGrievances(null, params);
            const newGrievances = response.grievances || [];
            setDisplayedGrievances(prev => isFirst ? newGrievances : [...prev, ...newGrievances]);
            setPage(nextPage);
            setHasMore(newGrievances.length === LIMIT);
        } catch (err) {
            setError(err.message || 'Failed to load grievances.');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <main className="container mx-auto px-4 py-8">
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 md:p-12 rounded-lg shadow-xl mb-12 text-center relative overflow-hidden animate-fade-in">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zm1 6v-1L1 0h-1z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                        RAAH: Your Voice, Our Action
                    </h1>
                    <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto opacity-90">
                        Simplifying grievance redressal for citizens at the District Level. Report issues, track progress, and get solutions efficiently.
                    </p>
                    {!isLoggedIn && (
                        <Link to="/login">
                            <button className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                                Submit a Grievance
                            </button>
                        </Link>
                    )}
                    {isLoggedIn && (
                        <p className="text-lg font-semibold">Logged in as: <span className="font-bold">{userAccountType}</span></p>
                    )}
                </div>
            </section>

            <section className="mb-20 bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-fade-in delay-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">District Grievance Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 text-gray-700">
                        <p className="text-lg">
                            As of today, our district has recorded a total of <span className="font-bold text-indigo-600 text-xl">{grievanceStats?.total || 0}</span> grievances.
                        </p>
                        <ul className="list-disc list-inside text-lg space-y-2">
                            <li><span className="font-semibold text-green-600">{grievanceStats?.resolved || 0}</span> grievances have been successfully resolved.</li>
                            <li><span className="font-semibold text-amber-600">{grievanceStats?.pending || 0}</span> grievances are currently pending or in progress.</li>
                            <li><span className="font-semibold text-red-600">{grievanceStats?.rejected || 0}</span> grievances were rejected due to various reasons.</li>
                        </ul>
                        <p className="text-md text-gray-600 italic">
                            Our commitment is to ensure every citizen's concern is addressed efficiently and transparently.
                        </p>
                    </div>

                    <div className="w-full h-64 flex justify-center items-center">
                        {grievanceStats?.total > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={PieChartData} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={100} fill="#8884d8" dataKey="value">
                                        {PieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500">No grievance data available for the chart.</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mb-20 animate-fade-in delay-400">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Latest Grievances</h2>
                    <button onClick={()=> navigate('/grievances')} className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                        See All Grievances <List size={20} className="ml-2" />
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="animate-spin text-indigo-500" size={48} />
                        <p className="ml-3 text-lg text-gray-600">Loading latest grievances...</p>
                    </div>
                )}
                {error && (
                    <p className="text-center text-red-600 text-lg py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                        Error loading grievance: {error}
                    </p>
                )}

                {displayedGrievances.length > 0 ? (
                    <div className="infinite-scroll-container bg-gray-50 rounded-lg shadow-inner p-4">
                        <InfiniteScroll
                            dataLength={displayedGrievances.length}
                            next={() => fetchMoreGrievances(false)}
                            hasMore={hasMore}
                            loader={<p className="text-center text-gray-500">Loading more grievances...</p>}
                            endMessage={<p className="text-center text-gray-400">No more grievances to show.</p>}
                        >
                            <div className="infinite-scroll-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                                {displayedGrievances.map((grievance, index) => (
                                    <LatestGrievanceCard key={`${grievance._id}-${index}`} grievance={grievance} />
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                ) : (
                    !loading && !error && (
                        <p className="text-center text-gray-600 text-lg py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            No latest grievances found for scrolling display.
                        </p>
                    )
                )}
            </section>

            {/* FAQ Section */}
            <section className="mb-20 animate-fade-in delay-500 relative">
                <div className="faq-bg-animated rounded-xl"></div>
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-lg tracking-tight relative z-10">Frequently Asked Questions</h2>
                <div className="p-1 rounded-xl max-w-2xl mx-auto relative z-10">
                    <ul className="space-y-6">
                        {faqs.map((faq, idx) => {
                            const isOpen = openIndex === idx;
                            return (
                                <li key={idx} className={`faq-glass${isOpen ? ' open' : ''} transition-transform duration-200 hover:scale-[1.02] relative`}>
                                    <button
                                        className="w-full flex justify-between items-center text-left focus:outline-none px-6 py-5 rounded-xl"
                                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-answer-${idx}`}
                                    >
                                        <span className={`font-semibold text-lg flex-1 text-left ${isOpen ? 'faq-gradient-text' : 'text-indigo-800'}`}>{faq.question}</span>
                                        <span className={`ml-4 flex-shrink-0 faq-chevron${isOpen ? ' open' : ''}`}>
                                            {isOpen ? (
                                                <ChevronUp className="" size={28} />
                                            ) : (
                                                <ChevronDown className="" size={28} />
                                            )}
                                        </span>
                                    </button>
                                    <div
                                        id={`faq-answer-${idx}`}
                                        className={`faq-answer${isOpen ? ' open' : ''} text-gray-700 text-base leading-relaxed px-6 pb-2`}
                                    >
                                        {faq.answer}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* Infinite Image Slider Section */}
            <div className="w-full mb-12" style={{ position: 'relative', height: '10rem', overflow: 'hidden' }}>
                <div className="slider-track items-center" style={{ animation: 'slider-infinite 30s linear infinite', height: '100%' }}>
                    {[img1, img2, img3, img4, img5, img6, img7, img1, img2, img3, img4, img5, img6, img7].map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`slider-img-${idx}`}
                            className="h-40 w-auto object-contain mx-2"
                            style={{ minWidth: '200px', maxHeight: '10rem' }}
                        />
                    ))}
                </div>
            </div>
        </main>

        {/* Some Notes */}
        <div className="flex items-center justify-center">
            <p className="text-red-700 italic"><span className="text-red-600 font-bold">*Note: </span>In case of emergency, You should visit nearest Police Station.</p>
        </div>

        {/* Footer Section */}
        <footer className="bg-gray-900 text-white py-10 text-center mt-12">
            <div className="container mx-auto flex flex-col md:flex-row items-start justify-between px-4 gap-8">
                {/* Brand and Description */}
                <div className="flex-1 mb-6 md:mb-0 text-left">
                    <div className="font-bold text-2xl tracking-wide mb-2">RAAH</div>
                    <div className="text-gray-400 text-sm max-w-xs mb-4">RAAH is your trusted platform for district-level grievance redressal. We empower citizens to raise issues and track their resolution transparently.</div>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" aria-label="Facebook" className="hover:text-indigo-400"><Facebook size={20} /></a>
                        <a href="#" aria-label="Twitter" className="hover:text-indigo-400"><Twitter size={20} /></a>
                        <a href="#" aria-label="Instagram" className="hover:text-indigo-400"><Instagram size={20} /></a>
                        <a href="mailto:support@raah.com" aria-label="Email" className="hover:text-indigo-400"><Mail size={20} /></a>
                    </div>
                </div>
                {/* Quick Links */}
                <div className="flex-1 mb-6 md:mb-0 text-left">
                    <div className="font-semibold text-lg mb-2">Quick Links</div>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/" className="hover:underline hover:text-indigo-400">Home</a></li>
                        <li><a href="/about" className="hover:underline hover:text-indigo-400">About</a></li>
                        <li><a href="/contact" className="hover:underline hover:text-indigo-400">Contact</a></li>
                        <li><a href="#" className="hover:underline hover:text-indigo-400">Privacy Policy</a></li>
                        <li><a href="#" className="hover:underline hover:text-indigo-400">Terms of Service</a></li>
                        <li><a href="#" className="hover:underline hover:text-indigo-400">FAQs</a></li>
                    </ul>
                </div>
                {/* Newsletter Subscription */}
                <div className="flex-1 mb-6 md:mb-0 text-left">
                    <div className="font-semibold text-lg mb-2">Newsletter</div>
                    <form className="flex flex-col sm:flex-row items-center gap-2">
                        <input type="email" placeholder="Your email address" className="px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-auto" />
                        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">Subscribe</button>
                    </form>
                    <div className="text-xs text-gray-400 mt-2">Get the latest updates and news from RAAH.</div>
                </div>
                {/* Address/Location */}
                <div className="flex-1 text-left">
                    <div className="font-semibold text-lg mb-2">Contact Us</div>
                    <div className="text-sm text-gray-400 mb-1">District Grievance Office</div>
                    <div className="text-sm text-gray-400 mb-1">123 Main Street, City, State, 123456</div>
                    <div className="text-sm text-gray-400 mb-1">Email: <a href="mailto:support@raah.com" className="underline hover:text-indigo-400">support@raah.com</a></div>
                    <div className="text-sm text-gray-400">Phone: <a href="tel:+911234567890" className="underline hover:text-indigo-400">+91 12345 67890</a></div>
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-8">&copy; {new Date().getFullYear()} RAAH. All rights reserved.</div>
        </footer>
        </>
    );
};

export default HomePage;
