export interface User {
  id: string
  name?: string
  email?: string
  fullName?: string
  username?: string
  primaryEmailAddress?: {
    emailAddress: string
  }
}

export interface AuthContextType {
  user: any
  isSignedIn: boolean
  isLoaded: boolean
  isAdmin: boolean
  adminIds: string[]
  isCheckingAuth: boolean
  checkAdminAccess: () => boolean
  redirectIfNotAdmin: () => void
  setCheckingAuth: (checking: boolean) => void
}
