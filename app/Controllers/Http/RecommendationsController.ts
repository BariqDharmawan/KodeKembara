import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DempsterShaferService from 'App/Services/DempsterShaferService'

export default class RecommendationsController {
  public async calculate({ response, auth }: HttpContextContract) {
    const user = auth.user!

    await user.load('profile')

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
