import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user?.role !== 'admin') {
      return response.status(403).json({
        message: 'You dont have permission on this action',
      })
    }

    await next()
  }
}
