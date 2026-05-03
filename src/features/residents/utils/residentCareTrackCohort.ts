import type { Resident } from '../types/resident'

/**
 * PDF 01 §3／§4.1：納入「資助復康」排班／週合規統計之院友（與 `rehabActivityTracking` 資助軌一致）。
 * `Dementia_Service` 且非 `Both` 者不計入資助復康合規（避免與認知軌混算）。
 */
export const isSubsidizedRehabCohort = (r: Resident): boolean =>
  r.serviceType === 'Subsidized_Rehab' || r.serviceType === 'Both'

/**
 * PDF 01 §3.3／§4.2：納入認知軌乾跑／統計之院友（需有認知程度）。
 */
export const isDementiaCareCohort = (r: Resident): boolean =>
  (r.serviceType === 'Dementia_Service' || r.serviceType === 'Both') && r.dementiaLevel !== 'None'
