'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<any>(null);

  useEffect(() => {
    if (password) {
      checkStrength();
    } else {
      setStrength(null);
    }
  }, [password]);

  const checkStrength = async () => {
    try {
      const response = await api.post('/auth/check-password-strength/', {
        password,
      });
      setStrength(response.data);
    } catch (error) {
      console.error('Error checking password strength:', error);
    }
  };

  if (!strength) return null;

  const getColor = () => {
    if (strength.level === 'weak') return 'bg-red-500';
    if (strength.level === 'medium') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getWidth = () => {
    return `${(strength.score / 5) * 100}%`;
  };

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getColor()}`}
          style={{ width: getWidth() }}
        ></div>
      </div>
      <div className="mt-1 flex justify-between items-center">
        <span className={`text-sm font-medium ${
          strength.level === 'weak' ? 'text-red-600' :
          strength.level === 'medium' ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}
        </span>
      </div>
      {strength.feedback && strength.feedback.length > 0 && (
        <ul className="mt-2 text-xs text-gray-600 space-y-1">
          {strength.feedback.map((item: string, index: number) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}