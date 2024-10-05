import { useState, useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View, RefreshControl } from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers(10);
  }, []);

  const fetchUsers = (count = 1) => {
    setRefreshing(true);
    axios
      .get(`https://random-data-api.com/api/users/random_user?size=${count}`)
      .then((response) => {
        setUsers(response.data);
        setRefreshing(false);
        Toast.show({
          type: 'success',
          text2: 'User list fetched successfully 👋',
          position: 'bottom',
          visibilityTime: 500,
        });
      })
      .catch((e) => {
        setRefreshing(false);
        if (e.response && e.response.status === 429) {
          Toast.show({
            type: 'error',
            text1: 'Too fast!',
            text2: 'Please slow down and try again later.✋🏾',
            position: 'bottom',
          });
          return
        }
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: e.message,
          position: 'bottom',
        });
      });
  }

  // Item renderer for FlatList
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.first_name}</Text>
      <Text>{item.last_name}</Text>
      <Text style={styles.body}>{item.uid}</Text>
      <Text style={styles.body}>{item.avatar}</Text>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
          }
        />
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});