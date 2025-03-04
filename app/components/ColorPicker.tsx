import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const colors = [
  '#EF4444', // Kırmızı
  '#F97316', // Turuncu
  '#F59E0B', // Amber
  '#84CC16', // Lime
  '#22C55E', // Yeşil
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Açık Mavi
  '#3B82F6', // Mavi
  '#6366F1', // Indigo
  '#8B5CF6', // Mor
  '#A855F7', // Pembe Mor
  '#D946EF', // Fuşya
  '#EC4899', // Pembe
  '#64748B', // Slate
];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelectColor(color)}
          style={[
            styles.colorButton,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor
          ]}
        >
          {selectedColor === color && (
            <View style={styles.checkmark} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  content: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 12,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
});

export default ColorPicker; 