import { styled, Typography } from '@mui/material';
import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';


const AppName = styled(Typography)(({ style }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#007afe',
  ...style,
}));

interface AppNameProps {
  styles?: React.CSSProperties;
  animate?: boolean;
  onClick?: () => void;
}

const AppNameComponent: React.FC<AppNameProps> = ({ styles, animate, onClick }) => {
  const [animationFinished, setAnimationFinished] = useState<boolean>(false);

  return <AppName
    style={styles}
    onClick={() => onClick && onClick()}
    sx={{
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    {animationFinished || !animate ?
      'Ubi-to-do ' :
      <TypeAnimation
        sequence={[
          'Ubiquiti',
          1000,
          'Ubi',
          300,
          'Ubi-to-do',
          () => {
            setAnimationFinished(true)
          }
        ]}
        wrapper="span"
        cursor={true}
        repeat={0}
      />
    }
  </AppName>;
}

export default AppNameComponent;
