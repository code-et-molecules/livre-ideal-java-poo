import React, { useState } from 'react';
import { Layers, Play, RotateCcw, ArrowRight, Info } from 'lucide-react';
import { MemoryTraceStep } from '../types';

const DEMO_STEPS: MemoryTraceStep[] = [
  {
    step: 1,
    description: "Déclaration et instanciation du premier étudiant dans le tas.",
    codeLine: 'Etudiant e1 = new Etudiant("224101", "Tremblay");',
    stack: [
      { name: 'args', type: 'String[]', value: '@0x01' },
      { name: 'e1', type: 'Etudiant', value: '@0x10A', isRef: true },
    ],
    heap: [
      {
        address: '@0x10A',
        className: 'Etudiant',
        fields: { da: '"224101"', nom: '"Tremblay"', moyenne: '0.0' },
      },
    ],
  },
  {
    step: 2,
    description: "Création d'un second objet indépendant dans le tas.",
    codeLine: 'Etudiant e2 = new Etudiant("224102", "Gagnon");',
    stack: [
      { name: 'args', type: 'String[]', value: '@0x01' },
      { name: 'e1', type: 'Etudiant', value: '@0x10A', isRef: true },
      { name: 'e2', type: 'Etudiant', value: '@0x20B', isRef: true },
    ],
    heap: [
      {
        address: '@0x10A',
        className: 'Etudiant',
        fields: { da: '"224101"', nom: '"Tremblay"', moyenne: '0.0' },
      },
      {
        address: '@0x20B',
        className: 'Etudiant',
        fields: { da: '"224102"', nom: '"Gagnon"', moyenne: '0.0' },
      },
    ],
  },
  {
    step: 3,
    description: "Création d'un alias de référence : e3 reçoit l'adresse de e1 (aucun new = aucun nouvel objet dans le tas !).",
    codeLine: 'Etudiant e3 = e1;',
    stack: [
      { name: 'args', type: 'String[]', value: '@0x01' },
      { name: 'e1', type: 'Etudiant', value: '@0x10A', isRef: true },
      { name: 'e2', type: 'Etudiant', value: '@0x20B', isRef: true },
      { name: 'e3', type: 'Etudiant', value: '@0x10A', isRef: true },
    ],
    heap: [
      {
        address: '@0x10A',
        className: 'Etudiant (pointé par e1 et e3)',
        fields: { da: '"224101"', nom: '"Tremblay"', moyenne: '0.0' },
      },
      {
        address: '@0x20B',
        className: 'Etudiant (pointé par e2)',
        fields: { da: '"224102"', nom: '"Gagnon"', moyenne: '0.0' },
      },
    ],
  },
  {
    step: 4,
    description: "Modification de l'objet via la référence e3 : l'unique instance @0x10A est modifiée.",
    codeLine: 'e3.setNom("Bouchard");',
    stack: [
      { name: 'args', type: 'String[]', value: '@0x01' },
      { name: 'e1', type: 'Etudiant', value: '@0x10A', isRef: true },
      { name: 'e2', type: 'Etudiant', value: '@0x20B', isRef: true },
      { name: 'e3', type: 'Etudiant', value: '@0x10A', isRef: true },
    ],
    heap: [
      {
        address: '@0x10A',
        className: 'Etudiant (nom modifié !)',
        fields: { da: '"224101"', nom: '"Bouchard"', moyenne: '0.0' },
      },
      {
        address: '@0x20B',
        className: 'Etudiant',
        fields: { da: '"224102"', nom: '"Gagnon"', moyenne: '0.0' },
      },
    ],
  },
  {
    step: 5,
    description: "e2 = null : l'objet @0x20B n'a plus aucune référence active et devient éligible au ramasse-miettes (Garbage Collector).",
    codeLine: 'e2 = null;',
    stack: [
      { name: 'args', type: 'String[]', value: '@0x01' },
      { name: 'e1', type: 'Etudiant', value: '@0x10A', isRef: true },
      { name: 'e2', type: 'Etudiant', value: 'null', isRef: false },
      { name: 'e3', type: 'Etudiant', value: '@0x10A', isRef: true },
    ],
    heap: [
      {
        address: '@0x10A',
        className: 'Etudiant',
        fields: { da: '"224101"', nom: '"Bouchard"', moyenne: '0.0' },
      },
      {
        address: '@0x20B (Orphelin)',
        className: 'Éligible au ramasse-miettes',
        fields: { da: '"224102"', nom: '"Gagnon"', moyenne: '0.0' },
      },
    ],
  },
];

export const MemoryVisualizer: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="my-6 rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200/70 pb-3 dark:border-indigo-900/60">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            Simulateur didactique de la mémoire JVM (pile et tas)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Étape {currentStepIndex + 1} sur {DEMO_STEPS.length}
          </span>
          <button
            onClick={handleReset}
            id="btn-memory-reset"
            className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Réinitialiser
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === DEMO_STEPS.length - 1}
            id="btn-memory-next"
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            Étape suivante
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Ligne de code en cours */}
      <div className="mt-3 rounded-lg bg-slate-900 px-3.5 py-2 font-mono text-xs text-amber-300">
        <span className="text-slate-500 mr-2">&gt;</span>
        {step.codeLine}
      </div>

      {/* Explication de l'effet */}
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
        <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
        <span>{step.description}</span>
      </p>

      {/* Grille mémoire Stack / Heap */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonne Pile (Stack) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pile d'appels (Stack)
            </span>
            <span className="text-[11px] text-slate-400">Variables locales</span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            {step.stack.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 font-mono text-xs dark:bg-slate-800/80"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{v.name}</span>
                  <span className="text-[10px] text-slate-400">({v.type})</span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`font-semibold ${
                      v.isRef
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : v.value === 'null'
                        ? 'text-rose-500'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {v.value}
                  </span>
                  {v.isRef && <ArrowRight className="h-3 w-3 text-indigo-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne Tas (Heap) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tas dynamique (Heap)
            </span>
            <span className="text-[11px] text-slate-400">Objets instanciés</span>
          </div>
          <div className="mt-2.5 space-y-2">
            {step.heap.map((obj, i) => {
              const isOrphan = obj.address.includes('Orphelin');
              return (
                <div
                  key={i}
                  className={`rounded-lg border p-2.5 font-mono text-xs transition-colors ${
                    isOrphan
                      ? 'border-dashed border-rose-300 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20'
                      : 'border-indigo-100 bg-indigo-50/30 dark:border-indigo-900/40 dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <span className="text-indigo-600 dark:text-indigo-400">{obj.address}</span>
                    <span className={isOrphan ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      {obj.className}
                    </span>
                  </div>
                  <div className="mt-1.5 space-y-0.5 border-t border-slate-200/50 pt-1.5 text-[11px] text-slate-600 dark:text-slate-400 dark:border-slate-700/50">
                    {Object.entries(obj.fields).map(([k, val]) => (
                      <div key={k} className="flex justify-between">
                        <span>{k} :</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
