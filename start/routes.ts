import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('login', 'AuthController.login')

  Route.post('user/add', 'AuthController.addUser')

  Route.group(() => {
    Route.get('/', 'CareerAvailablesController.index')
    Route.post('/', 'CareerAvailablesController.store').middleware(['auth', 'isAdmin'])
  }).prefix('career-available')

  Route.group(() => {
    Route.post('logout', 'AuthController.logout')

    Route.get('user/me', 'AuthController.getCurrentUser')
    Route.put('user/update/:uuid', 'AuthController.updateProfile')

    Route.get('user/:userId/skill', 'SkillExperienceController.getUserSkillExperience')
    Route.post('user/:userId/skill', 'SkillExperienceController.addUserSkillExperience')
  }).middleware('auth')
}).namespace('App/Controllers/Http')
