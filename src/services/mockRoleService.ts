// Extended User interface for mock service
interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'smartslate-admin' | 'smartslate-manager' | 'manager' | 'learner';
  createdAt: any;
  updatedAt: any;
}

// Mock data for development
const mockUsers: MockUser[] = [
  {
    uid: 'mock-user-1',
    email: 'admin@smartslate.io',
    displayName: 'Admin User',
    role: 'smartslate-admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'mock-user-2',
    email: 'manager@smartslate.io',
    displayName: 'Manager User',
    role: 'smartslate-manager',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'mock-user-3',
    email: 'learner@smartslate.io',
    displayName: 'Learner User',
    role: 'learner',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock delay to simulate network requests
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export interface CreateUserData {
  email: string;
  displayName: string;
  role: 'smartslate-admin' | 'smartslate-manager' | 'manager' | 'learner';
}

export interface SetUserRoleData {
  email: string;
  role: 'smartslate-admin' | 'smartslate-manager' | 'manager' | 'learner';
}

// Mock service functions for development
export const createUser = async (data: CreateUserData): Promise<{ uid: string }> => {
  await mockDelay();
  const newUser: MockUser = {
    uid: `mock-user-${Date.now()}`,
    email: data.email,
    displayName: data.displayName,
    role: data.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  console.log('Mock createUser called:', data);
  return { uid: newUser.uid };
};

export const assignRoleToUser = async (data: SetUserRoleData): Promise<{ status: string }> => {
  await mockDelay();
  const user = mockUsers.find(u => u.email === data.email);
  if (user) {
    user.role = data.role;
    user.updatedAt = new Date().toISOString();
  }
  console.log('Mock assignRoleToUser called:', data);
  return { status: 'success' };
};

export const getUsers = async (): Promise<any[]> => {
  await mockDelay();
  console.log('Mock getUsers called, returning:', mockUsers.length, 'users');
  return [...mockUsers];
};

export const updateUser = async (uid: string, data: { role: string }): Promise<{ uid: string; customClaims: any }> => {
  await mockDelay();
  const user = mockUsers.find(u => u.uid === uid);
  if (user) {
    user.role = data.role as any;
    user.updatedAt = new Date().toISOString();
  }
  console.log('Mock updateUser called:', { uid, data });
  return { uid, customClaims: { role: data.role } };
};

export const deleteUser = async (uid: string): Promise<{ status: string }> => {
  await mockDelay();
  const index = mockUsers.findIndex(u => u.uid === uid);
  if (index > -1) {
    mockUsers.splice(index, 1);
  }
  console.log('Mock deleteUser called:', uid);
  return { status: 'success' };
};
