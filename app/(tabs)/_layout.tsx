import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';
import { TabBarIconProps } from '@/type';
import cn from 'clsx';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const TabBarIcon = ({focused, icon, title }: TabBarIconProps) => (
  <View className='tab-icon'>
    <Image source={icon} className='size-7' resizeMode='contain' tintColor={ focused ? '#FE8C00' : '#5D5F6D'} />
    <Text className={cn('text-sm font-bold', focused ? 'text-primary':'text-gray-200')}>
      {title}
    </Text>
  </View>
)

export default function TabLayout() {
  const {isAuthenticated} = useAuthStore();

  if(!isAuthenticated) return <Redirect href="/sign-in"/>

  return (
  <Tabs
       screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
        }
       }}
  >
    <Tabs.Screen 
      name='index'
      options={{
        title: 'Home',
        tabBarIcon: ({focused}) => <TabBarIcon title='Home' icon={images.home} focused={focused}  />
      }}
    />
  </Tabs>
  );
}