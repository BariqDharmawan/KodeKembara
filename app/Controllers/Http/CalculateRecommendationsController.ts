import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DempsterShaferService from 'App/Services/DempsterShaferService'

export default class CalculateRecommendationsController {
  public async index({ auth }: HttpContextContract) {
    const userId = auth.user!.id

    const recommendationService = new DempsterShaferService()

    try {
      const beliefs = await recommendationService.calculateBelieve(userId)
      console.log('beliefs', beliefs)

      return beliefs
    } catch (error) {
      // Handle errors
      console.error(error)
    }
  }
}
