import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Course, Module, Lesson, Enrollment, UserProgress, Quiz, QuizAttempt } from '../types/lms';

export const getCourses = async (): Promise<Course[]> => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, where('isPublished', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Course));
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    
    if (courseDoc.exists()) {
      const data = courseDoc.data();
      return {
        id: courseDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Course;
    }
    return null;
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

export const getCourseModules = async (courseId: string): Promise<Module[]> => {
  try {
    const modulesRef = collection(db, 'modules');
    const q = query(
      modulesRef, 
      where('courseId', '==', courseId),
      where('isPublished', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Module));
  } catch (error) {
    console.error('Error getting course modules:', error);
    throw error;
  }
};

export const getModuleLessons = async (moduleId: string): Promise<Lesson[]> => {
  try {
    const lessonsRef = collection(db, 'lessons');
    const q = query(
      lessonsRef,
      where('moduleId', '==', moduleId),
      where('isPublished', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Lesson));
  } catch (error) {
    console.error('Error getting module lessons:', error);
    throw error;
  }
};

export const enrollInCourse = async (userId: string, courseId: string): Promise<string> => {
  try {
    const enrollmentRef = collection(db, 'enrollments');
    const docRef = await addDoc(enrollmentRef, {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      status: 'active',
      progress: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const getUserEnrollments = async (userId: string): Promise<Enrollment[]> => {
  try {
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(enrollmentsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      enrolledAt: doc.data().enrolledAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    } as Enrollment));
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    throw error;
  }
};

export const updateUserProgress = async (
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string,
  progress: number,
  completed: boolean = false
): Promise<void> => {
  try {
    const progressRef = collection(db, 'userProgress');
    const progressId = `${userId}_${courseId}_${moduleId}_${lessonId}`;
    const progressDoc = doc(progressRef, progressId);
    
    const updateData: Partial<UserProgress> = {
      userId,
      courseId,
      moduleId,
      lessonId,
      progress,
      completed,
      lastAccessedAt: new Date(),
    };

    if (completed) {
      updateData.completedAt = new Date();
    }

    await updateDoc(progressDoc, updateData);
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const getUserProgress = async (userId: string, courseId: string): Promise<UserProgress[]> => {
  try {
    const progressRef = collection(db, 'userProgress');
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      completedAt: doc.data().completedAt?.toDate(),
      lastAccessedAt: doc.data().lastAccessedAt?.toDate(),
    } as UserProgress));
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

export const isUserEnrolled = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      where('status', 'in', ['active', 'completed'])
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
};
