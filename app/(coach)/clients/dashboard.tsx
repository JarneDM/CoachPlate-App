import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus, Users, ChevronRight } from "lucide-react-native";
import { useClients } from "@/hooks/useClients";
import styles from "./dashboard.styles";

export default function ClientsScreen() {
  const { clients, loading } = useClients();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Clients</Text>
            <Text style={styles.subtitle}>
              {clients.length} {clients.length === 1 ? "client" : "clients"} in your list
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addButton}>
              <Plus size={14} color="#ffffff" />
              <Text style={styles.addButtonText}>New client</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {clients.length > 0 ? (
          <View style={styles.grid}>
            {clients.map((client) => (
              <TouchableOpacity key={client.id} style={styles.card} activeOpacity={0.7}>
                <View style={styles.cardLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{client.full_name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName} numberOfLines={1}>
                      {client.full_name}
                    </Text>
                    {client.email ? (
                      <Text style={styles.clientEmail} numberOfLines={1}>
                        {client.email}
                      </Text>
                    ) : null}
                    {client.goal ? (
                      <View style={styles.goalBadge}>
                        <Text style={styles.goalBadgeText}>{client.goal}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <ChevronRight size={16} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Users size={28} color="#16a34a" />
            </View>
            <Text style={styles.emptyTitle}>No clients yet</Text>
            <Text style={styles.emptySubtitle}>Add your first client to get started.</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient colors={["#15803d", "#16a34a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyButton}>
                <Plus size={14} color="#ffffff" />
                <Text style={styles.emptyButtonText}>Add first client</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
