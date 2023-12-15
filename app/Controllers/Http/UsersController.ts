import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import Educational from 'App/Models/Educational'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
  public async index() {
    return await User.all()
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.query()
      .select('id', 'email')
      .where('id', params.id)
      .preload('profile', (profile) => profile.preload('educational'))
      .preload('skillExperience', (skill) => {
        skill.preload('skillName')
      })
      .firstOrFail()

    return {
      ...user.toJSON(),
      profile: {
        ...user.profile.toJSON(),
        educational: user.profile.educational.level,
      },
      skillExperience: {
        total: user.skillExperience.length,
        data: user.skillExperience,
      },
    }
  }

  public async store({ request }: HttpContextContract) {
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

  public async update({ request, params, bouncer, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const educationLevel = await Educational.findOrFail(request.input('educational_level_id'))

    await user.load('profile')

    if (await bouncer.denies('updateUser', user)) {
      return response.status(403).json({
        message: 'You are not allowed update another user profile',
      })
    }

    user.profile.age = request.input('age')
    user.profile.current_job = request.input('current_job') || ''
    user.profile.educational_level_id = educationLevel.id
    user.profile.save()

    await user.profile.load('educational')

    return {
      name: user.profile.name,
      age: user.profile.age,
      current_job: user.profile.current_job,
      education: user.profile.educational.level,
    }
  }
}
