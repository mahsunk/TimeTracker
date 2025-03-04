import React from 'react';
import { View } from 'react-native';
import ManualMode from '../components/ManualMode';
import { router } from 'expo-router';

export default function ManualScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ManualMode onClose={() => router.back()} />
    </View>
  );
} 