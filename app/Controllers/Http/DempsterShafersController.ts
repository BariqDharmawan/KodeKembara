import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DempsterShaferService from 'App/Services/DempsterShaferService'

export default class DempsterShafersController {
  public async calculate({ request, auth }: HttpContextContract) {
    const { skills, education } = request.only(['skills', 'education'])
    const recommendations = await DempsterShaferService.calculate(skills, education)

    return recommendations
  }
}
