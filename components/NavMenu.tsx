import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  Modal,
} from "react-native";
import { usePathname, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase/supabase";
import { Menu, X, LayoutDashboard, Users, CalendarDays, Dumbbell, Settings, LogOut, LibraryBig, PhoneCall } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.8;

const NAV_ITEMS = [
  { href: "/(coach)/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/(coach)/clients/dashboard", label: "Clients", icon: Users },
  { href: "/(coach)/appointments", label: "Appointments", icon: PhoneCall },
  { href: "/(coach)/meal-plans", label: "Meal Plans", icon: CalendarDays },
  { href: "/(coach)/training-plans", label: "Training Plans", icon: Dumbbell },
  { href: "/(coach)/recipes", label: "Recipes", icon: LibraryBig },
  { href: "/(coach)/settings", label: "Settings", icon: Settings },
];

type Coach = { full_name: string; email: string } | null;

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const [coach, setCoach] = useState<Coach>(null);
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from("coaches").select("full_name, email").eq("id", user.id).single().then(({ data }) => {
        setCoach(data);
      });
    });
  }, []);

  const openDrawer = () => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 260, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setOpen(false));
  };

  const navigate = (href: string) => {
    closeDrawer();
    setTimeout(() => router.push(href as any), 50);
  };

  const logout = async () => {
    closeDrawer();
    await supabase.auth.signOut();
    setTimeout(() => router.replace("/"), 50);
  };

  return (
    <SafeAreaView edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.logo}>CoachPlate</Text>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton} activeOpacity={0.7}>
          <Menu size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      <Modal visible={open} transparent animationType="none" onRequestClose={closeDrawer}>
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} pointerEvents="auto">
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
          </Animated.View>

          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 16 }]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Navigation</Text>
              <TouchableOpacity onPress={closeDrawer} style={styles.closeButton} activeOpacity={0.7}>
                <X size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.nav}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <TouchableOpacity
                    key={item.href}
                    style={[styles.navItem, active && styles.navItemActive]}
                    onPress={() => navigate(item.href)}
                    activeOpacity={0.7}
                  >
                    <Icon size={16} color={active ? "#15803d" : "#6b7280"} />
                    <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.drawerFooter}>
              <View style={styles.profile}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{(coach?.full_name?.charAt(0) ?? "C").toUpperCase()}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {coach?.full_name ?? "Coach"}
                  </Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>
                    {coach?.email ?? ""}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.7}>
                <LogOut size={15} color="#dc2626" />
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
  },
  menuButton: {
    padding: 4,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.5)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#ffffff",
    borderLeftWidth: 1,
    borderLeftColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
    paddingHorizontal: 12,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  drawerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
  },
  nav: {
    gap: 2,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: "#f0fdf4",
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  navLabelActive: {
    color: "#15803d",
  },
  drawerFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    gap: 12,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#15803d",
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  profileEmail: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fee2e2",
    backgroundColor: "#fff5f5",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
  },
});
