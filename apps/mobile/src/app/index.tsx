import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Status = "checking" | "ok" | "unreachable"

export default function Index() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/health/`)
      .then((res) => setStatus(res.ok ? "ok" : "unreachable"))
      .catch(() => setStatus("unreachable"))
  }, []);

  return (
    <View style={styles.container}>
      <Text>API: {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" }
});
