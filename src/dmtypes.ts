export const DmElementTypeList = ['control', 'label', 'error', 'input'] as const
export type DmElementType = (typeof DmElementTypeList)[number]

export const DmFieldStateList = ['error', 'success', 'default'] as const
export type DmFieldState = (typeof DmFieldStateList)[number]

export type Validator = (v: string) => boolean
