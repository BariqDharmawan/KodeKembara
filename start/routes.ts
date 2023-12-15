import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'AuthController.login')

  Route.group(() => {
    Route.get('/', 'CareerAvailablesController.index')

    Route.group(() => {
      Route.post('/', 'CareerAvailablesController.store')
      Route.put(':id', 'CareerAvailablesController.update')
      Route.delete(':id', 'CareerAvailablesController.destroy')
      Route.get('deleted', 'CareerAvailablesController.getDeleted')
    }).middleware(['auth', 'isAdmin'])
  }).prefix('career-available')

  Route.group(() => {
    Route.get('/', 'SkillAvailablesController.index')

    Route.group(() => {
      Route.get(':id', 'SkillAvailablesController.show')
      Route.post('/', 'SkillAvailablesController.store')
      Route.put(':id', 'SkillAvailablesController.update')
      Route.delete(':id', 'SkillAvailablesController.destroy')
      Route.get('deleted', 'SkillAvailablesController.getDeleted')
    }).middleware(['auth', 'isAdmin'])
  }).prefix('skill-available')

  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.get(':id', 'UsersController.show')
    Route.post('add', 'UsersController.store').middleware('auth')
    Route.put(':id/update', 'UsersController.update').middleware('auth')

    Route.get(':userId/skills', 'SkillExperienceController.getUserSkillExperience')
  }).prefix('users')

  Route.post('logout', 'AuthController.logout').middleware('auth')

  Route.group(() => {
    Route.get('/', 'AuthController.getCurrentUser')
  })
    .prefix('me')
    .middleware('auth')
}).namespace('App/Controllers/Http')
