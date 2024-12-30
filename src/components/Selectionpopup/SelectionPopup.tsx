import React from 'react';

interface SelectionPopupProps {
    text: string;
    position: {
        x: number;
        y: number;
    };
}

// Logo component that appears when text is selected
export const SelectionLogo: React.FC<SelectionPopupProps & { onClick: () => void }> = ({ position, onClick }) => {
    return (
        <div
            className="fixed z-50 cursor-pointer"
            style={{
                left: `${position.x}px`,
                top: `${position.y + 10}px`,
            }}
            onClick={onClick}
        >
            <img
                src={chrome.runtime.getURL('vitefavicon.png')}
                alt="Extension Logo"
                className="h-6 w-6 rounded-full shadow-lg transition-transform hover:scale-110"
            />
        </div>
    );
};

// Popup component that appears when logo is clicked
export const SelectionPopup: React.FC<SelectionPopupProps> = ({ text, position }) => {
    return (
        <div
            className="fixed z-50 min-w-[200px] rounded-lg bg-white p-4 shadow-lg"
            style={{
                left: `${position.x}px`,
                top: `${position.y + 30}px`,
            }}
        >
            <p className="text-sm">{text}</p>
        </div>
    );
};
