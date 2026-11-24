import { MealLog } from '../types';

export interface ScanAnalysisResult extends Omit<MealLog, 'id' | 'timestamp'> {
  confidenceScore: number;
}

export async function analyzeMealPhoto(
  imageDataUrl: string,
  mealNameHint?: string
): Promise<ScanAnalysisResult> {
  const response = await fetch('/api/analyze-meal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageDataUrl,
      fileName: mealNameHint,
    }),
  });

  const payload = await response.json();
  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload?.error || 'Failed to analyze meal photo via server AI');
  }

  const d = payload.data;
  const carbsNum = parseInt(String(d.carbs).replace(/[^\d]/g, ''), 10) || 30;
  const fiberNum = parseInt(String(d.fiber).replace(/[^\d]/g, ''), 10) || 5;
  const proteinNum = parseInt(String(d.protein).replace(/[^\d]/g, ''), 10) || 20;
  const fatNum = parseInt(String(d.fat).replace(/[^\d]/g, ''), 10) || 12;
  const giVal = Number(d.glycemicIndex) || 35;

  return {
    name: d.name,
    mealType: 'Lunch',
    imageUrl: d.imageUrl || imageDataUrl,
    calories: Number(d.calories) || 350,
    protein: proteinNum,
    carbs: carbsNum,
    fat: fatNum,
    fiber: fiberNum,
    sugar: Math.max(1, Math.round(carbsNum * 0.15)),
    glycemicLoad: giVal > 55 ? 'High' : giVal > 35 ? 'Moderate' : 'Low',
    glycemicIndexValue: giVal,
    glycemicSpikeEstimate: d.advice || `GI ~${giVal}`,
    goodHighlights: d.good ? [d.good] : [],
    cautionaryMacros: d.bad && d.bad !== 'None' ? [d.bad] : [],
    micronutrients: [],
    glucoseCurve: generateRealisticGlucoseCurve(giVal, carbsNum, fiberNum),
    confidenceScore: Number(d.confidence) || 94,
  };
}

function generateRealisticGlucoseCurve(glycemicIndex: number, carbs: number, fiber: number) {
  const baseFasting = 88;
  const netCarbImpact = Math.max(5, (carbs - fiber * 0.5) * (glycemicIndex / 100) * 0.45);
  const peakIncrement = Math.round(Math.min(75, netCarbImpact));
  const peakMinute = glycemicIndex > 55 ? 30 : 45;

  return [
    { timeMinutes: 0, glucoseMgDl: baseFasting },
    { timeMinutes: 15, glucoseMgDl: Math.round(baseFasting + peakIncrement * 0.45) },
    {
      timeMinutes: 30,
      glucoseMgDl:
        peakMinute === 30
          ? baseFasting + peakIncrement
          : Math.round(baseFasting + peakIncrement * 0.85),
    },
    {
      timeMinutes: 45,
      glucoseMgDl:
        peakMinute === 45
          ? baseFasting + peakIncrement
          : Math.round(baseFasting + peakIncrement * 0.8),
    },
    { timeMinutes: 60, glucoseMgDl: Math.round(baseFasting + peakIncrement * 0.55) },
    { timeMinutes: 90, glucoseMgDl: Math.round(baseFasting + peakIncrement * 0.25) },
    { timeMinutes: 120, glucoseMgDl: Math.round(baseFasting + peakIncrement * 0.05) },
  ];
}
