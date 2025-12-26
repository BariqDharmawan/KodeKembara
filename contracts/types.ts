interface InterfaceResAPI {
  message: string
  code: number
}

interface InterfaceCareerAvailable {
  id: string
  title: string
}

type TUserRole = 'admin' | 'user'

export { InterfaceResAPI, InterfaceCareerAvailable, TUserRole }
