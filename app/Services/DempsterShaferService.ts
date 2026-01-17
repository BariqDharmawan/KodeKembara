import CareerSkillMapping from 'App/Models/CareerSkillMapping'
import CareerEducationMapping from 'App/Models/CareerEducationMapping'
import SkillExperience from 'App/Models/SkillExperience'
import UserEducationalTaken from 'App/Models/UserEducationalTaken'
import User from 'App/Models/User'
import CareerAvailable from 'App/Models/CareerAvailable'
import { MAX_BELIEF_WEIGHT } from 'Config/constant'
type MassFunction = {
  // Map of CareerUUID -> Mass Value
  values: Map<string, number>
  theta: number
}

type RecommendationResult = {
  career: {
    id: string
    title: string
  }
  belief: number
  plausibility: number
  supporting_evidence: {
    skills: string[]
    education: string[]
    current_job?: string
  }
}

export default class DempsterShaferService {
  /**
   * Main entry point to calculate career recommendations for a user
   */
  public async calculateCandidates(userId: User['id']): Promise<RecommendationResult[]> {
    // 1. Fetch Evidence
    const userSkills = await SkillExperience.query().where('user_uuid', userId).preload('skillName')

    const userEducations = await UserEducationalTaken.query()
      .where('user_uuid', userId)
      .preload('educational')

    const userProfile = await User.query().where('id', userId).preload('profile').first()
    const currentJob = userProfile?.profile?.current_job

    const skillIds = userSkills.map((s) => s.skill_availables_id)
    const eduIds = userEducations.map((e) => e.educational_uuid)

    const skillMappings = await CareerSkillMapping.query()
      .whereIn('skill_available_id', skillIds)
      .preload('careerAvailable')
      .preload('skillAvailable')

    const eduMappings = await CareerEducationMapping.query()
      .whereIn('educational_id', eduIds)
      .preload('careerAvailable')
      .preload('educational')

    // 2. Group evidence by career
    const careerEvidenceMap = new Map<
      string,
      {
        skillMappings: typeof skillMappings
        eduMappings: typeof eduMappings
        currentJob?: string
        careerTitle?: string
      }
    >()

    // Group skill mappings by career
    for (const mapping of skillMappings) {
      if (!careerEvidenceMap.has(mapping.career_available_id)) {
        careerEvidenceMap.set(mapping.career_available_id, {
          skillMappings: [],
          eduMappings: [],
          careerTitle: mapping.careerAvailable.title,
        })
      }
      careerEvidenceMap.get(mapping.career_available_id)!.skillMappings.push(mapping)
    }

    // Group education mappings by career
    for (const mapping of eduMappings) {
      if (!careerEvidenceMap.has(mapping.career_available_id)) {
        careerEvidenceMap.set(mapping.career_available_id, {
          skillMappings: [],
          eduMappings: [],
          careerTitle: mapping.careerAvailable.title,
        })
      }
      careerEvidenceMap.get(mapping.career_available_id)!.eduMappings.push(mapping)
      // Set title if not already set
      if (!careerEvidenceMap.get(mapping.career_available_id)!.careerTitle) {
        careerEvidenceMap.get(mapping.career_available_id)!.careerTitle =
          mapping.careerAvailable.title
      }
    }

    // Process current job
    if (currentJob) {
      const matchingCareer = await CareerAvailable.query()
        .whereRaw('LOWER(title) = ?', [currentJob.toLowerCase()])
        .first()

      if (matchingCareer) {
        if (!careerEvidenceMap.has(matchingCareer.id)) {
          careerEvidenceMap.set(matchingCareer.id, {
            skillMappings: [],
            eduMappings: [],
            careerTitle: matchingCareer.title,
          })
        }
        careerEvidenceMap.get(matchingCareer.id)!.currentJob = currentJob
      }
    }

    // 3. Calculate belief for EACH career independently
    const results: RecommendationResult[] = []

    for (const [careerId, evidence] of careerEvidenceMap.entries()) {
      // Start fresh for each career
      let careerMass: MassFunction = {
        values: new Map(),
        theta: 1.0,
      }

      const careerEvidence = {
        skills: new Set<string>(),
        education: new Set<string>(),
        current_job: undefined as string | undefined,
      }

      // Combine skill evidence for THIS career only
      for (const mapping of evidence.skillMappings) {
        const weight = Math.max(0, Math.min(MAX_BELIEF_WEIGHT, mapping.belief_weight))

        const newMass: MassFunction = {
          values: new Map([[careerId, weight]]),
          theta: 1.0 - weight,
        }

        careerMass = this.combine(careerMass, newMass)
        careerEvidence.skills.add(mapping.skillAvailable.name)
      }

      // Combine education evidence for THIS career only
      for (const mapping of evidence.eduMappings) {
        const weight = Math.max(0, Math.min(MAX_BELIEF_WEIGHT, mapping.belief_weight))

        const newMass: MassFunction = {
          values: new Map([[careerId, weight]]),
          theta: 1.0 - weight,
        }

        careerMass = this.combine(careerMass, newMass)
        careerEvidence.education.add(mapping.educational.level)
      }

      // Add current job evidence if applicable
      if (evidence.currentJob) {
        const jobWeight = 0.9
        const newMass: MassFunction = {
          values: new Map([[careerId, jobWeight]]),
          theta: 1.0 - jobWeight,
        }
        careerMass = this.combine(careerMass, newMass)
        careerEvidence.current_job = evidence.currentJob
      }

      // Calculate final belief and plausibility for this career
      const massCareer = careerMass.values.get(careerId) || 0
      const belief = massCareer
      const plausibility = massCareer + careerMass.theta

      // Get career title
      const careerTitle = evidence.careerTitle || 'Unknown Career'

      // Only include careers that have at least one skill
      if (plausibility > 0.001 && careerEvidence.skills.size > 0) {
        results.push({
          career: {
            id: careerId,
            title: careerTitle,
          },
          belief: Number(belief.toFixed(4)),
          plausibility: Number(plausibility.toFixed(4)),
          supporting_evidence: {
            skills: Array.from(careerEvidence.skills),
            education: Array.from(careerEvidence.education),
            current_job: careerEvidence.current_job,
          },
        })
      }
    }

    // Sort by Belief high to low
    return results.sort((a, b) => b.belief - a.belief)
  }

  /**
   * Dempster's Rule of Combination
   * m1 (+) m2
   */
  private combine(m1: MassFunction, m2: MassFunction): MassFunction {
    const newValues = new Map<string, number>()
    let newTheta = 0
    let conflict = 0

    // Helper to add to newValues
    const addMass = (careerId: string, val: number) => {
      newValues.set(careerId, (newValues.get(careerId) || 0) + val)
    }

    const m1Keys = Array.from(m1.values.keys())
    const m2Keys = Array.from(m2.values.keys())

    // Case A: m1(Singleton X) * m2(Singleton Y)
    for (const k1 of m1Keys) {
      for (const k2 of m2Keys) {
        const val = m1.values.get(k1)! * m2.values.get(k2)!
        if (k1 === k2) {
          // Intersection is Singleton k1
          addMass(k1, val)
        } else {
          // Intersection is Empty Set -> Conflict
          conflict += val
        }
      }
    }

    // Case B: m1(Singleton X) * m2(THETA)
    // Intersection is Singleton X
    for (const k1 of m1Keys) {
      const val = m1.values.get(k1)! * m2.theta
      addMass(k1, val)
    }

    // Case C: m1(THETA) * m2(Singleton Y)
    // Intersection is Singleton Y
    for (const k2 of m2Keys) {
      const val = m1.theta * m2.values.get(k2)!
      addMass(k2, val)
    }

    // Case D: m1(THETA) * m2(THETA)
    // Intersection is THETA
    newTheta = m1.theta * m2.theta

    // Handle complete or near-complete conflict
    if (conflict >= 0.9999) {
      console.warn('Complete conflict detected, returning previous mass function')
      return m1
    }

    // Normalize by (1 - conflict)
    const normalizationFactor = 1.0 / (1.0 - conflict)

    // Sanity check
    if (!isFinite(normalizationFactor)) {
      console.error('Invalid normalization factor:', normalizationFactor, 'conflict:', conflict)
      return m1
    }

    // Apply normalization
    for (const [k, v] of newValues) {
      newValues.set(k, v * normalizationFactor)
    }
    newTheta = newTheta * normalizationFactor

    return {
      values: newValues,
      theta: newTheta,
    }
  }
}
