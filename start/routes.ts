import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'AuthController.login')

  Route.group(() => {
    Route.post('logout', 'AuthController.logout')
    Route.get('me', 'AuthController.getCurrentUser')
  }).middleware('auth')

  Route.group(() => {
    Route.get('/', 'CareerAvailablesController.index')
    Route.get(':id', 'CareerAvailablesController.show')
    Route.get(
      ':careerId/skill-requirements',
      'CareerSkillRequirementsController.getSkillRequirements'
    )
    Route.delete(
      ':careerId/skill-requirements',
      'CareerSkillRequirementsController.deleteSkillRequirements'
    )

    Route.group(() => {
      Route.post('/', 'CareerAvailablesController.store')
      Route.put(':id', 'CareerAvailablesController.update')
      Route.delete(':id', 'CareerAvailablesController.destroy')
      Route.get('deleted', 'CareerAvailablesController.getDeleted')
    }).middleware(['auth', 'isAdmin'])
  }).prefix('careers')

  Route.group(() => {
    Route.get('/', 'SkillAvailablesController.index')

    Route.group(() => {
      Route.get(':id', 'SkillAvailablesController.show')
      Route.post('/', 'SkillAvailablesController.store')
      Route.put(':id', 'SkillAvailablesController.update')
      Route.delete(':id', 'SkillAvailablesController.destroy')
      Route.get('deleted', 'SkillAvailablesController.getDeleted')
      Route.get(':id/careers', 'SkillAvailablesController.getCareerBySkill')
    }).middleware(['auth', 'isAdmin'])
  }).prefix('skill-availables')

  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.get(':id', 'UsersController.show')
    Route.post('add', 'UsersController.store').middleware('auth')
    Route.put(':id/update', 'UsersController.update').middleware('auth')

    Route.get(':userId/skills', 'SkillExperienceController.getUserSkillExperience')
  }).prefix('users')
}).namespace('App/Controllers/Http')
