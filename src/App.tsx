/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useStore } from './store';
import { supabase } from './lib/supabase';
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
    // 1. Initialize from Supabase first
    useStore.getState().initializeFromSupabase().then(() => {
      // 2. Set up listener to auto-resume active sessions on browser reload
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        const authUser = session?.user;
        if (authUser) {
          const email = authUser.email?.toLowerCase();
          if (email) {
            if (email === 'admin@kaamnow.com' || email === 'admin@goservik.com') {
              useStore.setState({
                currentUser: {
                  id: 'admin-1',
                  name: 'KaamNow Admin',
                  email: 'admin@kaamnow.com',
                  role: 'admin',
                  joinedAt: new Date().toISOString()
                }
              });
              return;
            }

            const state = useStore.getState();
            const uid = authUser.id;

            // Extract phone if synthetic mobile email was used
            let phone = '';
            if (email.endsWith('@kaamnow.com') || email.endsWith('@goservik.com')) {
              const prefix = email.split('@')[0];
              phone = prefix.replace(/\D/g, '');
            }

            const isMatch = (u: any) => {
              if (u.id === uid) return true;
              if (u.uid === uid) return true;
              if (u.email?.toLowerCase() === email) return true;
              if (phone) {
                const uPhone = (u.mobile || '').replace(/\D/g, '');
                if (uPhone && uPhone.slice(-10) === phone.slice(-10)) return true;
              }
              return false;
            };

            // Try matching in customer collection
            const foundCust = state.customers.find(isMatch);
            if (foundCust) {
              useStore.setState({ currentUser: foundCust });
              localStorage.setItem('kaamnow_user', JSON.stringify(foundCust));
              return;
            }

            // Try matching in professional collection
            const foundPro = state.professionals.find(isMatch);
            if (foundPro) {
              useStore.setState({ currentUser: foundPro });
              localStorage.setItem('kaamnow_user', JSON.stringify(foundPro));
              return;
            }

            // Auto-provision user profile if authenticated via Supabase (e.g. Google OAuth or fresh verified signup)
            const meta = authUser.user_metadata || {};
            const assignedRole = (meta.role as 'customer' | 'professional') || 'customer';
            const displayName = meta.display_name || meta.full_name || meta.name || email.split('@')[0];
            const mobileNumber = meta.mobile || phone || '';
            const avatarUrl = meta.avatar_url || meta.picture || undefined;

            state.login(email, assignedRole, displayName, {
              uid,
              mobile: mobileNumber,
              avatar: avatarUrl
            });
          }
        } else {
          // If local user is admin, allow session persistence
          const saved = localStorage.getItem('kaamnow_user');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.role === 'admin') return;
            } catch {}
          }
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    });
  }, []);

  return <RouterProvider router={router} />;
}

