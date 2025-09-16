import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function _layout() {
  const isAutheticated =true;

  if(!isAutheticated) return <Redirect href="/sign-in"/>
  return <Slot />
}