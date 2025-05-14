import React from "react";
import {Accordion, AccordionItem} from "@heroui/react";
import rulesData from './RulesData';


export default function RulesPage() {
    return (<div
        className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 to-black text-white px-6 pt-20">
        <h1 className="text-5xl font-bold mb-10 text-yellow-500">Game Rules</h1>

        <Accordion selectionMode="multiple" variant="splitted" className="max-w-4xl w-full">
            {Object.entries(rulesData).map(([key, game]) => (<AccordionItem key={key} title={game.title}
                                                                            className="bg-white/10 rounded-2xl border border-white/20 text-white">
                <div className="p-4">
                    <p className="text-white-300 mb-6">{game.description}</p>
                    <div className="space-y-4">
                        {game.sections.map((section, index) => (<div key={index}>
                            <h3 className="font-semibold text-lg text-white mb-1">{section.heading}</h3>
                            <p className="text-white-400">{section.content}</p>
                        </div>))}
                    </div>
                </div>
            </AccordionItem>))}
        </Accordion>
    </div>);
}