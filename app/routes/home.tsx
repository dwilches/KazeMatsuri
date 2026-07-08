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
                    <span style={ { color: "#ff6097" } }>風</span>
                    <span style={ { color: "#58ecb3" } }>祭</span>
                    <span style={ { color: "#ff9a44" } }>り</span>
                </h1>
                <h1>
                    <span style={ { color: "#ffdd67" } }>Kaze</span>
                    <span style={ { color: "#58ecb3" } }>Matsuri</span>
                </h1>
            </div>
            <div className="main-content">
                <AudioProvider>
                    <VocabularyProvider>
                        <KanaInputProvider>
                            <GameControlsProvider>
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

                            </GameControlsProvider>
                        </KanaInputProvider>
                    </VocabularyProvider>
                </AudioProvider>
            </div>
            <div className="game-footer">
                {/*Credits*/ }
            </div>
        </div>
    );
}
