'use client';

import {
  FlaskConical, Beaker, Pill, Dna, Microscope,
  Zap, Brain, HeartPulse, Dumbbell, Sparkles,
} from 'lucide-react';

export const iconMap = {
  FlaskConical,
  Beaker,
  Pill,
  Dna,
  Microscope,
  Zap,
  Brain,
  HeartPulse,
  Dumbbell,
  Sparkles,
};

export const getIconByName = (iconName) => {
  return iconMap[iconName] || FlaskConical;
};
