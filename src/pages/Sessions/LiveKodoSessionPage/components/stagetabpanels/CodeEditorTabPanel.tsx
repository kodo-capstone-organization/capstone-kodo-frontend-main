import { useState } from 'react';
import { CodeEditorPanelWrapper } from './StageTabPanelsElements';
import Tools from './editor-components/Tools';

const initToolProperties = {
    language: "Python",
}

function CodeEditorTabPanel (props: any) {
    
    const [toolProperties, setToolProperties] = useState<object>(initToolProperties)

    return (
        <CodeEditorPanelWrapper>
            <Tools 
                style={{ top: "0", zIndex: 100, display: "flex", justifyContent: "center"}}
                toolProperties={toolProperties}
                setToolProperties={setToolProperties}
            />
        </CodeEditorPanelWrapper>
    )
}

export default CodeEditorTabPanel;