import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      return await auth.use('api').attempt(request.input('email'), request.input('password'))
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true,
      response,
    }
  }
}
