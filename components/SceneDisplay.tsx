
import React, { useState, useEffect } from 'react';
import { Scene } from '../types';
import { Typewriter } from './Typewriter';
import { AudioManager } from '../utils/AudioManager';

interface SceneDisplayProps {
  scene: Scene;
  onTextComplete: () => void;
  forceShow: boolean;
}

export const SceneDisplay: React.FC<SceneDisplayProps> = ({ scene, onTextComplete, forceShow }) => {
  // Trigger SFX on scene mount/change
  useEffect(() => {
    const audio = AudioManager.getInstance();
    
    if (scene.visualEffect === 'glitch') {
        audio.playSFX('glitch');
    } else if (scene.visualEffect === 'shake') {
        audio.playSFX('shake');
    }

    // Reset ambience if we move to a normal scene from a danger one, 
    // though the App component handles main BGM logic, local cues help too.
  }, [scene.id, scene.visualEffect]);

  // Dynamic container classes
  const containerClasses = `
    w-full max-w-2xl mx-auto flex flex-col items-center p-6 md:p-10
    transition-all duration-1000 min-h-[40vh]
    ${scene.visualEffect === 'shake' ? 'animate-shake' : ''}
    ${scene.visualEffect === 'flicker' ? 'animate-flicker' : ''}
  `;

  return (
    <div className="w-full flex-grow">
      <div className={containerClasses}>
        {/* Ambient Background Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
          <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl mix-blend-screen
            ${scene.id.includes('good') ? 'bg-yellow-900' : 'bg-red-900'}
          `}></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-stone-800 blur-3xl mix-blend-overlay"></div>
        </div>

        {/* Content Container */}
        <div 
          className="z-10 w-full flex flex-col active:opacity-95 transition-opacity mt-2"
        >
          {/* Visual cue for location/scene */}
          <div className="mb-6 border-l-4 border-red-800 pl-4 bg-gradient-to-r from-red-950/40 to-transparent py-3">
            <h2 className="font-horror text-3xl md:text-4xl text-red-500 tracking-widest drop-shadow-md leading-relaxed">
              {scene.title || (scene.id === 'start' ? '序幕' : 
               scene.endingType ? '终局' : 
               '现世 · 梦魇')}
            </h2>
          </div>

          {/* Main Text */}
          <div className="prose prose-invert prose-stone max-w-none select-none md:select-text mb-6">
            {/* Increased text size and line-height for mobile readability, added paragraph spacing utility */}
            <div className="text-lg md:text-xl leading-8 md:leading-10 font-serif-sc text-stone-200 drop-shadow-md font-medium whitespace-pre-line">
              <Typewriter 
                text={scene.text} 
                onComplete={onTextComplete} 
                speed={25} 
                forceShow={forceShow}
              />
            </div>
          </div>

          {/* Sound Cue Text - Enhanced Visibility */}
          {scene.soundCue && (
            <div className={`
              mt-4 p-4 rounded bg-stone-900/80 border-l-4 border-amber-700
              text-base text-amber-500 font-mono font-bold tracking-wide
              animate-pulse flex items-center gap-3 shadow-lg
              transition-opacity duration-500
              ${forceShow || scene.text.length < 50 ? 'opacity-100' : 'opacity-0 delay-[2000ms]'}
            `}>
              <span className="text-xl">👂</span>
              {scene.soundCue}
            </div>
          )}
        </div>

        {/* Glitch Overlay logic */}
        {scene.visualEffect === 'glitch' && (
          <div className="absolute inset-0 pointer-events-none z-20 opacity-10 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eGZ5eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/l41lFw057lAJQMxv2/giphy.gif')] bg-cover mix-blend-exclusion"></div>
        )}
      </div>
    </div>
  );
};
