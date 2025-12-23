import React from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';

const TypingText = ({ text, speed = 30, onComplete }) => {
    const { displayedText, isTyping } = useTypingEffect(text, speed);

    React.useEffect(() => {
        if (!isTyping && onComplete) {
            onComplete();
        }
    }, [isTyping, onComplete]);

    return (
        <>
            {displayedText}
            {isTyping && (
                <span className="inline-block w-1 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
            )}
        </>
    );
};

export default TypingText;
