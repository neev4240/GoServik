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
            // Try matching in customer collection
            const foundCust = state.customers.find(c => c.email.toLowerCase() === email);
            if (foundCust) {
              useStore.setState({ currentUser: foundCust });
              return;
            }

            // Try matching in professional collection
            const foundPro = state.professionals.find(p => p.email.toLowerCase() === email);
            if (foundPro) {
              useStore.setState({ currentUser: foundPro });
              return;
            }
          }
        } else {
          // No user found in Firebase Auth. Check if we have a saved local user
          const savedUserStr = localStorage.getItem('goservik_user');
          if (!savedUserStr) {
            useStore.setState({ currentUser: null });
          }
        }
      });

      return () => unsubscribe();
    });
  }, []);

  return <RouterProvider router={router} />;
}

