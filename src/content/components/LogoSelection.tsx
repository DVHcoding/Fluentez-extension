// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Position } from './TextSelection';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################

// Types

interface LogoProps {
    position: Position;
    onClose: () => void;
    onClick: () => void;
}

// Constants
const LOGO_CONFIG = {
    SIZE: '20px',
    MARGIN_TOP: 7,
    DISPLAY_DURATION: 2000,
    FADE_DURATION: 300,
    Z_INDEX: 1000,
};

const LogoSelection: React.FC<LogoProps> = ({ position, onClose, onClick }) => {
    const logoRef = useRef<HTMLButtonElement>(null);
    const [logoSrc, setLogoSrc] = useState<string>('');

    useEffect(() => {
        // Set logo source using chrome runtime
        const logoPath = window.chrome.runtime.getURL('vitefavicon.png');
        setLogoSrc(logoPath);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                logoRef.current &&
                !logoRef.current.contains(e.target as Node) &&
                (e.target as HTMLElement).id !== 'Ψdetails' &&
                !(e.target as HTMLElement).closest('#Ψdetails')
            ) {
                // bao con gpt thêm check Details chỗ này
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return createPortal(
        <button
            ref={logoRef}
            style={{
                position: 'absolute',
                top: `${position.top + LOGO_CONFIG.MARGIN_TOP}px`,
                left: `${position.left}px`,
                zIndex: LOGO_CONFIG.Z_INDEX,
                transition: `opacity ${LOGO_CONFIG.FADE_DURATION}ms`,
                opacity: 1,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            {logoSrc && (
                <img
                    src={logoSrc}
                    alt="Logo"
                    style={{
                        width: LOGO_CONFIG.SIZE,
                        pointerEvents: 'all',
                    }}
                />
            )}
        </button>,
        document.body
    );
};

export default LogoSelection;
