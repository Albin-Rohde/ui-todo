import React, {useState} from 'react';
import {styled, Typography} from '@mui/material';
import {TypeAnimation} from 'react-type-animation';


const AppName = styled(Typography)(({theme, style}) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#007afe',
  ...style,
}));

interface AppNameProps {
  styles?: React.CSSProperties;
  animate?: boolean;
}

const AppNameComponent: React.FC<AppNameProps> = ({styles, animate}) => {
  const [animationFinished, setAnimationFinished] = useState<boolean>(false);

  return <AppName style={styles}>
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
