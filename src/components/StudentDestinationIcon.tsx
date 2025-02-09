import {
  Atom,
  GraduationCap,
  Buildings,
  MusicNotes,
  Barbell,
  Factory,
} from '@phosphor-icons/react';
import { type ReactNode } from 'react';

interface StudentDestinationIconProps {
  destination: string;
}

export default function StudentDestinationIcon({ destination }: StudentDestinationIconProps): ReactNode {
  // All icons use same styling
  const iconProps = {
    size: 20,
    weight: "light" as const,
  };

  if (destination.includes('ETH')) {
    return <Atom {...iconProps} />;
  }
  
  if (destination.includes('UZH')) {
    return <GraduationCap {...iconProps} />;
  }
  
  if (destination.includes('ASVZ')) {
    return <Barbell {...iconProps} />;
  }
  
  if (destination.includes('ZHDK')) {
    return <MusicNotes {...iconProps} />;
  }
  
  if (destination.includes('ZHAW')) {
    return <Factory {...iconProps} />;
  }
  
  if (destination.includes('FHNW')) {
    return <Buildings {...iconProps} />;
  }
  
  return <Buildings {...iconProps} />;
}
