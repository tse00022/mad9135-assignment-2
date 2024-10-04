import { useState, useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://random-data-api.com/api/users/random_user?size=10")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((e) => {
        alert("Network error, please try again later.");
        console.error("Error fetching data: ", e);
      });
  }, []);

  // Item renderer for FlatList
  const renderItem = ({ item }) => {
    console.log("item: ", item);
    console.log("item.first_name: ", item.first_name);
    return (<View>
      <Text>{item.first_name}</Text>
      <Text>{item.last_name}</Text>
      <Text style={styles.body}>{item.uid}</Text>
      <Text style={styles.body}>{item.avatar}</Text>
    </View>)
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <Text>Hello</Text>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
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