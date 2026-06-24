'use client'

import { BasicBlocksKit } from './basic-blocks-kit'
import { BasicMarksKit } from './basic-marks-kit'
import { ListKit } from './list-kit'
import { MediaKit } from './media-kit'

export const BasicNodesKit = [...BasicBlocksKit, ...BasicMarksKit, ...ListKit, ...MediaKit]
