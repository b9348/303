
import React, { useState, useEffect, useRef } from 'react';
import { getInitialState, GameState, Scene, Choice } from './types';
import { STORY } from './data/story';
import { StatusBar } from './components/StatusBar';
import { SceneDisplay } from './components/SceneDisplay';
import { AudioManager } from './utils/AudioManager';

// Gallery Component
const EndingGallery: React.FC<{ unlocked: string[], onClose: () => void }> = ({ unlocked, onClose }) => {
  const endings = Object.values(STORY).filter(s => s.endingType);
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-fade-in backdrop-blur-xl">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-stone-700 bg-stone-950 flex justify-between items-center">
          <h2 className="text-xl font-horror text-red-600 tracking-widest">轮回记录</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white px-2 text-2xl">×</button>
        </div>
        <div className="overflow-y-auto p-4 space-y-3">
          {endings.map(ending => {
            const isUnlocked = unlocked.includes(ending.id);
            return (
              <div key={ending.id} className={`p-4 border ${isUnlocked ? (ending.endingType === 'true' ? 'border-yellow-900/50 bg-stone-800' : 'border-red-900/50 bg-stone-800') : 'border-stone-800 bg-stone-950'} rounded flex items-center gap-4 transition-all`}>
                 <div className={`w-2 h-16 ${isUnlocked ? (ending.endingType === 'true' ? 'bg-yellow-600' : 'bg-red-800') : 'bg-stone-800'} rounded-full shrink-0`}></div>
                 <div>
                   <h3 className={`font-serif-sc font-bold text-lg ${isUnlocked ? 'text-stone-200' : 'text-stone-700'}`}>
                     {isUnlocked ? ending.title : '???'}
                   </h3>
                   <p className={`text-sm mt-1 ${isUnlocked ? 'text-stone-400' : 'text-stone-800'}`}>
                     {isUnlocked ? (ending.text.slice(0, 30) + '...') : '尚未抵达此结局'}
                   </p>
                 </div>
              </div>
            );
          })}
          {unlocked.length === 0 && <div className="text-center text-stone-600 py-8">暂无记录</div>}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Persistent State for Gallery
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('huis_endings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showGallery, setShowGallery] = useState(false);

  // Get current scene object
  const currentScene: Scene = STORY[gameState.currentSceneId] || STORY['start'];

  // Handle Audio BGM changes
  useEffect(() => {
    if (!hasStarted) return;
    
    const audio = AudioManager.getInstance();
    
    // Determine BGM based on scene properties
    if (currentScene.endingType === 'true') {
        audio.playAmbience('safe');
    } else if (currentScene.visualEffect === 'shake' || currentScene.visualEffect === 'glitch' || gameState.sanity < 30) {
        audio.playAmbience('danger');
    } else {
        audio.playAmbience('normal');
    }

  }, [gameState.currentSceneId, hasStarted, gameState.sanity]);

  // Save endings when changed
  useEffect(() => {
    localStorage.setItem('huis_endings', JSON.stringify(unlockedEndings));
  }, [unlockedEndings]);

  // Check for ending unlock
  useEffect(() => {
    if (currentScene.endingType && !unlockedEndings.includes(currentScene.id)) {
      setUnlockedEndings(prev => [...prev, currentScene.id]);
    }
  }, [currentScene, unlockedEndings]);

  // Reset text completion when scene changes
  useEffect(() => {
    setIsTextComplete(false);
  }, [gameState.currentSceneId]);

  const handleStartGame = async () => {
    await AudioManager.getInstance().init();
    await AudioManager.getInstance().resume();
    AudioManager.getInstance().playClick();
    setHasStarted(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = AudioManager.getInstance().toggleMute();
    setIsMuted(muted);
    AudioManager.getInstance().playClick();
  };

  const handleChoice = (choiceId: string) => {
    AudioManager.getInstance().playClick();
    const choice = currentScene.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Special Case: Restart Logic
    if (choice.nextSceneId === 'start') {
      setGameState(getInitialState());
      return;
    }

    // Create copy of state to modify
    const nextState = { ...gameState };
    
    // Update Sanity
    if (choice.sanityCost) {
      nextState.sanity = Math.max(0, nextState.sanity - choice.sanityCost);
    }
    
    // Handle Items
    if (choice.getItem && !nextState.inventory.includes(choice.getItem)) {
      nextState.inventory.push(choice.getItem);
    }

    // Apply Choice Effect FIRST
    if (choice.effect) {
      Object.assign(nextState, choice.effect(nextState));
    }

    // Apply Next Scene Effect
    const nextScene = STORY[choice.nextSceneId];
    if (nextScene?.effect) {
      Object.assign(nextState, nextScene.effect(nextState));
    }

    // Set Scene
    if (nextState.sanity <= 0 && !choice.type?.includes('end')) {
      nextState.isGameOver = true;
      nextState.currentSceneId = 'game_over_death';
    } else {
      nextState.currentSceneId = choice.nextSceneId;
    }

    nextState.history.push(gameState.currentSceneId);
    setGameState(nextState);
  };

  const isChoiceAvailable = (choice: Choice) => {
    if (choice.requiredItem && !gameState.inventory.includes(choice.requiredItem)) return false;
    if (choice.hideIfItem && gameState.inventory.includes(choice.hideIfItem)) return false;
    if (choice.requiredSanity && gameState.sanity < choice.requiredSanity) return false;
    if (choice.requiredFlag && !gameState.flags[choice.requiredFlag]) return false;
    if (choice.hideIfFlag && gameState.flags[choice.hideIfFlag]) return false;
    return true;
  };

  const handleGlobalClick = () => {
    if (!isTextComplete) {
      setIsTextComplete(true);
      AudioManager.getInstance().playClick('hover');
    }
  };

  if (!hasStarted) {
    return (
      <button 
        onClick={handleStartGame}
        className="h-full w-full bg-black flex items-center justify-center flex-col cursor-pointer hover:bg-stone-950 transition-colors"
      >
        <div className="text-red-900 font-horror text-6xl animate-pulse mb-8">回煞</div>
        <div className="text-stone-500 font-serif-sc text-sm tracking-[0.5em] animate-bounce">点击屏幕进入梦境</div>
      </button>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-stone-950 font-serif-sc overflow-hidden relative">
      {/* Global Effects */}
      <div className="scanlines pointer-events-none absolute inset-0 z-50"></div>
      <div className="vignette pointer-events-none absolute inset-0 z-40"></div>
      
      {/* Mute Button */}
      <button 
        onClick={toggleMute}
        className="absolute top-4 right-4 z-[60] p-2 text-stone-500 hover:text-stone-200 bg-black/50 rounded-full border border-stone-800 backdrop-blur-sm"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {showGallery && <EndingGallery unlocked={unlockedEndings} onClose={() => setShowGallery(false)} />}

      {/* Main Scene Content */}
      <main 
        className="flex-grow overflow-y-auto z-10 scroll-smooth relative cursor-pointer" 
        onClick={handleGlobalClick}
      >
        <div className="flex flex-col min-h-full pb-10">
          
          <SceneDisplay 
            scene={currentScene} 
            onTextComplete={() => setIsTextComplete(true)} 
            forceShow={isTextComplete}
          />

          {/* Interaction Area */}
          <div className={`w-full max-w-2xl mx-auto px-6 pt-4 pb-12 z-30 flex flex-col justify-end flex-grow transition-all duration-700 ${isTextComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="flex flex-col gap-4">
              
              <div className="w-full h-px bg-stone-800 mb-2"></div>

              {/* Choices */}
              {currentScene.choices.map((choice) => {
                const available = isChoiceAvailable(choice);
                if (!available) return null; 

                let buttonStyle = "border border-stone-700 bg-stone-900/50 text-stone-300 hover:bg-stone-800 hover:text-stone-100 hover:border-stone-500";
                if (choice.type === 'danger') buttonStyle = "border border-red-900/60 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-200 hover:border-red-500";
                if (choice.type === 'investigate') buttonStyle = "border border-stone-600 text-amber-100/80 bg-stone-900/60 hover:bg-stone-800";
                if (choice.type === 'end') buttonStyle = "border-2 border-stone-400 text-stone-100 bg-stone-800 hover:bg-stone-700 py-5 font-bold text-lg";

                return (
                  <button
                    key={choice.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoice(choice.id);
                    }}
                    onMouseEnter={() => AudioManager.getInstance().playClick('hover')}
                    className={`
                      w-full py-4 px-6 text-left text-base md:text-lg transition-all duration-200 font-serif-sc tracking-wider rounded-sm
                      shadow-md flex items-center group
                      ${buttonStyle}
                      active:scale-[0.98]
                    `}
                  >
                    <span className="mr-3 opacity-50 group-hover:opacity-100 group-hover:text-red-500 transition-colors">❖</span>
                    <span className="flex-grow">{choice.text}</span>
                  </button>
                );
              })}

              {(currentScene.endingType || gameState.isGameOver) && !currentScene.choices.some(c => c.nextSceneId === 'start') && (
                 <button
                 onClick={(e) => {
                   e.stopPropagation();
                   AudioManager.getInstance().playClick();
                   setGameState(getInitialState());
                 }}
                 className="w-full py-4 px-6 text-center text-stone-400 border border-stone-800 hover:bg-stone-900 mt-4 rounded"
               >
                 - 重新开始 -
               </button>
              )}

              <div className="mt-8 pt-6 border-t border-stone-800/50">
                <StatusBar 
                  sanity={gameState.sanity} 
                  inventory={gameState.inventory} 
                  onOpenGallery={() => {
                    AudioManager.getInstance().playClick();
                    setShowGallery(true);
                  }}
                  showGalleryButton={gameState.currentSceneId === 'start' || currentScene.endingType !== undefined || gameState.isGameOver}
                />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
