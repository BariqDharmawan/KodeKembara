import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import Educational from 'App/Models/Educational'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { returnResponseFormat } from 'App/Services/ResHelper'
import UserStoreValidator from 'App/Validators/UserStoreValidator'
import SkillExperience from 'App/Models/SkillExperience'
import UserEducationalTaken from 'App/Models/UserEducationalTaken'

export default class UsersController {
  public async index() {
    return await User.query().where('role', '!=', 'admin').withCount('skillExperience')
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.query()
      .select('id', 'email')
      .where('id', params.id)
      .preload('profile')
      .firstOrFail()

    const educationalTaken = await UserEducationalTaken.query()
      .where('user_uuid', user.id)
      .preload('educational')

    return {
      ...user.toJSON(),
      profile: {
        ...user.profile.toJSON(),
        educational: educationalTaken.map((educational) => educational.educational),
      },
    }
  }

  public async listSkillExperience({ params }: HttpContextContract) {
    const skillExperienceByUser = await SkillExperience.query()
      .where('user_uuid', params.id)
      // .select('id', 'month_of_experience', 'created_at', 'updated_at')
      .preload('skillName')

    return {
      total: skillExperienceByUser.length,
      data: skillExperienceByUser,
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(UserStoreValidator)

    const user = new User()
    user.id = uuidv4()
    user.email = request.input('email')
    user.password = await Hash.make(request.input('password'))

    user.related('profile').create({
      id: uuidv4(),
      name: request.input('name'),
    })

    return response.status(201).json(
      returnResponseFormat({
        code: 201,
        message: 'Successfully add new user',
      })
    )
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const educationLevel = await Educational.find(request.input('educational_level_id'))

    if (!educationLevel) {
      return response.status(500).json(
        returnResponseFormat({
          code: 500,
          message: 'Education level not found',
        })
      )
    }

    await auth.user!.load('profile')

    auth
      .user!.profile.merge({
        age: request.input('age'),
        current_job: request.input('current_job') || '',
      })
      .save()

    return {
      message: 'Successfully update user',
    }
  }

  public async changePassword({ request, auth }: HttpContextContract) {
    if (!(await Hash.verify(auth.user!.password, request.input('old_password')))) {
      return 'not correct'
    }

    await auth
      .user!.merge({
        password: await Hash.make(request.input('new_password')),
      })
      .save()

    auth.logout()

    return returnResponseFormat({
      code: 200,
      message: 'Successfully update your password',
    })
  }

  public async destroy({ params, bouncer, response }: HttpContextContract) {
    if (await bouncer.denies('isAdmin')) {
      return response.status(404).json(
        returnResponseFormat({
          code: 404,
          message: 'Route not found',
        })
      )
    }
    return (await User.findOrFail(params.id)).delete()
  }
}
