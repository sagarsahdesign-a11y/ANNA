import React from 'react';
import { AnalysisResult, FreshnessLevel } from '../types';
import { AlertTriangle, CheckCircle, Info, Flame, Scale } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onSave: () => void;
  onDiscard: () => void;
  isSaving: boolean;
}

const COLORS = ['#22c55e', '#eab308', '#f97316', '#3b82f6'];

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, onSave, onDiscard, isSaving }) => {
  
  const chartData = result.items.map(item => ({
    name: item.name,
    value: item.totalCalories
  }));

  const getFreshnessColor = (level: FreshnessLevel) => {
    switch(level) {
      case FreshnessLevel.FRESH: return 'text-green-600 bg-green-100';
      case FreshnessLevel.ACCEPTABLE: return 'text-yellow-600 bg-yellow-100';
      case FreshnessLevel.SPOILED: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Summary */}
        <div className="bg-brand-600 p-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-1">{result.totalCalories} kcal</h2>
            <p className="opacity-90">Total Estimated Energy</p>
        </div>

        {/* Content */}
        <div className="p-6">
            
            {/* AI Summary */}
            <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                <Info className="flex-shrink-0 text-blue-500 mt-1" size={20} />
                <p className="text-blue-800 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Food Items List */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Detected Items</h3>
            <div className="space-y-4">
                {result.items.map((item, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl p-4 shadow-sm bg-gray-50/50">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                <div className="flex gap-2 text-xs mt-1">
                                    <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-medium">
                                        Confidence: {Math.round(item.confidence * 100)}%
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${getFreshnessColor(item.freshness as FreshnessLevel)}`}>
                                        {item.freshness === FreshnessLevel.SPOILED && <AlertTriangle size={12} />}
                                        {item.freshness === FreshnessLevel.FRESH && <CheckCircle size={12} />}
                                        {item.freshness}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-brand-600 text-lg">{item.totalCalories} kcal</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                             <div className="flex items-center gap-2">
                                <Scale size={16} className="text-gray-400" />
                                <span>Weight: <b>{item.estimatedWeightGrams}g</b></span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Flame size={16} className="text-gray-400" />
                                <span>Density: <b>{item.caloriesPer100g}</b> kcal/100g</span>
                             </div>
                        </div>
                        
                        {item.reasoning && (
                            <p className="mt-3 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-2">
                                "{item.reasoning}"
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
                <div className="h-64 mt-8 w-full min-h-[256px]">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">Calorie Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
                <button 
                    onClick={onDiscard}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSaving}
                >
                    Discard
                </button>
                <button 
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex-1 py-3 px-4 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-70 flex justify-center"
                >
                    {isSaving ? "Saving..." : "Log Meal"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultView;