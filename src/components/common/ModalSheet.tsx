import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../theme';

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ModalSheet = ({ visible, onClose, title, children }: ModalSheetProps) => {
  const activeColors = {
    card: colors.surface,
    text: colors.text,
    primary: colors.primary,
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: activeColors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: activeColors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: activeColors.primary, fontWeight: '600' }}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
});
