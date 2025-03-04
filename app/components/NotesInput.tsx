import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import i18nService from '../services/i18nService';

interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
}

const NotesInput: React.FC<NotesInputProps> = ({ value, onChange }) => {
  return (
    <TextInput
      mode="outlined"
      value={value}
      onChangeText={onChange}
      placeholder={i18nService.t('addNote')}
      multiline
      numberOfLines={4}
      style={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
  },
});

export default NotesInput; 