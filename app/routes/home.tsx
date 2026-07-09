import type { Route } from "./+types/home";
import React, { useRef } from "react";
import { AudioProvider } from "~/providers/audio-provider";
import { GameControls } from "~/components/game-controls/game-controls";
import { GameControlsProvider } from "~/providers/game-controls-provider";
import { KanaInputProvider } from "~/providers/kana-input-provider/kana-input-provider";
import { KanaVisualizer } from "~/components/kana-visualizer/kana-visualizer";
import { VocabularyProvider } from "~/providers/vocabulary-provider/vocabulary-provider";
import { WelcomeDialog } from "~/dialogs/welcome-dialog/welcome-dialog";
import { ModalDialog } from "~/dialogs/modal-dialog";
import { BalloonsGraph } from "~/components/balloons-graph/balloons-graph";
import { GameFooter } from "~/components/game-footer";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "風祭り - Kaze Matsuri" },
        { name: "description", content: "Memorize Kanji with Kaze (風) Matsuri (祭り)" },
    ];
}

export default function Home() {

    const [isWelcomeModalOpen, setIsWelcomeModalOpen] = React.useState(true);
    const closeCallbackRef = useRef<() => void>(() => {
    });

    const onCloseWelcomeDialog = () => {
        setIsWelcomeModalOpen(false);
        closeCallbackRef.current();
    };

    return (
        <div className="flex items-center flex-col">
            <div className="main-title">
                <h1>
                    <span className={ "text-rose-400" }>風</span>
                    <span className={ "text-emerald-300" }>祭</span>
                    <span className={ "text-orange-400" }>り</span>
                </h1>
                <h1>
                    <span className={ "text-amber-300" }>Kaze</span>
                    <span className={ "text-emerald-300" }>Matsuri</span>
                </h1>
            </div>
            <AudioProvider>
                <VocabularyProvider>
                    <KanaInputProvider>
                        <GameControlsProvider>
                            <div className="main-content">
                                {
                                    !isWelcomeModalOpen &&
                                    <>
                                        <BalloonsGraph/>
                                        <KanaVisualizer/>
                                        <GameControls/>
                                    </>
                                }

                                {
                                    isWelcomeModalOpen &&
                                    <ModalDialog id={ "welcome-dialog" }
                                                 isOpen={ isWelcomeModalOpen }
                                                 onClose={ onCloseWelcomeDialog }>
                                        <WelcomeDialog closeCallbackRef={ closeCallbackRef }/>
                                    </ModalDialog>
                                }

                            </div>
                            <GameFooter/>
                        </GameControlsProvider>
                    </KanaInputProvider>
                </VocabularyProvider>
            </AudioProvider>
        </div>
    );
}
