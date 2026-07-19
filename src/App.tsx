/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useStore } from './store';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Profile } from './pages/Profile';
import { BookingFlow } from './pages/BookingFlow';
import { Login, Register } from './pages/Auth';
import { LoginProfessional, RegisterProfessional } from './pages/AuthProfessional';
import { ProfessionalPortal } from './pages/ProfessionalPortal';
import { Dashboard } from './pages/Dashboard';
import { AdminPage } from './pages/Admin';
import { 
  AboutPage, 
  ContactPage, 
  TrustSafetyPage, 
  HowItWorksPage, 
  SuccessStoriesPage, 
  CommunityGuidelinesPage, 
  PrivacyPolicyPage, 
  TermsPage 
} from './pages/StaticPages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'explore',
        element: <Explore />,
      },
      {
        path: 'pro/:id',
        element: <Profile />,
      },
      {
        path: 'book',
        element: <BookingFlow />,
      },
      {
        path: 'book/:categoryId',
        element: <BookingFlow />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login-professional',
        element: <LoginProfessional />,
      },
      {
        path: 'register-professional',
        element: <RegisterProfessional />,
      },
      {
        path: 'professionals',
        element: <ProfessionalPortal />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      },
      {
        path: 'trust-safety',
        element: <TrustSafetyPage />
      },
      {
        path: 'how-it-works',
        element: <HowItWorksPage />
      },
      {
        path: 'success-stories',
        element: <SuccessStoriesPage />
      },
      {
        path: 'community-guidelines',
        element: <CommunityGuidelinesPage />
      },
      {
        path: 'privacy',
        element: <PrivacyPolicyPage />
      },
      {
        path: 'terms',
        element: <TermsPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      }
    ],
  },
]);

export default function App() {
  useEffect(() => {
    // 1. Initialize from firestore first
    useStore.getState().initializeFromFirestore().then(() => {
      // 2. Set up listener to auto-resume active sessions on browser reload
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          const email = authUser.email?.toLowerCase();
          if (email) {
            if (email === 'admin@goservik.com') {
              useStore.setState({
                currentUser: {
                  id: 'admin-1',
                  name: 'Platform Admin',
                  email: 'admin@goservik.com',
                  role: 'admin',
                  joinedAt: new Date().toISOString()
                }
              });
              return;
            }

            const state = useStore.getState();
            const uid = authUser.uid;

            // Extract phone if synthetic mobile email was used
            let phone = '';
            if (email.endsWith('@goservik.com')) {
              const prefix = email.split('@')[0];
              phone = prefix.replace(/\D/g, '');
            }

            const isMatch = (u: any) => {
              if (u.id === uid) return true;
              if (u.uid === uid) return true;
              if (u.email?.toLowerCase() === email) return true;
              if (phone) {
                const uPhone = (u.mobile || '').replace(/\D/g, '');
                if (uPhone && uPhone === phone) return true;
              }
              return false;
            };

            // Try matching in customer collection
            const foundCust = state.customers.find(isMatch);
            if (foundCust) {
              useStore.setState({ currentUser: foundCust });
              localStorage.setItem('goservik_user', JSON.stringify(foundCust));
              return;
            }

            // Try matching in professional collection
            const foundPro = state.professionals.find(isMatch);
            if (foundPro) {
              useStore.setState({ currentUser: foundPro });
              localStorage.setItem('goservik_user', JSON.stringify(foundPro));
              return;
            }
          }
        } else {
          // No user found in Firebase Auth. Clear any saved local user to remain logged out
          useStore.setState({ currentUser: null });
          localStorage.removeItem('goservik_user');
        }
      });

      return () => unsubscribe();
    });
  }, []);

  return <RouterProvider router={router} />;
}

