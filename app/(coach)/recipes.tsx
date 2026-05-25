import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, TouchableOpacity } from 'react-native'

function recipes() {
  const [view, setView] = React.useState<"my-recipes" | "public-recipes">("my-recipes")
  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={() => setView("my-recipes")}>
          <Text>Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView("public-recipes")}>
          <Text>Public Recipes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default recipes
