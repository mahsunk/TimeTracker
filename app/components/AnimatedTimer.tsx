import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

interface AnimatedTimerProps {
  time: number;
  isRunning: boolean;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const AnimatedTimer: React.FC<AnimatedTimerProps> = ({ time, isRunning }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isRunning) {
      // Nabız efekti
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );

      // Dönen halka animasyonu
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 3000,
        }),
        -1
      );

      // İlerleme çizgisi
      progress.value = withSpring(1);
    } else {
      // Animasyonları durdur
      cancelAnimation(scale);
      cancelAnimation(rotation);
      cancelAnimation(progress);
      
      scale.value = withSpring(1);
      rotation.value = withSpring(0);
      progress.value = withSpring(0);
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotation);
      cancelAnimation(progress);
    };
  }, [isRunning]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timerContainer, containerStyle]}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={[styles.progressRing, progressStyle]} />
        <View style={styles.timeContainer}>
          <Text variant="displayLarge" style={styles.timeText}>
            {formatTime(time)}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 10,
    borderColor: 'rgba(33, 150, 243, 0.3)',
  },
  progressRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#2196F3',
    borderStyle: 'dotted',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

export default AnimatedTimer; 