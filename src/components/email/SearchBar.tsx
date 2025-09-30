import React, { useState } from 'react';
import { Search, X, Filter, Calendar, Paperclip, Star } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';

export const SearchBar: React.FC = () => {
  const { searchFilters, setSearchFilters } = useEmailStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(searchFilters);

  const handleSearch = (query: string) => {
    const newFilters = { ...localFilters, query };
    setLocalFilters(newFilters);
    setSearchFilters(newFilters);
  };

  const handleClearSearch = () => {
    const clearedFilters = { query: '' };
    setLocalFilters(clearedFilters);
    setSearchFilters(clearedFilters);
    setShowAdvanced(false);
  };

  const applyAdvancedFilters = () => {
    setSearchFilters(localFilters);
    setShowAdvanced(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          <input
            type="text"
            value={localFilters.query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search emails..."
            className="w-full pl-9 md:pl-10 pr-10 py-2 text-sm md:text-base bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-veebimajutus-orange"
          />
          {localFilters.query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-2 rounded-lg transition-colors ${
            showAdvanced
              ? 'bg-veebimajutus-orange text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Filter className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {showAdvanced && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 max-h-[80vh] overflow-y-auto">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm md:text-base">Advanced Filters</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.hasAttachments || false}
                onChange={(e) => setLocalFilters({ ...localFilters, hasAttachments: e.target.checked })}
                className="w-4 h-4 text-veebimajutus-orange rounded focus:ring-veebimajutus-orange"
              />
              <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Has attachments</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.isStarred || false}
                onChange={(e) => setLocalFilters({ ...localFilters, isStarred: e.target.checked })}
                className="w-4 h-4 text-veebimajutus-orange rounded focus:ring-veebimajutus-orange"
              />
              <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Starred only</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Date range</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-veebimajutus-orange"
                />
                <input
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-veebimajutus-orange"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setLocalFilters({ query: localFilters.query });
                setShowAdvanced(false);
              }}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={applyAdvancedFilters}
              className="px-4 py-2 text-sm bg-gradient-to-r from-veebimajutus-orange to-veebimajutus-darkorange text-white rounded-lg hover:shadow-lg transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
