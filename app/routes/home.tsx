import type { Route } from "./+types/home";
import React from "react";
import BalloonGraph from "~/components/balloon-graph";
import { AudioProvider } from "~/providers/audio-provider";
import GameControls from "~/components/game-controls";
import { GameControlsProvider } from "~/providers/game-controls-provider";
import { KanaInputProvider } from "~/providers/kana-input-provider/kana-input-provider";
import { KanaVisualizer } from "~/components/kana-visualizer";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "風祭り - Kaze Matsuri" },
        { name: "description", content: "Memorize Kanji with Kaze (風) Matsuri (祭り)" },
    ];
}

export default function Home() {
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
                <KanaInputProvider>
                    <GameControlsProvider>
                        <AudioProvider>
                            <BalloonGraph/>
                            <KanaVisualizer/>
                            <GameControls/>
                        </AudioProvider>
                    </GameControlsProvider>
                </KanaInputProvider>
            </div>
            <div className="game-footer">
                Credits
            </div>
        </div>
    );
}
