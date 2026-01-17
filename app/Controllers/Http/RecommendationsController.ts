import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DempsterShaferService from 'App/Services/DempsterShaferService'
import { returnResponseFormat } from 'App/Services/ResHelper'

export default class RecommendationsController {
  public async calculate({ response, auth }: HttpContextContract) {
    const user = auth.user!

    await Promise.all([
      user.load('profile'),
      user.load('educational_taken'),
      user.load('skillExperience'),
    ])

    if (user.educational_taken.length === 0) {
      return response.status(400).json(
        returnResponseFormat({
          code: 400,
          message: 'Please add your educational before calculate recommendation',
        })
      )
    }

    if (user.skillExperience.length === 0) {
      return response.status(400).json(
        returnResponseFormat({
          code: 400,
          message: 'Please add your skill experience calculate recommendation',
        })
      )
    }

    const service = new DempsterShaferService()
    const recommendations = await service.calculateCandidates(user.id)

    return response.json({
      user: {
        email: user.email,
        name: user.profile?.name,
      },
      recommendations: recommendations,
    })
  }
}
