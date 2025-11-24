import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock as ClockIcon,
  Copy,
  Globe,
  GripVertical,
  Loader2,
  MoreVertical,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';

import { Checkmark } from '@/components/ui/Checkmark';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { usePlannerContext } from '@/context/AppContext';
import { generateMarkdown } from '@/utils/markdown';
import { getCourseProgress } from '@/utils/course';
import { Course, Exam, Task, Unit } from '@/types';

interface Props {
  courseId: string;
  onOpenTaskDetails: (task: Task) => void;
}

export const CourseDetail = ({ courseId, onOpenTaskDetails }: Props) => {
  const {
    courses,
    completedTasks,
    toggleTask,
    updateCourse,
    updateCourseMeta,
    addTaskToCourse
  } = usePlannerContext();
  const course = courses.find(c => c.id === courseId);

  const [openUnits, setOpenUnits] = useState<Set<number>>(new Set([0]));
  const [newTaskText, setNewTaskText] = useState('');
  const [localUnits, setLocalUnits] = useState<Unit[]>(course?.units || []);
  const [dragSource, setDragSource] = useState<{ unitIdx: number; taskIdx: number } | null>(null);
  const [dragTarget, setDragTarget] = useState<{ unitIdx: number; taskIdx: number } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const [deleteModalData, setDeleteModalData] = useState<{ unitIdx: number; taskIdx: number } | null>(null);
  const [showExamManager, setShowExamManager] = useState(false);
  const [newExamLabel, setNewExamLabel] = useState('');
  const [newExamDate, setNewExamDate] = useState('');

  useEffect(() => {
    if (!isDirty && course) {
      setLocalUnits(course.units);
    }
  }, [course, isDirty]);

  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [isDirty, localUnits]);

  if (!course) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Ders bulunamadı.</p>
      </div>
    );
  }

  const progress = getCourseProgress(course, completedTasks);

  const toggleUnit = (idx: number) => {
    const next = new Set(openUnits);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setOpenUnits(next);
  };

  const handleDragStart = (unitIdx: number, taskIdx: number) => {
    setDragSource({ unitIdx, taskIdx });
  };

  const handleDragEnter = (unitIdx: number, taskIdx: number) => {
    if (dragSource && dragSource.unitIdx === unitIdx) {
      setDragTarget({ unitIdx, taskIdx });
    }
  };

  const handleDrop = (targetUnitIdx: number, targetTaskIdx: number) => {
    if (dragSource && dragSource.unitIdx === targetUnitIdx && dragSource.taskIdx !== targetTaskIdx) {
      const newUnits = [...localUnits];
      const tasks = [...newUnits[dragSource.unitIdx].tasks];
      const [movedTask] = tasks.splice(dragSource.taskIdx, 1);
      tasks.splice(targetTaskIdx, 0, movedTask);
      newUnits[dragSource.unitIdx].tasks = tasks;
      setLocalUnits(newUnits);
      setIsDirty(true);
    }
    setDragSource(null);
    setDragTarget(null);
  };

  const handleDragEnd = () => {
    setDragSource(null);
    setDragTarget(null);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateCourse(course.id, localUnits);
    setIsDirty(false);
    setTimeout(() => {
      setIsSaving(false);
      const event = new CustomEvent('toast', { 
        detail: { message: 'Değişiklikler kaydedildi', type: 'success' } 
      });
      window.dispatchEvent(event);
    }, 800);
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    addTaskToCourse(course.id, newTaskText);
    setNewTaskText('');
    const next = new Set(openUnits);
    next.add(localUnits.length - 1);
    setOpenUnits(next);
    setIsDirty(false);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const saveEditing = (unitIdx: number, taskIdx: number) => {
    if (!editingTaskId) return;
    const newUnits = [...localUnits];
    newUnits[unitIdx].tasks[taskIdx].text = editingText;
    setLocalUnits(newUnits);
    setIsDirty(true);
    setEditingTaskId(null);
  };

  const confirmDelete = () => {
    if (!deleteModalData) return;
    const { unitIdx, taskIdx } = deleteModalData;
    const newUnits = [...localUnits];
    newUnits[unitIdx].tasks.splice(taskIdx, 1);
    setLocalUnits(newUnits);
    setIsDirty(true);
    setDeleteModalData(null);
  };

  const copySyllabus = async () => {
    try {
      const md = generateMarkdown(course, completedTasks);
      await navigator.clipboard.writeText(md);
      const event = new CustomEvent('toast', { 
        detail: { message: 'Syllabus kopyalandı!', type: 'success' } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('toast', { 
        detail: { message: 'Kopyalama başarısız', type: 'error' } 
      });
      window.dispatchEvent(event);
    }
  };

  const handleAddExam = () => {
    if (!newExamLabel || !newExamDate) {
      alert('Lütfen sınav adı ve tarihi giriniz.');
      return;
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      title: newExamLabel,
      date: newExamDate
    };

    const updatedExams = [...(course.exams || []), newExam].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    updateCourseMeta(course.id, { exams: updatedExams });
    setNewExamLabel('');
    setNewExamDate('');
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm('Bu sınavı silmek istediğinize emin misiniz?')) {
      const updatedExams = (course.exams || []).filter(exam => exam.id !== examId);
      updateCourseMeta(course.id, { exams: updatedExams });
    }
  };

  const nextExamInfo = (() => {
    const now = Date.now();
    if (!course.exams || course.exams.length === 0) return null;
    const nextExam = course.exams.find(exam => new Date(exam.date).getTime() > now);
    if (!nextExam) return null;
    const days = Math.ceil((new Date(nextExam.date).getTime() - now) / (1000 * 3600 * 24));
    return { days, title: nextExam.title };
  })();

  return (
    <div className="animate-fade-in pb-20">
      <ConfirmationModal
        isOpen={!!deleteModalData}
        onClose={() => setDeleteModalData(null)}
        onConfirm={confirmDelete}
        title="Görevi Sil"
        message="Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />

      <div className={`relative ${course.bgGradient} p-6 md:p-10 overflow-hidden`}>
        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10 blur-3xl"></div>
        <div className="relative z-10 w-full flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                {course.code}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white shadow-black drop-shadow-lg">{course.title}</h1>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-colors ${
                  isDirty ? 'bg-amber-500/80 text-white' : isSaving ? 'bg-indigo-500/80 text-white' : 'bg-white/20 text-white'
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" /> Kaydediliyor...
                  </span>
                ) : isDirty ? (
                  <span className="flex items-center gap-1">Kaydedilmedi</span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Check size={12} /> Kaydedildi
                  </span>
                )}
              </div>

              <button
                onClick={copySyllabus}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-md transition-colors"
              >
                <Copy size={12} /> Syllabus Kopyala
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setShowExamManager(prev => !prev)}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-xl border border-white/20 flex items-center gap-3 text-white transition-colors"
              >
                <ClockIcon size={20} />
                <div className="text-left">
                  <p className="text-xs opacity-70 font-bold uppercase">Sınav Takvimi</p>
                  <p className="font-bold text-sm">
                    {nextExamInfo ? `${nextExamInfo.days} Gün Kaldı` : 'Sınav Ekle'}
                  </p>
                </div>
                <ChevronDown size={16} className={`transition-transform ${showExamManager ? 'rotate-180' : ''}`} />
              </button>

              {nextExamInfo && nextExamInfo.days <= 3 && (
                <div className="px-3 py-1 rounded-lg bg-red-500 text-white animate-pulse flex flex-col items-center justify-center shadow-lg">
                  <span className="text-[10px] uppercase font-bold text-red-100">Acil</span>
                  <span className="text-sm font-bold leading-none">{nextExamInfo.title}</span>
                </div>
              )}
            </div>

            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">İlerleme</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">%{progress}</p>
              </div>
              <CircularProgress percentage={progress} colorClass={course.color.split(' ')[0].replace('bg-', 'text-')} size={40} />
            </div>
          </div>

          {showExamManager && (
            <div className="bg-white dark:bg-dark-surface rounded-xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in mt-2">
              <h3 className="text-sm font-bold text-slate-700 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                Sınav Listesi
              </h3>
              <div className="space-y-2 mb-4">
                {course.exams && course.exams.length > 0 ? (
                  course.exams.map(exam => (
                    <div key={exam.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{exam.title}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(exam.date).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteExam(exam.id)} className="p-1 text-red-400 hover:text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Henüz sınav eklenmedi.</p>
                )}
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Sınav Adı</label>
                  <input
                    type="text"
                    value={newExamLabel}
                    onChange={e => setNewExamLabel(e.target.value)}
                    placeholder="Örn: Vize 1"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Tarih ve Saat</label>
                  <input
                    type="datetime-local"
                    value={newExamDate}
                    onChange={e => setNewExamDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                  />
                </div>
                <button onClick={handleAddExam} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-4 -mt-6 relative z-20">
        {localUnits.map((unit, unitIdx) => {
          const unitCompleted = unit.tasks.filter(t => completedTasks.has(t.id)).length;
          const isAllDone = unitCompleted === unit.tasks.length && unit.tasks.length > 0;
          const isOpen = openUnits.has(unitIdx);

          return (
            <div
              key={unitIdx}
              className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors"
            >
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" onClick={() => toggleUnit(unitIdx)}>
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    isAllDone ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {isAllDone ? <CheckCircle size={20} /> : <BookOpen size={20} />}
                  </div>
                  <h3 className={`font-medium select-none ${
                    isAllDone ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {unit.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 pl-4">
                  <span className="text-xs text-slate-400 font-medium">
                    {unitCompleted} / {unit.tasks.length}
                  </span>
                  <span className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20">
                    {unit.tasks.map((task, taskIdx) => (
                      <div
                        key={task.id}
                        draggable={editingTaskId !== task.id}
                        onDragStart={() => handleDragStart(unitIdx, taskIdx)}
                        onDragEnter={() => handleDragEnter(unitIdx, taskIdx)}
                        onDragOver={event => event.preventDefault()}
                        onDrop={event => {
                          event.preventDefault();
                          handleDrop(unitIdx, taskIdx);
                        }}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-3 p-4 pl-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors group relative ${
                          dragTarget?.taskIdx === taskIdx && dragTarget.unitIdx === unitIdx ? 'border-t-2 border-t-indigo-500' : ''
                        } ${dragSource?.taskIdx === taskIdx && dragSource.unitIdx === unitIdx ? 'opacity-50 bg-slate-100 dark:bg-slate-800' : ''}`}
                      >
                        <div className="text-slate-300 dark:text-slate-600 cursor-grab hover:text-slate-500 active:cursor-grabbing">
                          <GripVertical size={16} />
                        </div>
                        <div onClick={() => toggleTask(task.id)} className="cursor-pointer shrink-0">
                          <Checkmark checked={completedTasks.has(task.id)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {editingTaskId === task.id ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingText}
                              onChange={e => setEditingText(e.target.value)}
                              onBlur={() => saveEditing(unitIdx, taskIdx)}
                              onKeyDown={e => e.key === 'Enter' && saveEditing(unitIdx, taskIdx)}
                              className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                          ) : (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <p
                                  onClick={() => startEditing(task)}
                                  className={`text-sm cursor-text truncate transition-all relative ${
                                    completedTasks.has(task.id)
                                      ? 'text-slate-400'
                                      : 'text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {task.text}
                                  <span
                                    className={`absolute left-0 top-1/2 h-0.5 bg-slate-400 dark:bg-slate-500 transition-all duration-500 ease-in-out ${
                                      completedTasks.has(task.id) ? 'w-full opacity-100' : 'w-0 opacity-0'
                                    }`}
                                  ></span>
                                </p>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    window.open(
                                      `https://www.google.com/search?q=${encodeURIComponent(task.text)}`,
                                      '_blank'
                                    );
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-blue-500 transition-all"
                                  title="Google'da Hızlı Ara"
                                >
                                  <Globe size={12} />
                                </button>
                                {task.dueDate && (
                                  <span className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded ${
                                    new Date(task.dueDate) < new Date()
                                      ? 'bg-red-100 text-red-500'
                                      : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                {task.tags?.map(tag => (
                                  <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded hidden md:inline-block">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-green-400"
                                      style={{
                                        width: `${(task.subtasks.filter(sub => sub.completed).length / task.subtasks.length) * 100}%`
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    {task.subtasks.filter(sub => sub.completed).length}/{task.subtasks.length}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenTaskDetails(task)}
                            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                            title="Detaylar & Notlar"
                          >
                            <MoreVertical size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteModalData({ unitIdx, taskIdx })}
                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Görevi Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {unit.tasks.length === 0 && (
                      <p className="p-4 text-center text-sm text-slate-400 italic">Bu ünitede henüz görev yok.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mt-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Yeni Görev Ekle (Son Üniteye)</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="Görev tanımı..."
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus size={18} />
              Ekle
            </button>
          </div>
        </div>
      </div>

      {isDirty && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition-all font-bold disabled:opacity-70 disabled:scale-100"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      )}
    </div>
  );
};
