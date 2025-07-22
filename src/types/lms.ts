export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  instructorId: string;
  instructorName: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: string[];
  duration: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'quiz' | 'interactive' | 'assignment';
  order: number;
  duration: number;
  videoUrl?: string;
  resources?: LessonResource[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'download';
  url: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  completedAt?: Date;
  certificateUrl?: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  progress: number;
  timeSpent: number;
  lastAccessedAt: Date;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string | string[]>;
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
  timeSpent: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  templateId: string;
  issuedAt: Date;
  certificateUrl: string;
  verificationCode: string;
}
