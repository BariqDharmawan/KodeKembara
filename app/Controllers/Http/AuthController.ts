import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      return await auth.use('api').attempt(email, password, {
        expiresIn: '1 days',
      })
    } catch (error) {
      return response.status(422).json({
        message: 'You are input a wrong email/password',
      })
    }
  }

  public async getCurrentUser({ auth }: HttpContextContract) {
    return {
      id: auth.user?.id,
      email: auth.user?.email,
      createdAt: auth.user?.createdAt,
      updatedAt: auth.user?.updatedAt,
    } as User
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return {
      revoked: true,
      response,
    }
  }
}
