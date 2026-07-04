import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { useTheme } from '../store/useThemeStore';

export const TodoTab = () => {
  const todos = useStore(state => state.todos || []);
  const addTodo = useStore(state => state.addTodo);
  const toggleTodo = useStore(state => state.toggleTodo);
  const removeTodo = useStore(state => state.removeTodo);
  const triggerToast = useStore(state => state.triggerToast);
  const { colors, fontScale } = useTheme();
  const styles = getStyles(colors, fontScale);

  // Calendar setup
  const getCalendarDays = () => {
    const days = [];
    const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      days.push({
        dayName: weekNames[futureDate.getDay()],
        dayNum: futureDate.getDate(),
        dayIndex: futureDate.getDay(),
        dateString: futureDate.toDateString()
      });
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay());

  // Modal / Form state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const handleAddTaskSubmit = () => {
    if (!newTaskText.trim()) {
      triggerToast('Task description cannot be empty.', 'warning');
      return;
    }

    const newTodo = {
      id: Math.random().toString(36).substring(2, 9),
      task: newTaskText.trim(),
      priority: newTaskPriority,
      completed: false,
      scheduledDayIndex: selectedDayIndex
    };

    addTodo(newTodo);
    setNewTaskText('');
    setNewTaskPriority('medium');
    setIsAddTaskOpen(false);
    triggerToast('New task added successfully!', 'success');
  };

  const handleDeleteTodo = (id) => {
    removeTodo(id);
    triggerToast('Task removed.', 'info');
  };

  const filteredTodos = todos.filter(todo => todo.scheduledDayIndex === selectedDayIndex);

  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Farm Activities</Text>
          <Text style={styles.sectionSubtitle}>Keep track of crop management schedules.</Text>
        </View>
        <TouchableOpacity 
          style={styles.addTaskBtn}
          onPress={() => setIsAddTaskOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addTaskBtnText}>＋ Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Calendar Ribbon */}
      <View style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScroll}
        >
          {calendarDays.map((day, idx) => {
            const isSelected = selectedDayIndex === day.dayIndex;
            const isToday = day.dateString === new Date().toDateString();
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedDayIndex(day.dayIndex)}
                activeOpacity={0.8}
                style={[
                  styles.calendarDayCard,
                  isSelected && styles.calendarDayCardSelected
                ]}
              >
                <Text style={[
                  styles.calendarDayName,
                  isSelected && styles.calendarDayNameSelected
                ]}>
                  {day.dayName}
                </Text>
                <Text style={[
                  styles.calendarDayNum,
                  isSelected && styles.calendarDayNumSelected
                ]}>
                  {day.dayNum}
                </Text>
                {isToday && !isSelected && (
                  <View style={styles.todayIndicatorDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Todo List */}
      <ScrollView 
        style={styles.todoScroll}
        contentContainerStyle={styles.todoScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTodos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No activities scheduled</Text>
            <Text style={styles.emptyDesc}>
              There are no tasks scheduled for this weekday. Rest up or click "Add Task" to schedule custom actions.
            </Text>
          </View>
        ) : (
          filteredTodos.map((todo) => {
            const isCompleted = todo.completed;
            return (
              <View 
                key={todo.id} 
                style={[
                  styles.todoCard,
                  isCompleted && styles.todoCardCompleted
                ]}
              >
                <TouchableOpacity 
                  style={styles.todoClickableArea} 
                  onPress={() => toggleTodo(todo.id)}
                  activeOpacity={0.7}
                >
                  {/* Custom Checkbox */}
                  <View style={[
                    styles.checkbox,
                    isCompleted && styles.checkboxCompleted
                  ]}>
                    {isCompleted && (
                      <MaterialIcons name="check" size={14} color={colors.primaryText} />
                    )}
                  </View>

                  <View style={styles.todoTextContainer}>
                    <Text style={[
                      styles.todoTaskText,
                      isCompleted && styles.todoTaskTextCompleted
                    ]}>
                      {todo.task}
                    </Text>

                    {/* Priority Badge */}
                    <View style={[
                      styles.priorityBadge,
                      todo.priority === 'high' && styles.priorityHigh,
                      todo.priority === 'medium' && styles.priorityMedium,
                      todo.priority === 'low' && styles.priorityLow
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        todo.priority === 'high' && styles.priorityTextHigh,
                        todo.priority === 'medium' && styles.priorityTextMedium,
                        todo.priority === 'low' && styles.priorityTextLow
                      ]}>
                        {todo.priority.toUpperCase()} PRIORITY
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity 
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteTodo(todo.id)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="delete-outline" size={20} color={colors.subtext} />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Task Bottom Sheet / Modal */}
      <Modal
        visible={isAddTaskOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddTaskOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Activity</Text>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.inputLabel}>Activity Description</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Schedule watering in Paddy fields"
                  placeholderTextColor={colors.placeholder}
                  value={newTaskText}
                  onChangeText={setNewTaskText}
                  autoFocus
                />
              </View>

              {/* Priority Selector */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.inputLabel}>Priority Level</Text>
                <View style={styles.prioritySelectorRow}>
                  {['high', 'medium', 'low'].map((p) => {
                    const isSelected = newTaskPriority === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.prioritySelectorBtn,
                          isSelected && styles.prioritySelectorBtnActive
                        ]}
                        onPress={() => setNewTaskPriority(p)}
                        activeOpacity={0.8}
                      >
                        <Text style={[
                          styles.prioritySelectorBtnText,
                          isSelected && styles.prioritySelectorBtnTextActive
                        ]}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalBtnRow}>
                <Button 
                  variant="outline" 
                  style={styles.modalHalfBtn} 
                  onPress={() => {
                    setIsAddTaskOpen(false);
                    setNewTaskText('');
                    setNewTaskPriority('medium');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  style={styles.modalHalfBtn} 
                  onPress={handleAddTaskSubmit}
                >
                  Create Task
                </Button>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors, fontScale) => StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: fontScale(14),
    fontWeight: '900',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: fontScale(10),
    color: colors.subtext,
    marginTop: 2,
    fontWeight: '550',
  },
  addTaskBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addTaskBtnText: {
    color: colors.primaryText,
    fontSize: fontScale(11),
    fontWeight: '700',
  },
  calendarContainer: {
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  calendarScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  calendarDayCard: {
    width: 44,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  calendarDayCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  calendarDayName: {
    fontSize: fontScale(8),
    fontWeight: '900',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  calendarDayNameSelected: {
    color: colors.primaryText,
  },
  calendarDayNum: {
    fontSize: fontScale(14),
    fontWeight: '800',
    color: colors.text,
  },
  calendarDayNumSelected: {
    color: colors.primaryText,
  },
  todayIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 4,
  },
  todoScroll: {
    flex: 1,
  },
  todoScrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: fontScale(32),
  },
  emptyTitle: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    color: colors.text,
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: fontScale(10.5),
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
    paddingHorizontal: 12,
  },
  todoCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  todoCardCompleted: {
    opacity: 0.6,
  },
  todoClickableArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  todoTextContainer: {
    flex: 1,
    gap: 6,
  },
  todoTaskText: {
    fontSize: fontScale(12.5),
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },
  todoTaskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.subtext,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  priorityHigh: {
    backgroundColor: colors.toastErrorBg,
    borderColor: colors.border,
  },
  priorityMedium: {
    backgroundColor: colors.toastWarningBg,
    borderColor: colors.border,
  },
  priorityLow: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  priorityText: {
    fontSize: fontScale(8),
    fontWeight: '900',
  },
  priorityTextHigh: {
    color: colors.toastErrorText,
  },
  priorityTextMedium: {
    color: colors.toastWarningText,
  },
  priorityTextLow: {
    color: colors.subtext,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalSafeArea: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  modalTitle: {
    fontSize: fontScale(14),
    fontWeight: '900',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  modalInputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: fontScale(9),
    fontWeight: '900',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    fontSize: fontScale(13),
    color: colors.text,
  },
  prioritySelectorRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },
  prioritySelectorBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  prioritySelectorBtnActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  prioritySelectorBtnText: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: colors.subtext,
  },
  prioritySelectorBtnTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalHalfBtn: {
    flex: 1,
  },
});

