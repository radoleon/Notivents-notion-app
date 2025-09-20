import { IoMdCalendar } from 'react-icons/io'
import {
  IoCalendarClear,
  IoChatbox,
  IoCloudSharp,
  IoMap,
  IoNotifications,
  IoPeople
} from 'react-icons/io5'
import { MdOutlineBarChart, MdWorkOutline } from 'react-icons/md'

export const NAVBAR_HEIGHT_PX = 82
export const SIDEBAR_PX = 70
export const SIDEBAR_EXPANDED_PX = 250
export const SIDEBAR_PADDING_PX = 16

export const FEATURES_LIST = [
  {
    id: '1',
    title: 'Attendance',
    text: 'View detailed attendance records, track check-ins, and monitor participation of all members in real time',
    icon: IoPeople
  },
  {
    id: '2',
    title: 'Realtime Chat',
    text: 'Engage in seamless, instant messaging with your team to collaborate, share ideas, and solve issues on the fly',
    icon: IoChatbox
  },
  {
    id: '3',
    title: 'Notifications',
    text: 'Receive timely updates, alerts, and reminders to keep you informed about important activities and deadlines',
    icon: IoNotifications
  },
  {
    id: '4',
    title: 'File Sharing',
    text: 'Easily upload, organize, and share documents, images, and other files with your team for smooth collaboration',
    icon: IoCloudSharp
  },
  {
    id: '5',
    title: 'Organization',
    text: 'Structure your workspace by managing teams, assigning roles, and defining hierarchy to improve coordination',
    icon: IoCalendarClear
  },
  {
    id: '6',
    title: 'Integrations',
    text: 'Connect your workspace with popular third-party tools and services to automate tasks and enhance productivity',
    icon: IoMap
  }
]

export const TIMELINE_LIST = [
  {
    id: '1',
    title: 'Create Account',
    description: 'Sign up in seconds to get started with your collaborative event workspace'
  },
  {
    id: '2',
    title: 'Sync with Notion',
    description:
      'Connect your Notion workspace to enable seamless integration with your pages and databases'
  },
  {
    id: '3',
    title: 'Create or Import Event',
    description: 'Start from scratch or bring in an existing Notion event to begin organizing'
  },
  {
    id: '4',
    title: 'Share Link',
    description: 'Invite teammates or guests with a shareable link to join and participate'
  },
  {
    id: '5',
    title: 'Collaborate on Event',
    description: 'Chat, manage files, track attendance, and stay in sync - all in one place'
  }
]

export const DASHBOARD_ROUTES_LIST = [
  {
    route: '/dashboard/databases',
    title: 'Database Management',
    icon: MdWorkOutline
  },
  {
    route: '/dashboard/calendar',
    title: 'Event Calendar',
    icon: IoMdCalendar
  },
  {
    route: '/dashboard/insights',
    title: 'Insights & Notifications',
    icon: MdOutlineBarChart
  }
]

export const SUCCESS = 'success'
export const RATE_LIMITED = 'rate_limited'
export const UNAUTHORIZED = 'unauthorized'
export const RESTRICTED_RESOURCE = 'restricted_resource'
export const VALIDATION_ERROR = 'validation_error'

export type NotionStatus =
  | typeof SUCCESS
  | typeof RATE_LIMITED
  | typeof UNAUTHORIZED
  | typeof RESTRICTED_RESOURCE
  | typeof VALIDATION_ERROR
