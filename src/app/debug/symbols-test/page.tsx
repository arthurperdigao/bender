'use client';

import React from 'react';
import { AirIcon, EarthIcon, FireIcon, WaterIcon } from '@/components/ui/ElementalIcons';

export default function SymbolsTestPage() {
    return (
        <div className="min-h-screen bg-slate-900 p-20 flex flex-col items-center gap-12 text-white">
            <h1 className="text-4xl font-bold mb-8">Elemental Symbols Preview</h1>

            <div className="grid grid-cols-2 gap-20">
                <div className="flex flex-col items-center gap-4">
                    <AirIcon size={200} />
                    <span className="text-xl font-medium tracking-widest uppercase">Air</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <EarthIcon size={200} />
                    <span className="text-xl font-medium tracking-widest uppercase">Earth</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <FireIcon size={200} />
                    <span className="text-xl font-medium tracking-widest uppercase">Fire</span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <WaterIcon size={200} />
                    <span className="text-xl font-medium tracking-widest uppercase">Water</span>
                </div>
            </div>

            <div className="mt-20 flex flex-col items-center gap-6">
                <h2 className="text-2xl font-semibold opacity-50">Small Variants</h2>
                <div className="flex gap-8">
                    <AirIcon size={48} />
                    <EarthIcon size={48} />
                    <FireIcon size={48} />
                    <WaterIcon size={48} />
                </div>
            </div>
        </div>
    );
}
