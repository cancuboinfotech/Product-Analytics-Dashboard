'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Dropdown.module.css';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      {label && <span className={styles.label}>{label}</span>}
      <div 
        className={`${styles.trigger} glass ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || 'Select...'}</span>
        <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`} />
      </div>

      {isOpen && (
        <div className={`${styles.menu} glass animate-slide-up`}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
