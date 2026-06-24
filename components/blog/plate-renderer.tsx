import { createStaticEditor, PlateStatic } from 'platejs/static'

import { BaseBasicBlocksKit } from '@/components/editor/plugins/basic-blocks-base-kit'
import { BaseBasicMarksKit } from '@/components/editor/plugins/basic-marks-base-kit'
import { BaseListKit } from '@/components/editor/plugins/list-base-kit'
import { BaseMediaKit } from '@/components/editor/plugins/media-base-kit'
import { normalizePlateContent } from '@/lib/plate-content'
import { cn } from '@/lib/utils'

interface PlateRendererProps {
    content: any
    className?: string
}

export function PlateRenderer({ content, className }: PlateRendererProps) {
    const editor = createStaticEditor({
        plugins: [...BaseBasicBlocksKit, ...BaseBasicMarksKit, ...BaseListKit, ...BaseMediaKit]
    })

    return (
        <PlateStatic
            editor={editor}
            value={normalizePlateContent(content)}
            className={cn('prose prose-sm dark:prose-invert max-w-none', className)}
        />
    )
}
