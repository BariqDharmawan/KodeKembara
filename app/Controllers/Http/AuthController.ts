import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  /**
   *
   * @requestFormDataBody {"name":{"type":"string"},"illustration":{"type":"string","format":"binary"}}
   * @responseBody 200 - <RentalObjectCategory>
   * @swagger
   * /v1/auth/login
   */
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      return await auth.use('api').attempt(email, password, {
        expiresIn: '1 days',
      })
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        return error
      }

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
