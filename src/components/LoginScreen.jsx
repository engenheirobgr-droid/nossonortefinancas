import React, { useEffect, useRef, useState } from 'react';

export default function LoginScreen({ USER_CONFIG, ChevronLeft, Heart, X, onLoginSuccess }) {
    const [user, setUser] = useState(null);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isSearching, setIsSearching] = useState(true);
    const needleRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsSearching(false), 2500);

        const handleMouseMove = (event) => {
            if (!needleRef.current || isSearching) return;

            const rect = needleRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = event.clientX - centerX;
            const deltaY = event.clientY - centerY;
            const angle = (Math.atan2(deltaY, deltaX) * 180 / Math.PI) + 90;

            needleRef.current.style.transform = `rotate(${angle}deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isSearching]);

    const handlePin = (value) => {
        if (value.length > 4) return;
        setPin(value);
    };

    const submit = () => {
        if (user && pin === USER_CONFIG[user].defaultPin) {
            onLoginSuccess(user);
            return;
        }

        setError('Senha incorreta');
        setPin('');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden cursor-crosshair">
                <div className="w-32 h-32 relative mb-8 animate-in select-none flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.25)]">
                        <svg width="65%" height="65%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
                        </svg>
                    </div>

                    <div className="absolute top-2 right-1.5 w-[35px] h-[35px] flex items-center justify-center z-20">
                        <div className="absolute inset-0 border-2 border-slate-600 rounded-full bg-slate-900/80 backdrop-blur-sm" />
                        <div
                            ref={needleRef}
                            className={`relative w-full h-full flex items-center justify-center transition-transform duration-75 ease-out ${isSearching ? 'animate-[spin_2s_ease-in-out_infinite]' : ''}`}
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                        >
                            <svg width="20" height="42" viewBox="0 0 20 42">
                                <path d="M10 2 L16 21 H4 Z" fill="#ef4444" />
                                <path d="M10 40 L16 21 H4 Z" fill="#e2e8f0" />
                                <circle cx="10" cy="21" r="2" fill="#0f172a" />
                            </svg>
                        </div>
                    </div>

                    <div className="absolute bottom-2 right-1 animate-pulse z-10">
                        <Heart width={35} height={35} className="text-rose-500 fill-rose-500 drop-shadow-2xl" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">Nosso Norte</h1>
                <p className="text-slate-400 mb-10 text-center">Finanças a dois,<br />sem complicações.</p>

                <div className="w-full max-w-sm grid gap-4 relative z-10">
                    {Object.entries(USER_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setUser(key)}
                            className="bg-slate-800/50 border border-white/10 p-4 rounded-2xl flex items-center gap-4 active:scale-95 transition-all hover:bg-slate-800 hover:border-emerald-500/30 group"
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${config.color} group-hover:scale-110 transition-transform`}>
                                {config.avatar}
                            </div>
                            <span className="text-lg font-bold">Sou {config.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-white font-sans animate-in">
            <button onClick={() => setUser(null)} className="absolute top-8 left-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><ChevronLeft /></button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-slate-700 ${USER_CONFIG[user].color}`}>
                {USER_CONFIG[user].avatar}
            </div>
            <h2 className="text-xl font-bold mb-8">Olá, {USER_CONFIG[user].name}</h2>
            <div className="flex gap-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                    <div key={index} className={`w-3 h-3 rounded-full transition-colors duration-300 ${pin.length > index ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                ))}
            </div>
            {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-1 rounded-lg">{error}</p>}
            <div className="grid grid-cols-3 gap-4 w-64">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <button key={number} onClick={() => handlePin(pin + number)} className="h-16 rounded-2xl bg-white/5 text-xl font-bold active:scale-95 hover:bg-white/10 transition-colors">{number}</button>
                ))}
                <div />
                <button onClick={() => handlePin(pin + '0')} className="h-16 rounded-2xl bg-white/5 text-xl font-bold active:scale-95 hover:bg-white/10 transition-colors">0</button>
                <button onClick={() => setPin(pin.slice(0, -1))} className="h-16 rounded-2xl flex items-center justify-center active:scale-95 hover:bg-white/10 transition-colors"><X /></button>
            </div>
            <button onClick={submit} disabled={pin.length !== 4} className={`w-64 mt-6 py-4 rounded-2xl font-bold transition-all duration-300 ${pin.length === 4 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>Entrar</button>
        </div>
    );
}
