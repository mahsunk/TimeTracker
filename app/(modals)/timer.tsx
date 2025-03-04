import React from 'react';
import { View } from 'react-native';
import TimerMode from '../components/TimerMode';
import { router } from 'expo-router';

export default function TimerScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TimerMode onClose={() => router.back()} />
    </View>
  );
} 