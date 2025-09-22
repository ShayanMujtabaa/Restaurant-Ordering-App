import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import seed from '@/lib/seed'

const search = () => {
  return (
    <SafeAreaView>
      <Text>Search</Text>
      <Button title="Seed" onPress={() => {
    console.log("👉 Seed button pressed");
    seed().catch((error) => console.log("Failed to seed", error));
  }}  />
    </SafeAreaView>
  )
}

export default search