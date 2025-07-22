import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface User {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'instructor' | 'admin' | 'enterprise_admin';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
    timezone: string;
    learningReminders: boolean;
    emailUpdates: boolean;
  };
  profile: {
    bio?: string;
    skills: string[];
    interests: string[];
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    goals: string[];
    industry?: string;
    jobTitle?: string;
    company?: string;
    location?: string;
  };
  learningAnalytics: {
    totalTimeSpent: number;
    coursesCompleted: number;
    coursesInProgress: number;
    skillsAcquired: string[];
    learningStreak: number;
    lastActiveDate: Timestamp;
    averageSessionDuration: number;
    preferredLearningTime: string;
    completionRate: number;
    engagementScore: number;
  };
  subscription: {
    plan: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    startDate?: Timestamp;
    endDate?: Timestamp;
    features: string[];
  };
  courseProgress: Record<string, {
    enrolledAt: Timestamp;
    lastAccessedAt: Timestamp;
    progressPercentage: number;
    completedModules: string[];
    timeSpent: number;
    currentModule?: string;
    notes: string;
    bookmarks: string[];
  }>;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  shortDescription: string;
  instructorId: string;
  instructorName: string;
  category: string;
  subcategory: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number;
  language: string;
  price: number;
  currency: string;
  thumbnail: string;
  previewVideo?: string;
  tags: string[];
  skills: string[];
  prerequisites: string[];
  learningObjectives: string[];
  modules: CourseModule[];
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  analytics: {
    totalViews: number;
    completionRate: number;
    averageRating: number;
    engagementScore: number;
    dropoffPoints: string[];
    popularModules: string[];
    averageTimeToComplete: number;
    studentFeedback: {
      difficulty: number;
      clarity: number;
      relevance: number;
      engagement: number;
    };
  };
  aiMetadata: {
    contentComplexity: number;
    recommendedAudience: string[];
    similarCourses: string[];
    skillGapAnalysis: Record<string, number>;
    adaptiveLearningPaths: string[];
  };
}

export interface CourseModule {
  moduleId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive' | 'live_session';
  content: {
    videoUrl?: string;
    textContent?: string;
    resources: Resource[];
    quiz?: Quiz;
    assignment?: Assignment;
  };
  isPreview: boolean;
  analytics: {
    viewCount: number;
    completionRate: number;
    averageTimeSpent: number;
    dropoffRate: number;
    engagementMetrics: Record<string, number>;
  };
}

export interface Resource {
  resourceId: string;
  title: string;
  type: 'pdf' | 'link' | 'download' | 'external';
  url: string;
  description?: string;
  size?: number;
}

export interface Quiz {
  quizId: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
}

export interface QuizQuestion {
  questionId: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Assignment {
  assignmentId: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: Timestamp;
  maxScore: number;
  submissionType: 'file' | 'text' | 'url';
  rubric?: AssignmentRubric[];
}

export interface AssignmentRubric {
  criteria: string;
  description: string;
  maxPoints: number;
}

export interface Enrollment {
  enrollmentId: string;
  userId: string;
  courseId: string;
  enrolledAt: Timestamp;
  completedAt?: Timestamp;
  progress: {
    percentage: number;
    completedModules: string[];
    currentModule?: string;
    timeSpent: number;
    lastAccessedAt: Timestamp;
  };
  performance: {
    quizScores: Record<string, number>;
    assignmentScores: Record<string, number>;
    overallScore: number;
    certificateEarned: boolean;
    certificateUrl?: string;
  };
  interactions: {
    notes: EnrollmentNote[];
    bookmarks: string[];
    discussions: string[];
    questions: string[];
  };
  aiInsights: {
    learningStyle: string;
    strugglingAreas: string[];
    strengths: string[];
    recommendedActions: string[];
    predictedCompletion: Timestamp;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface EnrollmentNote {
  noteId: string;
  moduleId: string;
  content: string;
  timestamp: Timestamp;
  isPrivate: boolean;
}

export interface UserAnalytics {
  userId: string;
  sessionData: {
    totalSessions: number;
    averageSessionDuration: number;
    lastSessionDate: Timestamp;
    deviceTypes: Record<string, number>;
    browserTypes: Record<string, number>;
    accessPatterns: Record<string, number>;
  };
  learningPatterns: {
    preferredTimeSlots: string[];
    learningVelocity: number;
    contentPreferences: Record<string, number>;
    interactionPatterns: Record<string, number>;
    attentionSpan: number;
    retentionRate: number;
  };
  skillAssessments: {
    currentSkills: Record<string, number>;
    skillGrowth: Record<string, SkillGrowthData[]>;
    certifications: Certification[];
    competencyMap: Record<string, number>;
  };
  engagementMetrics: {
    courseCompletionRate: number;
    averageRating: number;
    forumParticipation: number;
    peerInteractions: number;
    contentCreation: number;
    helpSeeking: number;
  };
  aiRecommendations: {
    recommendedCourses: string[];
    learningPath: string[];
    skillGaps: string[];
    careerSuggestions: string[];
    studySchedule: StudyScheduleItem[];
    personalizedContent: string[];
  };
  behavioralInsights: {
    motivationFactors: string[];
    learningBarriers: string[];
    successPredictors: Record<string, number>;
    churnRisk: number;
    engagementTrends: EngagementTrend[];
  };
}

export interface SkillGrowthData {
  date: Timestamp;
  level: number;
  source: string;
}

export interface Certification {
  certificationId: string;
  name: string;
  issuer: string;
  earnedDate: Timestamp;
  expiryDate?: Timestamp;
  credentialUrl?: string;
  skills: string[];
}

export interface StudyScheduleItem {
  courseId: string;
  moduleId: string;
  scheduledDate: Timestamp;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high';
}

export interface EngagementTrend {
  date: Timestamp;
  score: number;
  factors: Record<string, number>;
}

export interface CourseAnalytics {
  courseId: string;
  overview: {
    totalEnrollments: number;
    activeStudents: number;
    completionRate: number;
    averageRating: number;
    revenue: number;
    refundRate: number;
  };
  engagement: {
    averageTimeSpent: number;
    moduleCompletionRates: Record<string, number>;
    dropoffPoints: DropoffPoint[];
    peakActivityTimes: string[];
    deviceUsage: Record<string, number>;
    geographicDistribution: Record<string, number>;
  };
  performance: {
    averageQuizScores: Record<string, number>;
    averageAssignmentScores: Record<string, number>;
    skillAcquisitionRates: Record<string, number>;
    learningVelocity: number;
    retentionRates: Record<string, number>;
  };
  feedback: {
    ratings: Record<number, number>;
    reviews: CourseReview[];
    commonComplaints: string[];
    commonPraises: string[];
    improvementSuggestions: string[];
  };
  aiInsights: {
    contentEffectiveness: Record<string, number>;
    optimalLearningPath: string[];
    personalizedRecommendations: Record<string, string[]>;
    predictiveAnalytics: {
      expectedEnrollments: number;
      churnPrediction: number;
      revenueProjection: number;
    };
    competitorAnalysis: {
      similarCourses: string[];
      marketPosition: string;
      differentiators: string[];
    };
  };
}

export interface DropoffPoint {
  moduleId: string;
  timestamp: number;
  percentage: number;
  reasons: string[];
}

export interface CourseReview {
  reviewId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  helpful: number;
  reported: boolean;
  verified: boolean;
}

export class FirestoreService {
  static async createUser(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      userId,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      ...userData
    });
  }

  static async getUser(userId: string): Promise<User | null> {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() as User : null;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
  }

  static async updateUserAnalytics(userId: string, analytics: Partial<UserAnalytics>): Promise<void> {
    const analyticsRef = doc(db, 'userAnalytics', userId);
    await setDoc(analyticsRef, analytics, { merge: true });
  }

  static async createCourse(courseData: Omit<Course, 'courseId'>): Promise<string> {
    const coursesRef = collection(db, 'courses');
    const courseDoc = await addDoc(coursesRef, {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return courseDoc.id;
  }

  static async getCourse(courseId: string): Promise<Course | null> {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    return courseSnap.exists() ? courseSnap.data() as Course : null;
  }

  static async getPublishedCourses(limitCount: number = 20): Promise<Course[]> {
    const coursesRef = collection(db, 'courses');
    const q = query(
      coursesRef,
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), courseId: doc.id } as Course));
  }

  static async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, where('instructorId', '==', instructorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), courseId: doc.id } as Course));
  }

  static async updateCourse(courseId: string, updates: Partial<Course>): Promise<void> {
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async enrollUser(userId: string, courseId: string): Promise<string> {
    const enrollmentsRef = collection(db, 'enrollments');
    const enrollmentDoc = await addDoc(enrollmentsRef, {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      progress: {
        percentage: 0,
        completedModules: [],
        timeSpent: 0,
        lastAccessedAt: serverTimestamp()
      },
      performance: {
        quizScores: {},
        assignmentScores: {},
        overallScore: 0,
        certificateEarned: false
      },
      interactions: {
        notes: [],
        bookmarks: [],
        discussions: [],
        questions: []
      }
    });

    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, {
      enrollmentCount: increment(1)
    });

    return enrollmentDoc.id;
  }

  static async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(enrollmentsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), enrollmentId: doc.id } as Enrollment));
  }

  static async updateEnrollmentProgress(
    enrollmentId: string, 
    progress: Partial<Enrollment['progress']>
  ): Promise<void> {
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);
    await updateDoc(enrollmentRef, {
      'progress': progress,
      'progress.lastAccessedAt': serverTimestamp()
    });
  }

  static async addEnrollmentNote(
    enrollmentId: string, 
    note: Omit<EnrollmentNote, 'noteId' | 'timestamp'>
  ): Promise<void> {
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);
    const newNote: EnrollmentNote = {
      ...note,
      noteId: Date.now().toString(),
      timestamp: serverTimestamp() as Timestamp
    };
    
    await updateDoc(enrollmentRef, {
      'interactions.notes': arrayUnion(newNote)
    });
  }

  static async updateCourseAnalytics(
    courseId: string, 
    analytics: Partial<CourseAnalytics>
  ): Promise<void> {
    const analyticsRef = doc(db, 'courseAnalytics', courseId);
    await setDoc(analyticsRef, analytics, { merge: true });
  }

  static async getCourseAnalytics(courseId: string): Promise<CourseAnalytics | null> {
    const analyticsRef = doc(db, 'courseAnalytics', courseId);
    const analyticsSnap = await getDoc(analyticsRef);
    return analyticsSnap.exists() ? analyticsSnap.data() as CourseAnalytics : null;
  }

  static async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    const analyticsRef = doc(db, 'userAnalytics', userId);
    const analyticsSnap = await getDoc(analyticsRef);
    return analyticsSnap.exists() ? analyticsSnap.data() as UserAnalytics : null;
  }

  static async searchCourses(
    searchTerm: string, 
    filters: {
      category?: string;
      level?: string;
      priceRange?: [number, number];
      rating?: number;
    } = {}
  ): Promise<Course[]> {
    let q = query(collection(db, 'courses'), where('isPublished', '==', true));

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.level) {
      q = query(q, where('level', '==', filters.level));
    }
    if (filters.rating) {
      q = query(q, where('rating', '>=', filters.rating));
    }

    const querySnapshot = await getDocs(q);
    let courses = querySnapshot.docs.map(doc => ({ ...doc.data(), courseId: doc.id } as Course));

    if (searchTerm) {
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.priceRange) {
      courses = courses.filter(course => 
        course.price >= filters.priceRange![0] && course.price <= filters.priceRange![1]
      );
    }

    return courses;
  }

  static async getRecommendedCourses(userId: string, limit: number = 10): Promise<Course[]> {
    const userAnalytics = await this.getUserAnalytics(userId);
    if (!userAnalytics?.aiRecommendations?.recommendedCourses) {
      return this.getPublishedCourses(limit);
    }

    const recommendedIds = userAnalytics.aiRecommendations.recommendedCourses.slice(0, limit);
    const courses: Course[] = [];
    
    for (const courseId of recommendedIds) {
      const course = await this.getCourse(courseId);
      if (course) courses.push(course);
    }

    return courses;
  }
}
