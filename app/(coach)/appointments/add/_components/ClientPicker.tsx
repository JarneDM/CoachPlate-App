import { useMemo, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList } from "react-native"
import { ChevronDown, Search, Check, X } from "lucide-react-native"
import type { Client } from "@/types/client"
import styles from "./ClientPicker.styles"

type Props = {
  clients: Client[]
  value: string
  onChange: (clientId: string) => void
  error?: boolean
}

export function ClientPicker({ clients, value, onChange, error }: Props) {
  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState("")

  const selectedClient = clients.find((client) => client.id === value)

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return clients
    return clients.filter((client) => client.full_name.toLowerCase().includes(query))
  }, [clients, search])

  const openPicker = () => {
    setSearch("")
    setVisible(true)
  }

  const selectClient = (clientId: string) => {
    onChange(clientId)
    setVisible(false)
  }

  return (
    <View>
      <TouchableOpacity
        style={[styles.trigger, error && styles.triggerError]}
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, !selectedClient && styles.triggerPlaceholder]} numberOfLines={1}>
          {selectedClient ? selectedClient.full_name : "Select a client"}
        </Text>
        <ChevronDown size={16} color="#9ca3af" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Select a client</Text>
              <TouchableOpacity onPress={() => setVisible(false)} activeOpacity={0.7} hitSlop={8}>
                <X size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
              <Search size={15} color="#9ca3af" />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search clients…"
                placeholderTextColor="#9ca3af"
                autoFocus
              />
            </View>

            <FlatList
              data={filteredClients}
              keyExtractor={(item) => item.id}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => selectClient(item.id)} activeOpacity={0.7}>
                  <Text style={styles.optionText}>{item.full_name}</Text>
                  {item.id === value && <Check size={16} color="#16a34a" />}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No clients found.</Text>}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}
