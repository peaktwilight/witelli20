'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWeatherForecast, getWeatherDescription, type WeatherForecast } from '@/lib/weatherApi';
import { Cloud, Sun, CloudRain, Wind, Umbrella } from '@phosphor-icons/react';
import Link from 'next/link';

function WeatherIcon({ code, size = 24 }: { code: number; size?: number }) {
  if (code <= 1) return <Sun size={size} weight="light" className="text-yellow-400" />;
  if (code <= 3) return <Cloud size={size} weight="light" className="text-gray-400" />;
  return <CloudRain size={size} weight="light" className="text-blue-400" />;
}

export default function WeatherWidget() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setIsLoading(true);
        const data = await getWeatherForecast();
        setForecast(data);
      } catch {
        setError('Failed to load weather');
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 h-full">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="h-10 bg-white/20 rounded w-1/2"></div>
          <div className="flex gap-2">
            <div className="h-5 bg-white/20 rounded w-1/4"></div>
            <div className="h-5 bg-white/20 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 flex flex-col items-center justify-center h-full">
        <Cloud size={32} className="text-white/50 mb-2" />
        <p className="text-white/70 text-sm">Weather not available</p>
      </div>
    );
  }

  // Get current hour index
  const now = new Date();
  const currentHourIndex = forecast.time.findIndex(time => 
    new Date(time).getHours() === now.getHours()
  );

  // Get next few hours of data
  const nextHours = Array.from({ length: 5 }, (_, i) => {
    const idx = (currentHourIndex + i) % forecast.time.length;
    return {
      time: new Date(forecast.time[idx]),
      temp: forecast.temperature[idx],
      code: forecast.weatherCode[idx],
      precip: forecast.precipitation[idx]
    };
  });

  const currentWeather = nextHours[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-5 h-full"
    >
      <Link href="/weather" className="block group">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <WeatherIcon code={currentWeather.code} size={28} />
              <h3 className="text-white font-medium">
                Balgrist
              </h3>
            </div>
            <span className="text-white/60 text-sm">
              {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-3xl font-light text-white">
              {Math.round(currentWeather.temp)}°C
            </div>
            <div className="text-white/60 text-sm">
              {getWeatherDescription(currentWeather.code)}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-white/70 text-xs">
            <div className="flex items-center">
              <Umbrella size={14} className="mr-1" />
              {currentWeather.precip}% rain
            </div>
          </div>
          
          <div className="flex justify-between pt-3 border-t border-white/10 text-white/90 text-sm group-hover:border-white/20 transition-colors">
            {nextHours.slice(1, 5).map((hour, i) => (
              <div key={i} className="text-center">
                <div className="text-white/50 text-xs mb-1">
                  {hour.time.getHours()}:00
                </div>
                <WeatherIcon code={hour.code} size={16} />
                <div className="mt-1 font-medium">{Math.round(hour.temp)}°</div>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}