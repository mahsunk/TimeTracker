import React from 'react';
import { View } from 'react-native';
import TimerMode from './components/TimerMode';

export default function TimerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TimerMode onClose={() => {}} />
    </View>
  );
} 