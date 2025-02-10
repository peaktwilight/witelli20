'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getWeatherForecast, getWeatherDescription, type WeatherForecast } from '@/lib/weatherApi';
import { Cloud, Sun, CloudRain, Wind, Umbrella, House } from '@phosphor-icons/react';

function WeatherIcon({ code }: { code: number }) {
  if (code <= 1) return <Sun size={32} weight="light" className="text-yellow-400" />;
  if (code <= 3) return <Cloud size={32} weight="light" className="text-gray-400" />;
  return <CloudRain size={32} weight="light" className="text-blue-400" />;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function WeatherPage() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const data = await getWeatherForecast();
        setForecast(data);
      } catch {
        setError('Failed to load weather data');
      }
    }
    fetchWeather();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="py-2 sm:py-3 flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <House size={24} weight="light" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Weather
              </h1>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto text-white text-center"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!forecast) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="py-2 sm:py-3 flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <House size={24} weight="light" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Weather
              </h1>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto text-white text-center"
          >
            <p>Loading weather data...</p>
          </motion.div>
        </div>
      </main>
    );
  }

  // Get current hour index
  const now = new Date();
  const currentHourIndex = forecast.time.findIndex(time => 
    new Date(time).getHours() === now.getHours()
  );

  // Get next 24 hours of data
  const next24Hours = Array.from({ length: 24 }, (_, i) => {
    const idx = (currentHourIndex + i) % forecast.time.length;
    return {
      time: new Date(forecast.time[idx]),
      temp: forecast.temperature[idx],
      code: forecast.weatherCode[idx],
      precip: forecast.precipitation[idx]
    };
  });

  const currentWeather = next24Hours[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="py-2 sm:py-3 flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <House size={24} weight="light" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Weather
            </h1>
          </div>
        </div>
      </header>

      {/* Background Grid */}
      <div className="fixed inset-x-0 top-[72px] bottom-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Current Weather Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <WeatherIcon code={currentWeather.code} />
                  <h2 className="text-2xl font-semibold text-white">
                    {getWeatherDescription(currentWeather.code)}
                  </h2>
                </div>
                <div className="text-6xl font-light text-white">
                  {Math.round(currentWeather.temp)}°C
                </div>
                <div className="flex items-center space-x-4 text-white/60">
                  <div className="flex items-center">
                    <Umbrella size={20} className="mr-2" />
                    {currentWeather.precip}% precipitation
                  </div>
                  <div className="flex items-center">
                    <Wind size={20} className="mr-2" />
                    Light breeze
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60">
                  {currentWeather.time.toLocaleString('en-US', {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hourly Forecast */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {next24Hours.slice(1, 9).map((hour, i) => (
              <motion.div 
                key={i}
                variants={item}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors duration-200"
              >
                <div className="text-white/60 text-sm mb-2">
                  {hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center justify-between">
                  <WeatherIcon code={hour.code} />
                  <div className="text-right">
                    <div className="text-2xl font-light text-white">{Math.round(hour.temp)}°</div>
                    <div className="text-sm text-white/60">{hour.precip}%</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Extended Forecast */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Extended Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {next24Hours.slice(9, 13).map((hour, i) => (
                <motion.div 
                  key={i}
                  variants={item}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/60 mb-1">
                        {hour.time.toLocaleString('en-US', {
                          weekday: 'short',
                          hour: 'numeric',
                        })}
                      </div>
                      <div className="text-sm text-white">{getWeatherDescription(hour.code)}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <WeatherIcon code={hour.code} />
                      <div className="text-right">
                        <div className="text-2xl font-light text-white">{Math.round(hour.temp)}°</div>
                        <div className="text-sm text-white/60">{hour.precip}%</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
