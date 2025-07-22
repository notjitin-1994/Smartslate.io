import { User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import type { User as UserDocument, UserAnalytics, Enrollment } from './firestore';

export interface AuthUser extends User {
  role?: 'student' | 'instructor' | 'admin' | 'enterprise_admin';
  subscription?: {
    plan: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
  };
}

export interface SessionData {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  pageViews: string[];
  interactions: InteractionEvent[];
  deviceInfo: {
    userAgent: string;
    screenResolution: string;
    deviceType: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    os: string;
  };
}

export interface InteractionEvent {
  type: 'click' | 'scroll' | 'video_play' | 'video_pause' | 'quiz_attempt' | 'note_created' | 'bookmark_added';
  timestamp: Date;
  elementId?: string;
  data?: Record<string, any>;
  moduleId?: string;
  courseId?: string;
}

export interface LearningProgress {
  courseId: string;
  moduleId: string;
  progressPercentage: number;
  timeSpent: number;
  completedAt?: Date;
  score?: number;
}

export class AuthUtils {
  private static currentSession: SessionData | null = null;

  static async createUserProfile(user: User, additionalData: Partial<UserDocument> = {}): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const userData: Partial<UserDocument> = {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || undefined,
        role: 'student',
        createdAt: serverTimestamp() as any,
        lastLoginAt: serverTimestamp() as any,
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          learningReminders: true,
          emailUpdates: false,
        },
        profile: {
          skills: [],
          interests: [],
          experience: 'beginner',
          goals: [],
        },
        learningAnalytics: {
          totalTimeSpent: 0,
          coursesCompleted: 0,
          coursesInProgress: 0,
          skillsAcquired: [],
          learningStreak: 0,
          lastActiveDate: serverTimestamp() as any,
          averageSessionDuration: 0,
          preferredLearningTime: 'evening',
          completionRate: 0,
          engagementScore: 0,
        },
        subscription: {
          plan: 'free',
          status: 'active',
          features: ['basic_courses', 'community_access'],
        },
        courseProgress: {},
        ...additionalData,
      };

      await setDoc(userRef, userData);
      
      await this.initializeUserAnalytics(user.uid);
    } else {
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      });
    }
  }

  static async getUserProfile(userId: string): Promise<UserDocument | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() as UserDocument : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserDocument>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async updateUserPreferences(
    userId: string, 
    preferences: Partial<UserDocument['preferences']>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        preferences,
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  static async initializeUserAnalytics(userId: string): Promise<void> {
    try {
      const analyticsRef = doc(db, 'userAnalytics', userId);
      const analyticsSnap = await getDoc(analyticsRef);
      
      if (!analyticsSnap.exists()) {
        const initialAnalytics: Partial<UserAnalytics> = {
          userId,
          sessionData: {
            totalSessions: 0,
            averageSessionDuration: 0,
            lastSessionDate: serverTimestamp() as any,
            deviceTypes: {},
            browserTypes: {},
            accessPatterns: {},
          },
          learningPatterns: {
            preferredTimeSlots: [],
            learningVelocity: 0,
            contentPreferences: {},
            interactionPatterns: {},
            attentionSpan: 0,
            retentionRate: 0,
          },
          skillAssessments: {
            currentSkills: {},
            skillGrowth: {},
            certifications: [],
            competencyMap: {},
          },
          engagementMetrics: {
            courseCompletionRate: 0,
            averageRating: 0,
            forumParticipation: 0,
            peerInteractions: 0,
            contentCreation: 0,
            helpSeeking: 0,
          },
          aiRecommendations: {
            recommendedCourses: [],
            learningPath: [],
            skillGaps: [],
            careerSuggestions: [],
            studySchedule: [],
            personalizedContent: [],
          },
          behavioralInsights: {
            motivationFactors: [],
            learningBarriers: [],
            successPredictors: {},
            churnRisk: 0,
            engagementTrends: [],
          },
        };

        await setDoc(analyticsRef, initialAnalytics);
      }
    } catch (error) {
      console.error('Error initializing user analytics:', error);
    }
  }

  static startSession(userId: string): void {
    const deviceInfo = this.getDeviceInfo();
    
    this.currentSession = {
      sessionId: `${userId}_${Date.now()}`,
      startTime: new Date(),
      pageViews: [window.location.pathname],
      interactions: [],
      deviceInfo,
    };

    this.trackPageView(window.location.pathname);
  }

  static async endSession(userId: string): Promise<void> {
    if (!this.currentSession) return;

    const endTime = new Date();
    const duration = endTime.getTime() - this.currentSession.startTime.getTime();
    
    this.currentSession.endTime = endTime;
    this.currentSession.duration = duration;

    try {
      await this.updateSessionAnalytics(userId, this.currentSession);
      this.currentSession = null;
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }

  static trackPageView(path: string): void {
    if (this.currentSession && !this.currentSession.pageViews.includes(path)) {
      this.currentSession.pageViews.push(path);
    }
  }

  static trackInteraction(interaction: Omit<InteractionEvent, 'timestamp'>): void {
    if (this.currentSession) {
      this.currentSession.interactions.push({
        ...interaction,
        timestamp: new Date(),
      });
    }
  }

  static async trackLearningProgress(
    userId: string, 
    progress: LearningProgress
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`courseProgress.${progress.courseId}`]: {
          lastAccessedAt: serverTimestamp(),
          progressPercentage: progress.progressPercentage,
          timeSpent: increment(progress.timeSpent),
          currentModule: progress.moduleId,
        },
      });

      const analyticsRef = doc(db, 'userAnalytics', userId);
      await updateDoc(analyticsRef, {
        'learningPatterns.learningVelocity': increment(progress.progressPercentage),
        'sessionData.lastSessionDate': serverTimestamp(),
      });

      this.trackInteraction({
        type: 'video_play',
        moduleId: progress.moduleId,
        courseId: progress.courseId,
        data: {
          progressPercentage: progress.progressPercentage,
          timeSpent: progress.timeSpent,
        },
      });
    } catch (error) {
      console.error('Error tracking learning progress:', error);
    }
  }

  static async trackQuizAttempt(
    userId: string,
    courseId: string,
    moduleId: string,
    quizId: string,
    score: number,
    totalQuestions: number
  ): Promise<void> {
    try {
      const percentage = (score / totalQuestions) * 100;
      
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`courseProgress.${courseId}.quizScores.${quizId}`]: percentage,
      });

      this.trackInteraction({
        type: 'quiz_attempt',
        moduleId,
        courseId,
        data: {
          quizId,
          score,
          totalQuestions,
          percentage,
        },
      });

      if (percentage >= 70) {
        await this.updateSkillProgress(userId, moduleId, percentage);
      }
    } catch (error) {
      console.error('Error tracking quiz attempt:', error);
    }
  }

  static async trackCourseCompletion(userId: string, courseId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'learningAnalytics.coursesCompleted': increment(1),
        'learningAnalytics.coursesInProgress': increment(-1),
        [`courseProgress.${courseId}.completedAt`]: serverTimestamp(),
      });

      const analyticsRef = doc(db, 'userAnalytics', userId);
      await updateDoc(analyticsRef, {
        'engagementMetrics.courseCompletionRate': increment(1),
      });

      this.trackInteraction({
        type: 'click',
        courseId,
        data: {
          action: 'course_completed',
        },
      });
    } catch (error) {
      console.error('Error tracking course completion:', error);
    }
  }

  static async addBookmark(userId: string, courseId: string, moduleId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`courseProgress.${courseId}.bookmarks`]: arrayUnion(moduleId),
      });

      this.trackInteraction({
        type: 'bookmark_added',
        moduleId,
        courseId,
      });
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  }

  static async createNote(
    userId: string, 
    courseId: string, 
    moduleId: string, 
    content: string
  ): Promise<void> {
    try {
      const noteId = `note_${Date.now()}`;
      const note = {
        noteId,
        moduleId,
        content,
        timestamp: serverTimestamp(),
        isPrivate: true,
      };

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`courseProgress.${courseId}.notes`]: arrayUnion(note),
      });

      this.trackInteraction({
        type: 'note_created',
        moduleId,
        courseId,
        data: { noteId, contentLength: content.length },
      });
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  private static getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const screenResolution = `${screen.width}x${screen.height}`;
    
    let deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }

    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return {
      userAgent,
      screenResolution,
      deviceType,
      browser,
      os,
    };
  }

  private static async updateSessionAnalytics(userId: string, session: SessionData): Promise<void> {
    try {
      const analyticsRef = doc(db, 'userAnalytics', userId);
      const duration = session.duration || 0;
      
      await updateDoc(analyticsRef, {
        'sessionData.totalSessions': increment(1),
        'sessionData.lastSessionDate': serverTimestamp(),
        [`sessionData.deviceTypes.${session.deviceInfo.deviceType}`]: increment(1),
        [`sessionData.browserTypes.${session.deviceInfo.browser}`]: increment(1),
        'sessionData.averageSessionDuration': increment(duration),
      });

      const hour = session.startTime.getHours();
      let timeSlot = 'morning';
      if (hour >= 12 && hour < 17) timeSlot = 'afternoon';
      else if (hour >= 17 && hour < 21) timeSlot = 'evening';
      else if (hour >= 21 || hour < 6) timeSlot = 'night';

      await updateDoc(analyticsRef, {
        [`sessionData.accessPatterns.${timeSlot}`]: increment(1),
      });
    } catch (error) {
      console.error('Error updating session analytics:', error);
    }
  }

  private static async updateSkillProgress(
    userId: string, 
    moduleId: string, 
    score: number
  ): Promise<void> {
    try {
      const skill = this.mapModuleToSkill(moduleId);
      if (!skill) return;

      const analyticsRef = doc(db, 'userAnalytics', userId);
      await updateDoc(analyticsRef, {
        [`skillAssessments.currentSkills.${skill}`]: score,
        [`skillAssessments.skillGrowth.${skill}`]: arrayUnion({
          date: serverTimestamp(),
          level: score,
          source: moduleId,
        }),
      });
    } catch (error) {
      console.error('Error updating skill progress:', error);
    }
  }

  private static mapModuleToSkill(moduleId: string): string | null {
    const skillMappings: Record<string, string> = {
      'ai-basics': 'artificial_intelligence',
      'machine-learning': 'machine_learning',
      'data-analysis': 'data_analysis',
      'programming': 'programming',
      'web-development': 'web_development',
    };

    for (const [key, skill] of Object.entries(skillMappings)) {
      if (moduleId.includes(key)) {
        return skill;
      }
    }

    return null;
  }

  static isAuthenticated(user: User | null): boolean {
    return user !== null;
  }

  static hasRole(user: AuthUser | null, role: string): boolean {
    return user?.role === role;
  }

  static hasAnyRole(user: AuthUser | null, roles: string[]): boolean {
    return user?.role ? roles.includes(user.role) : false;
  }

  static canAccessCourse(user: AuthUser | null, courseLevel: string): boolean {
    if (!user) return false;
    
    const subscription = user.subscription;
    if (!subscription) return false;

    switch (subscription.plan) {
      case 'free':
        return courseLevel === 'beginner';
      case 'premium':
        return ['beginner', 'intermediate'].includes(courseLevel);
      case 'enterprise':
        return true;
      default:
        return false;
    }
  }

  static getSubscriptionFeatures(plan: string): string[] {
    const features: Record<string, string[]> = {
      free: ['basic_courses', 'community_access'],
      premium: ['basic_courses', 'advanced_courses', 'community_access', 'certificates', 'offline_access'],
      enterprise: ['all_courses', 'community_access', 'certificates', 'offline_access', 'analytics', 'custom_content'],
    };

    return features[plan] || [];
  }
}

export const authUtils = AuthUtils;

export const initializeSessionTracking = (userId: string) => {
  AuthUtils.startSession(userId);
  
  window.addEventListener('beforeunload', () => {
    AuthUtils.endSession(userId);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      AuthUtils.endSession(userId);
    } else {
      AuthUtils.startSession(userId);
    }
  });
};
