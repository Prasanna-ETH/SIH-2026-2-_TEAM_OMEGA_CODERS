import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'AICTE_ADMIN' | 'INSTITUTION' | 'VERIFIER';

export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  institution_id: number | null;
  institution_name: string | null;
  full_name: string;
  designation?: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  AICTE_ADMIN: {
    id: 1,
    username: 'AICTE_ADMIN',
    role: 'AICTE_ADMIN',
    institution_id: null,
    institution_name: null,
    full_name: 'Dr. Rajesh Sharma',
    designation: 'Director (Approval & Governance), AICTE',
    email: 'director.governance@aicte-india.gov.in'
  },
  INSTITUTION: {
    id: 2,
    username: 'INST_10021',
    role: 'INSTITUTION',
    institution_id: 1,
    institution_name: 'ABC Institute of Technology',
    full_name: 'Dr. V. Narayanan',
    designation: 'Dean (Academic Registrations)',
    email: 'dean.academics@abctech.edu.in'
  },
  VERIFIER: {
    id: 4,
    username: 'VERIFIER_004',
    role: 'VERIFIER',
    institution_id: null,
    institution_name: null,
    full_name: 'Sanjay Mukhopadhyay',
    designation: 'Lead Analyst, Background Verification Cell (TCS Ltd)',
    email: 's.mukhopadhyay@tcs-bgv.com'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('asdvs_user');
    return saved ? JSON.parse(saved) : DEFAULT_USERS['AICTE_ADMIN'];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('asdvs_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('asdvs_user');
    }
  }, [user]);

  const login = async (username: string): Promise<boolean> => {
    const u = username.toUpperCase();
    if (u.includes('ADMIN') || u === 'AICTE_ADMIN') {
      setUser(DEFAULT_USERS['AICTE_ADMIN']);
      return true;
    } else if (u.includes('10021') || u === 'INST_10021') {
      setUser(DEFAULT_USERS['INSTITUTION']);
      return true;
    } else if (u.includes('VERIFY') || u === 'VERIFIER_004') {
      setUser(DEFAULT_USERS['VERIFIER']);
      return true;
    }
    // Default fallback
    setUser(DEFAULT_USERS['AICTE_ADMIN']);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(DEFAULT_USERS[role]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
