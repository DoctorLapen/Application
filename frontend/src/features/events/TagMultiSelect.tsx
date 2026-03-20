import React, { useState, useRef, useEffect } from 'react';
import type { Tag } from './types';
import { tagColors } from './constants';




interface TagMultiSelectProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
}

const TagMultiSelect: React.FC<TagMultiSelectProps> = ({
  availableTags,
  selectedTags,
  onChange,
  placeholder = 'Select tags',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag: Tag) => {
  const exists = selectedTags.some(t => t.id === tag.id);
  if (exists) {
    onChange(selectedTags.filter(t => t.id !== tag.id));
  } else {
    onChange([...selectedTags, tag]);
  }
};

  const removeTag = (tagId: number) => {
    onChange(selectedTags.filter(t => t.id !== tagId));
    
  };

  
  

  return (
    <div className="relative" ref={dropdownRef}>
      

      
      <div
        className="border rounded p-2 flex flex-wrap gap-1 items-center min-h-[2.5rem] cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selectedTags.length === 0 && <span className="text-gray-400">{placeholder}</span>}
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="flex items-center gap-1 px-3 py-1 text-sm text-white rounded hover:opacity-90 transition"
            style={{ backgroundColor: tagColors[tag.id] || '#3b82f6' }}
          >
            {tag.name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag.id); }}
              className="ml-1 text-white font-bold hover:text-gray-200"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      
      {dropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-48 overflow-y-auto">
          {availableTags.map(tag => (
            <label
              key={tag.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTags.some(t => t.id === tag.id)}
                onChange={() => toggleTag(tag)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <span style={{ color: tagColors[tag.id]  || '#3b82f6' }}>{tag.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagMultiSelect;