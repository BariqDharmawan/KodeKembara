import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import Educational from 'App/Models/Educational'
export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      return await auth.use('api').attempt(email, password, {
        expiresIn: '1 days',
      })
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async addUser({ request }: HttpContextContract) {
    const user = new User()
    user.id = uuidv4()
    user.email = request.input('email')
    user.password = await Hash.make(request.input('password'))

    const profile = await user.related('profile').create({
      id: uuidv4(),
      name: request.input('name'),
    })

    return {
      name: profile.name,
      email: user.email,
      created_at: profile.createdAt,
    }
  }

  public async updateProfile({ request }: HttpContextContract) {
    const user = await User.findOrFail(request.param('uuid'))
    const profile = await Profile.findByOrFail('user_uuid', user.id)

    const educationLevel = await Educational.findOrFail(request.input('educational_level_id'))

    if (!profile.id) profile.id = uuidv4()
    profile.age = request.input('age')
    profile.current_job = request.input('current_job') || ''
    profile.educational_level_id = educationLevel.id
    profile.save()

    return {
      name: profile.name,
      age: profile.age,
      current_job: profile.current_job,
      education: educationLevel.level,
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
