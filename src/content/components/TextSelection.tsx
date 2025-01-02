import React, { useEffect, useState } from 'react';
import DetailsSelection from './DetailsSelection';
import LogoSelection from './LogoSelection';

export interface Position {
    top: number;
    left: number;
}

declare global {
    interface Window {
        chrome: typeof chrome;
    }
}

// Main TextSelector Component
const TextSelector: React.FC = () => {
    /* ########################################################################## */
    /*                                    HOOKS                                   */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                               REACT ROUTE DOM                              */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                              STATE MANAGEMENT                              */
    /* ########################################################################## */
    const [logoPosition, setLogoPosition] = useState<Position | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    /* ########################################################################## */
    /*                                     RTK                                    */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                  VARIABLES                                 */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                             FUNCTION MANAGEMENT                            */
    /* ########################################################################## */
    const handleLogoClose = () => {
        setLogoPosition(null);
        setShowDetails(false);
    };

    const handleLogoClick = () => {
        setShowDetails(true);
    };

    /* ########################################################################## */
    /*                                CUSTOM HOOKS                                */
    /* ########################################################################## */

    /* ########################################################################## */
    /*                                  useEffect                                 */
    /* ########################################################################## */

    useEffect(() => {
        const handleTextSelection = () => {
            const selection = window.getSelection();
            const selectedText = selection?.toString().trim();

            if (!selectedText || !selection) {
                setLogoPosition(null);
                setShowDetails(false);
                return;
            }

            try {
                const range = selection.getRangeAt(0).cloneRange();
                range.collapse(false);

                const fake = document.createElement('span');
                const uid = Math.random().toString(34);
                fake.id = uid;
                fake.appendChild(document.createTextNode('\ufeff'));
                range.insertNode(fake);
                // use fake element to get offset

                let obj = fake;
                let left = 0,
                    top = 0;
                do {
                    left += obj.offsetLeft || 0;
                    top += obj.offsetTop || 0;
                } while ((obj = obj.offsetParent as HTMLElement));

                fake.remove();

                setLogoPosition({ top, left });
                setShowDetails(false);
                setSelectedText(selectedText);
            } catch (error) {
                console.error('Error handling text selection:', error);
            }
        };

        document.addEventListener('mouseup', handleTextSelection);
        return () => {
            document.removeEventListener('mouseup', handleTextSelection);
        };
    }, []);

    return (
        <div>
            {logoPosition && (
                <div>
                    <LogoSelection position={logoPosition} onClose={handleLogoClose} onClick={handleLogoClick} />
                    {showDetails && <DetailsSelection position={logoPosition} selectedText={selectedText} />}
                </div>
            )}
        </div>
    );
};
export default TextSelector;
