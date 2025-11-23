import { IAuthService, User } from '../types';

export class MockAuthService implements IAuthService {
  currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Check local storage for persisted session
    const stored = localStorage.getItem('mock_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
  }

  async login(): Promise<User> {
    // Simulate Google Pop up
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          uid: 'user_1', // Simulating "Israel Israeli" from mock DB
          displayName: 'ישראל ישראלי',
          email: 'israel@example.com',
          photoURL: 'https://picsum.photos/40/40?random=1'
        };
        this.currentUser = mockUser;
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        this.notifyListeners();
        resolve(mockUser);
      }, 800);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        localStorage.removeItem('mock_user');
        this.notifyListeners();
        resolve();
      }, 400);
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.currentUser));
  }
}

export const authService = new MockAuthService();