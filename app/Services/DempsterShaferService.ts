import CareerSkillMapping from 'App/Models/CareerSkillMapping'
import CareerEducationMapping from 'App/Models/CareerEducationMapping'
import SkillExperience from 'App/Models/SkillExperience'
import UserEducationalTaken from 'App/Models/UserEducationalTaken'
import User from 'App/Models/User'
import CareerAvailable from 'App/Models/CareerAvailable'

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

    // 2. Initialize Accumulator Mass
    // Initially m(THETA) = 1.0, everything else 0
    let accumulatedMass: MassFunction = {
      values: new Map(),
      theta: 1.0,
    }

    // Track supporting evidence for final output
    const evidenceMap = new Map<
      string,
      { skills: Set<string>; education: Set<string>; current_job?: string }
    >()

    // Helper to get or create evidence tracker
    const trackEvidence = (careerId: string, type: 'skill' | 'edu' | 'job', name: string) => {
      if (!evidenceMap.has(careerId)) {
        evidenceMap.set(careerId, { skills: new Set(), education: new Set() })
      }
      if (type === 'skill') evidenceMap.get(careerId)!.skills.add(name)
      if (type === 'edu') evidenceMap.get(careerId)!.education.add(name)
      if (type === 'job') evidenceMap.get(careerId)!.current_job = name
    }

    // 3. Process Skill Evidence
    for (const mapping of skillMappings) {
      // Each mapping is a piece of evidence supporting ONE career
      // m({C}) = weight, m(THETA) = 1 - weight
      // Clamp weight
      const weight = Math.max(0, Math.min(1, mapping.belief_weight))

      const newMass: MassFunction = {
        values: new Map([[mapping.career_available_id, weight]]),
        theta: 1.0 - weight,
      }

      accumulatedMass = this.combine(accumulatedMass, newMass)
      trackEvidence(mapping.career_available_id, 'skill', mapping.skillAvailable.name)
    }

    // 4. Process Education Evidence
    for (const mapping of eduMappings) {
      const weight = Math.max(0, Math.min(1, mapping.belief_weight))

      const newMass: MassFunction = {
        values: new Map([[mapping.career_available_id, weight]]),
        theta: 1.0 - weight,
      }

      accumulatedMass = this.combine(accumulatedMass, newMass)
      trackEvidence(mapping.career_available_id, 'edu', mapping.educational.level)
    }

    // 5. Process Current Job Evidence (if applicable)
    // Optimization: Only search if currentJob is non-empty
    if (currentJob) {
      // Find matching career by title (case-insensitive)
      // Note: This matches substring or exact match depending on requirement.
      // Assuming EXACT match or close match for robust evidence.
      // We will perform a DB exact/ILIKE match or fetch all and Find.
      // Since mapping is via ID, we need to find the ID of the career that matches the job title.
      // We'll trust the database level ILIKE search is better, but here we can just do a simple lookup if cached or query.

      const matchingCareer = await CareerAvailable.query()
        .whereRaw('LOWER(title) = ?', [currentJob.toLowerCase()])
        .first()

      if (matchingCareer) {
        // High belief weight for current job (e.g. 0.9)
        const jobWeight = 0.9
        const newMass: MassFunction = {
          values: new Map([[matchingCareer.id, jobWeight]]),
          theta: 1.0 - jobWeight,
        }
        accumulatedMass = this.combine(accumulatedMass, newMass)
        trackEvidence(matchingCareer.id, 'job', currentJob)
      }
    }

    // 6. Calculate Belief and Plausibility
    // Belief({C}) = m({C})
    // Plausibility({C}) = m({C}) + m(THETA)

    const uniqueCareers = new Set<string>()
    // We need career details.
    const careerDetails = new Map<string, string>()

    for (const m of skillMappings) {
      uniqueCareers.add(m.career_available_id)
      careerDetails.set(m.career_available_id, m.careerAvailable.title)
    }
    for (const m of eduMappings) {
      uniqueCareers.add(m.career_available_id)
      careerDetails.set(m.career_available_id, m.careerAvailable.title)
    }
    // Also include the career from current job logic if it wasn't already in mappings
    if (currentJob) {
      // We need to fetch it again or store it earlier if we want to ensure it's in the list
      // Optimization: The trackEvidence already sets the map. We can iterate the map keys.
    }
    // Better: Iterate evidenceMap keys to get all unique careers encountered
    for (const careerId of evidenceMap.keys()) {
      uniqueCareers.add(careerId)
      // If we don't have title yet (e.g. only from Current Job), we need to fetch or set it.
      if (!careerDetails.has(careerId)) {
        // We might need to fetch it if it came ONLY from current job match and wasn't in mappings.
        // But in the current job block we found matchingCareer, so we can set it there?
        // Let's refactor slightly to ensure we have the title.
      }
    }

    // Quick Fix: Pre-fill careerDetails in the Current Job block
    // I need to access matchingCareer from outside or re-query if needed?
    // Wait, the easiest way is to push to careerDetails when we find matchingCareer.

    // Re-implementing just the loop part below to use evidenceMap keys + efficient title lookup

    // ... (re-fetching missing titles if any) ...
    // To make it robust:
    const allCareerIds = Array.from(evidenceMap.keys())
    const missingTitles = allCareerIds.filter((id) => !careerDetails.has(id))

    if (missingTitles.length > 0) {
      const found = await CareerAvailable.query().whereIn('id', missingTitles)
      for (const f of found) {
        careerDetails.set(f.id, f.title)
      }
    }

    const results: RecommendationResult[] = []

    for (const careerId of allCareerIds) {
      const massCareer = accumulatedMass.values.get(careerId) || 0
      const belief = massCareer
      const plausibility = massCareer + accumulatedMass.theta

      // Filter out negligible results if desired
      if (plausibility > 0.001) {
        results.push({
          career: {
            id: careerId,
            title: careerDetails.get(careerId) || 'Unknown Career',
          },
          belief: Number(belief.toFixed(4)),
          plausibility: Number(plausibility.toFixed(4)),
          supporting_evidence: {
            skills: Array.from(evidenceMap.get(careerId)?.skills || []),
            education: Array.from(evidenceMap.get(careerId)?.education || []),
            current_job: evidenceMap.get(careerId)?.current_job,
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

    // 1. Intersect m1 focal elements with m2 focal elements
    // m1 focal elements are Singletons + Theta
    const m1Keys = Array.from(m1.values.keys())

    // m2 focal elements are Singletons + Theta
    // In our specific case, m2 usually has 1 Singleton + Theta, but we implement generally.
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

    // 2. Normalize by (1 - conflict)
    const normalizationFactor = 1.0 / (1.0 - conflict)

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
