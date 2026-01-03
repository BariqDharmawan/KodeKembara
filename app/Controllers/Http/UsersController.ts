import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'node:crypto'
import Educational from 'App/Models/Educational'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { returnResponseFormat } from 'App/Services/ResHelper'
import UserStoreValidator from 'App/Validators/UserStoreValidator'
import SkillExperience from 'App/Models/SkillExperience'
import UserEducationalTaken from 'App/Models/UserEducationalTaken'
import UserUpdateValidator from 'App/Validators/UserUpdateValidator'

export default class UsersController {
  public async index() {
    return await User.query().where('role', '!=', 'admin').withCount('skillExperience')
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.query()
      .select('id', 'email')
      .where('id', params.id)
      .orWhere('email', params.id)
      .preload('profile')
      .preload('skillExperience', (query) => query.preload('skillName'))
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
      skillExperience: user.skillExperience.map((skillExperience) => ({
        skillName: skillExperience.skillName.name,
        month_of_experience: skillExperience.month_of_experience,
      })),
    }
  }

  public async listSkillExperience({ params }: HttpContextContract) {
    const skillExperienceByUser = await SkillExperience.query()
      .where('user_uuid', params.id)
      .preload('skillName')

    return {
      total: skillExperienceByUser.length,
      data: skillExperienceByUser,
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(UserStoreValidator)

    const user = new User()
    user.id = crypto.randomUUID()
    user.email = request.input('email')
    user.password = await Hash.make(request.input('password'))

    user.related('profile').create({
      id: crypto.randomUUID(),
      name: request.input('name'),
    })

    return response.status(201).json(
      returnResponseFormat({
        code: 201,
        message: 'Successfully add new user',
      })
    )
  }

  private async checkEducationTakenEachUser(ids: string[], userLoggedIn: User) {
    const educationalTaken = await UserEducationalTaken.query()
      .where('user_uuid', userLoggedIn.id)
      .preload('educational')
      .whereIn('educational_uuid', ids)

    return educationalTaken.map((educational) => educational.educational)
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(UserUpdateValidator)

    const idEducationals = request.input('educational_level_id')

    const userEducation = await this.checkEducationTakenEachUser(idEducationals, auth.user!)

    if (userEducation.length > 0) {
      return response.status(403).json({
        code: 403,
        message: `You already have education ${userEducation.map((each) => each.level).join(', ')}`,
      })
    }

    const dataToCreate = idEducationals.map((eachId: string) => ({
      id: crypto.randomUUID(),
      user_uuid: auth.user!.id,
      educational_uuid: eachId,
    }))

    await UserEducationalTaken.createMany(dataToCreate)

    await auth.user!.load('profile')

    await auth
      .user!.profile.merge({
        age: payload.age,
        current_job: payload.current_job,
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

  public async removeEducationTaken({ auth, params, response }: HttpContextContract) {
    const educationToRemove = await Educational.findOrFail(params.id)

    const [currentUserEducation, educationalTaken] = await Promise.all([
      UserEducationalTaken.query()
        .where('user_uuid', auth.user!.id)
        .where('educational_uuid', params.id)
        .first(),
      UserEducationalTaken.query().where('user_uuid', auth.user!.id).preload('educational'),
    ])

    if (!currentUserEducation) {
      return response.status(500).json({
        code: 500,
        message: `You dont have education ${educationToRemove.level}`,
        your_education: educationalTaken.map((educational) => educational.educational.level),
      })
    }

    return currentUserEducation.delete()
  }
}
