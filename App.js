import { useState, useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View, RefreshControl, TouchableOpacity, Platform, StatusBar } from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import UserAvatar from 'react-native-user-avatar';

export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (count = 10, append=false) => {
    setRefreshing(true);
    axios
      .get(`https://random-data-api.com/api/users/random_user?size=${count}`)
      .then((response) => {
        setRefreshing(false);

        if (append) {
          setUsers([...response.data, ...users]);
        } else {
          setUsers(response.data);
        }

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
            visibilityTime: 2000,
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={{textAlign: Platform.OS == "ios" ? "left" : "right"}}>{item.first_name}</Text>
        <Text style={{textAlign: Platform.OS == "ios" ? "left" : "right"}}>{item.last_name}</Text>
      </View>
      <View>
        <UserAvatar size={50} name={item.first_name} src={item.avatar} borderRadius={10}/>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.uid.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
          }
        />
        <TouchableOpacity style={styles.fab} onPress={() => { fetchUsers(1, true) }}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
        <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  item: {
    padding: 10,
    marginVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    flexDirection: Platform.OS == "ios" ? "row" : "row-reverse",
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});