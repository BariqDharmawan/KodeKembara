import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DempsterShaferService from 'App/Services/DempsterShaferService'

export default class RecommendationsController {
  public async calculate({ response, auth }: HttpContextContract) {
    const user = auth.user

    // Should be handled by middleware, but double check
    if (!user) {
      return response.unauthorized({ message: 'User not logged in' })
    }

    const service = new DempsterShaferService()
    const recommendations = await service.calculateCandidates(user.id)

    return response.json({
      user_id: user.id,
      recommendations: recommendations,
    })
  }
}
