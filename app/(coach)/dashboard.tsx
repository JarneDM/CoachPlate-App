import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { supabase } from '@/lib/supabase/supabase'
import { router } from 'expo-router'

function DashboardCoach() {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const {data: coach} = await supabase.from("coaches").select("*").eq("id", user?.id).maybeSingle()
      setUser(coach)
    }
    fetchUser()
  }, [])
  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/(auth)/login")
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome, {user?.full_name.split(' ')[0]}!</Text>
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 100,
    alignItems: 'center',
  }
});


export default DashboardCoach
