import { createBrowserRouter } from 'react-router'
import App from './App'
import AuthenticatedRoute from './guards/AuthenticatedRoute'
import CheckedSetupRoute from './guards/CheckedSetupRoute'
import OtpRequiredRoute from './guards/OtpRequiredRoute'
import PwdRequiredRoute from './guards/PwdRequiredRoute'
import UnauthenticatedRoute from './guards/UnauthenticatedRoute'
import DashboardLayout from './layouts/dashboard-layout'
import CalendarPage from './pages/calendar/calendar-page'
import ConfirmPage from './pages/confirm/confirm-page'
import LandingPage from './pages/landing/landing-page'
import LoginPage from './pages/login/login-page'
import NotionCallbackPage from './pages/notion-callback/notion-callback-page'
import DatabasesPage from './pages/notion/databases-page'
import SetupPage from './pages/setup/setup-page'
import SignupPage from './pages/signnup/signup-page'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        Component: UnauthenticatedRoute,
        children: [
          { index: true, Component: LandingPage },
          { path: 'confirm', Component: ConfirmPage },
          { path: 'login', Component: LoginPage },
          { path: 'signup', Component: SignupPage }
        ]
      },
      {
        path: 'dashboard',
        Component: AuthenticatedRoute,
        children: [
          {
            Component: PwdRequiredRoute,
            children: [
              {
                index: true,
                Component: SetupPage
              },
              {
                path: 'notion/callback',
                Component: NotionCallbackPage
              },
              {
                Component: CheckedSetupRoute,
                children: [
                  {
                    Component: DashboardLayout,
                    children: [
                      { path: 'databases', Component: DatabasesPage },
                      { path: 'calendar', Component: CalendarPage },
                      { path: 'insights' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            Component: OtpRequiredRoute,
            children: []
          },
          {
            children: []
          }
        ]
      }
    ]
  }
])
