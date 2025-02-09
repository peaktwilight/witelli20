import {
  Tram,
  Bus,
  Train,
  PersonSimpleWalk,
  MapPin,
} from '@phosphor-icons/react';

export default function TransportIcon({ type }: { type: string }) {
  // All icons use same styling
  const iconProps = {
    size: 20,
    weight: "light" as const,
  };

  switch (type.toUpperCase()) {
    case 'TRAM':
    case 'T':
      return <Tram {...iconProps} />;
    
    case 'BUS':
    case 'B':
      return <Bus {...iconProps} />;
    
    case 'S':
    case 'TRAIN':
    case 'IR':
    case 'IC':
      return <Train {...iconProps} />;
    
    case 'WALK':
      return <PersonSimpleWalk {...iconProps} />;
      
    default:
      return <MapPin {...iconProps} />;
  }
}
