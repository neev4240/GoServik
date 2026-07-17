/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Profile } from './pages/Profile';
import { BookingFlow } from './pages/BookingFlow';
import { Login, Register } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';

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
        path: 'book/:proId',
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
        path: 'dashboard',
        element: <Dashboard />,
      },
      // Placeholders for static pages
      {
        path: 'about',
        element: <div className="p-20 text-center"><h1 className="text-3xl font-bold">About Us</h1><p className="mt-4">GoServik is a trusted marketplace for professionals.</p></div>
      },
      {
        path: 'contact',
        element: <div className="p-20 text-center"><h1 className="text-3xl font-bold">Contact Us</h1></div>
      },
      {
        path: 'privacy',
        element: <div className="p-20 text-center"><h1 className="text-3xl font-bold">Privacy Policy</h1></div>
      },
      {
        path: 'terms',
        element: <div className="p-20 text-center"><h1 className="text-3xl font-bold">Terms of Service</h1></div>
      }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

