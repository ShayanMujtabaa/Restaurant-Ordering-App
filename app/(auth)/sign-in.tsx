import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [form, setForm] = useState({email: '', password: ''});

     const submit = async () => {
     const {email, password} = form;

      if(!email || !password) return Alert.alert('Error', 'Please enter valid email address & password')

      setIsSubmitting(true)

     try{
      await signIn({email, password})

      router.replace('/');
     } catch(error:any) {
      Alert.alert('Error', error.message);
     } finally {
      setIsSubmitting(false)
     }

  }


  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>

        <CustomInput 
                 placeholder="Enter Your Email"
                 value={form.email}
                 onChangeText={(text) =>setForm((prev)=>({...prev, email:text}))}
                 label="Email"
                 keyboardType="email-address"
                />

        <CustomInput 
                 placeholder="Enter Your Password"
                 value={form.password}
                 onChangeText={(text) =>setForm((prev)=>({...prev, password:text}))}
                 label="Password"
                 secureTextEntry={true}
                />
        <CustomButton 
                  title='Sign In'
                  isLoading={isSubmitting}
                  onPress={submit}
                />
    <View className='flex justify-center mt-5 flex-row gap-2'>
      <Text>
        Don't have an account?

      <Link href='/sign-up' className='base-bold text-primary pl-1'>
      Sign Up
      </Link>
      </Text>
    </View>
    </View>

  )
}

export default SignIn