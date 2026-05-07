import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../services/api';

interface Props {
  readonly task: Task;
  readonly onToggle: (id: string, completed: boolean) => void;
  readonly onEdit: (id: string, title: string, description: string) => void;
  readonly onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [titleError, setTitleError] = useState('');

  const date = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  function handleSave() {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    onEdit(task._id, title.trim(), description.trim());
    setEditing(false);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setTitleError('');
    setEditing(false);
  }

  if (editing) {
    return (
      <View style={styles.card}>
        <TextInput
          style={[styles.editInput, titleError ? styles.inputError : null]}
          value={title}
          onChangeText={(t) => { setTitle(t); setTitleError(''); }}
          placeholder="Task title"
          placeholderTextColor="#9CA3AF"
          autoFocus
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

        <TextInput
          style={[styles.editInput, styles.editTextArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description (optional)"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={2}
        />

        <View style={styles.editActions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      <View style={styles.top}>
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={() => onToggle(task._id, !task.completed)}
          activeOpacity={0.7}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]} numberOfLines={2}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => setEditing(true)}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(task._id)}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardCompleted: {
    opacity: 0.6,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    padding: 4,
  },
  editIcon: {
    fontSize: 15,
    color: '#2563EB',
  },
  deleteText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Edit mode
  editInput: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  editTextArea: {
    minHeight: 56,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -4,
    marginBottom: 6,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
