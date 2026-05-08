import type { StaffProfileRoleType } from '../../../services/schedulingService'
import type { WorkPlanActivityType } from '../services/workPlanDraftService'

export type WorkPlanContentOption = {
  value: string
  details?: string[]
}

const PT_INDIVIDUAL = ['肢體幅度訓練', '肌力訓練', '平衡訓練', '轉移訓練', '站立訓練', '步行訓練', '心肺治療', '耐力訓練', '其他']
const PT_GROUP = ['主動伸展', '肌力訓練', '平衡訓練']
const PT_ASSESS = ['初次評估', '出院評估', '覆檢', '個人關顧計劃']

const PTA_INDIVIDUAL = ['肢體幅度訓練', '肌力訓練', '平衡訓練', '轉移訓練', '站立訓練', '步行訓練', '耐力訓練', '其他']
const PTA_GROUP = ['主動伸展', '肌力訓練', '平衡訓練']

const OT_INDIVIDUAL: WorkPlanContentOption[] = [
  { value: '日常生活活動訓練', details: ['進食', '梳洗', '穿衣', '如廁', '洗澡', '其他細項'] },
  { value: '上肢/手部功能訓練', details: ['抓握訓練', '靈巧度訓練', '其他細項'] },
  { value: '關節活動度訓練' },
  { value: '平衡與轉移訓練', details: ['坐站移位', '床邊移位', '輪椅轉移', '其他細項'] },
  { value: '認知復康訓練', details: ['記憶訓練', '注意力訓練', '執行功能訓練', '其他細項'] },
  { value: '輔具訓練', details: ['輪椅使用', '日常生活輔具', '其他細項'] },
  { value: '感官刺激訓練', details: ['觸覺敏感訓練', '觸覺刺激', '其他細項'] },
]

const OT_GROUP: WorkPlanContentOption[] = [
  { value: '懷舊治療小組' },
  { value: '藝術治療小組', details: ['繪畫', '創作表達', '其他細項'] },
  { value: '運動治療小組', details: ['座式八段錦', '椅子操', '其他細項'] },
  { value: '認知訓練小組', details: ['記憶遊戲', '謎題', '問題解決活動', '其他細項'] },
  { value: '社交技能小組', details: ['溝通技巧', '傾聽技巧', '互動技巧', '其他細項'] },
  { value: '壓力管理小組', details: ['深呼吸', '冥想', '其他細項'] },
  { value: '香薰治療小組' },
  { value: '多感官訓練小組' },
  { value: '生命回顧小組' },
]

const OT_ASSESS = ['初次評估', '出院評估', '覆檢', '個人關顧計劃']

const OTA_INDIVIDUAL: WorkPlanContentOption[] = [
  { value: '基本運動練習', details: ['床邊運動', '坐站轉移', '簡單伸展', '其他細項'] },
  { value: '簡單日常生活活動練習', details: ['使用食具', '洗面', '梳頭', '其他細項'] },
  { value: '認知刺激活動', details: ['記憶遊戲', '配對卡片', '數字練習', '其他細項'] },
  { value: '輔具使用練習', details: ['輔助食具', '其他細項'] },
  { value: '精細動作練習', details: ['握力球', '插板', '寫字繪畫', '其他細項'] },
  { value: '坐姿耐力與姿勢維持' },
]

const OTA_GROUP: WorkPlanContentOption[] = [
  { value: '日常生活技能小組', details: ['穿衣', '吃飯', '個人衛生', '其他細項'] },
  { value: '簡單手工藝小組', details: ['串珠', '摺紙', '編織', '其他細項'] },
  { value: '團體遊戲小組', details: ['桌遊', '卡牌遊戲', '團體拼圖', '其他細項'] },
  { value: '音樂治療小組', details: ['唱歌', '打節奏', '樂器演奏', '其他細項'] },
  { value: '園藝治療小組', details: ['種植', '澆水', '其他細項'] },
]

export const allowedActivityTypesByRole: Record<StaffProfileRoleType, WorkPlanActivityType[]> = {
  PT: ['Individual', 'Group', 'Assessment', 'Other'],
  OT: ['Individual', 'Group', 'Assessment', 'Other'],
  PTA: ['Individual', 'Group', 'Other'],
  OTA: ['Individual', 'Group', 'Other'],
  TeamLead: ['Other'],
}

const plain = (values: string[]): WorkPlanContentOption[] => values.map((value) => ({ value }))

export const getContentOptions = (
  role: StaffProfileRoleType,
  activityType: WorkPlanActivityType,
): WorkPlanContentOption[] => {
  if (activityType === 'Other') return [{ value: '其他' }]
  if (role === 'PT') return activityType === 'Group' ? plain(PT_GROUP) : activityType === 'Assessment' ? plain(PT_ASSESS) : plain(PT_INDIVIDUAL)
  if (role === 'PTA') return activityType === 'Group' ? plain(PTA_GROUP) : plain(PTA_INDIVIDUAL)
  if (role === 'OT') return activityType === 'Group' ? OT_GROUP : activityType === 'Assessment' ? plain(OT_ASSESS) : OT_INDIVIDUAL
  if (role === 'OTA') return activityType === 'Group' ? OTA_GROUP : OTA_INDIVIDUAL
  return [{ value: '其他' }]
}

export const resolveDetailOptions = (
  role: StaffProfileRoleType,
  activityType: WorkPlanActivityType,
  activityContent: string,
): string[] => {
  const hit = getContentOptions(role, activityType).find((item) => item.value === activityContent)
  return hit?.details ?? []
}
