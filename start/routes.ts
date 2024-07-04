import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.group(() => {
      Route.post('logout', 'AuthController.logout')
      Route.get('me', 'AuthController.getCurrentUser')
    }).middleware('auth')
  }).prefix('auth')

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
    Route.get(':id', 'SkillAvailablesController.show')

    Route.group(() => {
      Route.post('/', 'SkillAvailablesController.store')
      Route.put(':id', 'SkillAvailablesController.update')
      Route.delete(':id', 'SkillAvailablesController.destroy')
      Route.get('deleted', 'SkillAvailablesController.getDeleted')
      Route.get(':id/careers', 'SkillAvailablesController.getCareerBySkill')
    }).middleware(['auth', 'isAdmin'])
  }).prefix('skill-availables')

  Route.group(() => {
    Route.get('/', 'AdminsController.index')
    Route.get(':id', 'AdminsController.show')
    Route.post('/', 'AdminsController.store')
  })
    .prefix('admins')
    .middleware(['auth', 'isAdmin'])

  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.get(':id', 'UsersController.show')
    Route.get(':id/skill-experiences', 'UsersController.listSkillExperience')
    Route.post('add', 'UsersController.store')

    Route.group(() => {
      Route.put('update', 'UsersController.update')
      Route.delete(':id', 'UsersController.destroy')
      Route.put('change-password', 'UsersController.changePassword')
    }).middleware('auth')
  }).prefix('users')

  Route.group(() => {
    Route.post('/', 'SkillExperiencesController.store')
    Route.delete('skill-experiences/:id', 'SkillExperiencesController.destroy')
  })
    .prefix('skill-experiences')
    .middleware('auth')

  Route.group(() => {
    Route.get('/', 'CalculateRecommendationsController.index')
  })
    .middleware('auth')

  Route.group(() => {
    Route.get('/', 'CareerSkillConfidencesController.index')
    Route.get(':id', 'CareerSkillConfidencesController.show')
  }).prefix('career-confidence')

  Route.group(() => {
    Route.get('/', 'EducationalsController.index')
    Route.get(':id', 'EducationalsController.show')
    Route.post('/', 'EducationalsController.store')
    Route.put(':id', 'EducationalsController.update')
  }).prefix('educationals')
})
  .prefix('v1')
  .namespace('App/Controllers/Http')
