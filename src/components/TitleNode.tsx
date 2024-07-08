import { memo, useCallback } from 'react';
import { NodeProps, useOnViewportChange, Viewport } from '@xyflow/react';

import type { TitleNode } from "./Designer"

function TitleNode({ data }: NodeProps<TitleNode>) {
    const onStart = useCallback((viewport: Viewport) => console.log('onStart', viewport), []);
    const onChange = useCallback((viewport: Viewport) => console.log('onChange', viewport), []);
    const onEnd = useCallback((viewport: Viewport) => console.log('onEnd', viewport), []);

    useOnViewportChange({
        onStart,
        onChange,
        onEnd,
    });

    return (
        <>
            <div className='centered'>
                {data.title}
            </div>
        </>
    );
}

export default memo(TitleNode);
