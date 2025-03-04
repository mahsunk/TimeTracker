import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

interface LoadingIndicatorProps {
  type?: 'dots' | 'spinner';
  size?: number;
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  type = 'spinner',
  size = 24,
  message,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size={size}
        style={styles.indicator}
      />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
});

export default LoadingIndicator; 