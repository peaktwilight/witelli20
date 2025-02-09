import TransportIcon from './TransportIcon';

interface TransportBadgeProps {
  category: string;
  number: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    badge: 'h-7 text-xs',
    icon: 'w-4 h-4',
    number: 'text-xs',
  },
  md: {
    badge: 'h-8 text-sm',
    icon: 'w-5 h-5',
    number: 'text-sm',
  },
  lg: {
    badge: 'h-10 text-base',
    icon: 'w-6 h-6',
    number: 'text-base',
  },
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  TRAM: { bg: 'bg-red-500', text: 'text-red-100' },
  T: { bg: 'bg-red-500', text: 'text-red-100' },
  BUS: { bg: 'bg-blue-500', text: 'text-blue-100' },
  B: { bg: 'bg-blue-500', text: 'text-blue-100' },
  S: { bg: 'bg-purple-500', text: 'text-purple-100' },
  TRAIN: { bg: 'bg-purple-500', text: 'text-purple-100' },
  IR: { bg: 'bg-indigo-500', text: 'text-indigo-100' },
  IC: { bg: 'bg-indigo-500', text: 'text-indigo-100' },
  DEFAULT: { bg: 'bg-gray-500', text: 'text-gray-100' },
};

export default function TransportBadge({ category, number, size = 'md' }: TransportBadgeProps) {
  const { bg, text } = categoryColors[category.toUpperCase()] || categoryColors.DEFAULT;
  const { badge, icon, number: numberSize } = sizeClasses[size];

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-2 
      rounded-lg ${badge} ${bg} ${text}
      shadow-sm shadow-black/10
      backdrop-blur-sm
      transition-all duration-200
      border border-white/20
      font-medium
    `}>
      <div className={`opacity-90 ${icon}`}>
        <TransportIcon type={category} />
      </div>
      <div className={`font-mono tracking-wide ${numberSize}`}>
        {number}
      </div>
    </div>
  );
}
