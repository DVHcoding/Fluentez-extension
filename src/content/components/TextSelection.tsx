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
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                setLogoPosition({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                });
                setShowDetails(false);
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
                    {showDetails && <DetailsSelection position={logoPosition} />}
                </div>
            )}
        </div>
    );
};
export default TextSelector;
