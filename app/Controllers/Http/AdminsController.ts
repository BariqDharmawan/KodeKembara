import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { returnResponseFormat } from 'App/Services/ResHelper'
import UserStoreValidator from 'App/Validators/UserStoreValidator'
import { v4 as uuidv4 } from 'uuid'

const colAdminShow = ['id', 'email', 'created_at', 'updated_at']

export default class AdminsController {
  public async index() {
    return await User.query()
      .where('role', 'admin')
      .select(colAdminShow)
      .orderBy('createdAt', 'asc')
  }

  public async show({ params, response }: HttpContextContract) {
    const admin = await User.query().where('id', params.id).select(colAdminShow).first()
    if (!admin) {
      return response
        .status(404)
        .json(returnResponseFormat({ code: 404, message: 'Admin tidak ditemukan' }))
    }

    return admin
  }

  public async store({ request }: HttpContextContract) {
    await request.validate(UserStoreValidator)

    const password = await Hash.make(request.input('password'))
    const email = request.input('email')

    User.create({
      id: uuidv4(),
      email,
      password,
    })

    return returnResponseFormat({
      code: 201,
      message: `Berhasil menambahkan admin dengan email ${email}`,
    })
  }
}
