import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { CropAdvisorFormScreen } from '@/screens/crop-advisor/CropAdvisorFormScreen';
import { CropAdvisorIntroScreen } from '@/screens/crop-advisor/CropAdvisorIntroScreen';
import { CropAdvisorSuccessScreen } from '@/screens/crop-advisor/CropAdvisorSuccessScreen';

type CropAdvisorScreen = 'intro' | 'form' | 'success';

export default function CropAdvisorRoute() {
  const params = useLocalSearchParams<{ phoneNumber?: string }>();
  const [screen, setScreen] = useState<CropAdvisorScreen>('intro');

  const phoneNumber = params.phoneNumber?.trim();

  if (screen === 'form') {
    return (
      <CropAdvisorFormScreen
        onBack={() => setScreen('intro')}
        onSubmit={() => setScreen('success')}
      />
    );
  }

  if (screen === 'success') {
    return (
      <CropAdvisorSuccessScreen
        phoneNumber={phoneNumber}
        onBack={() => setScreen('form')}
        onDone={() => setScreen('intro')}
      />
    );
  }

  return (
    <CropAdvisorIntroScreen
      onContinue={() => setScreen('form')}
    />
  );
}
