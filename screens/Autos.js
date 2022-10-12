import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from "react-native"
import { Modal, TextInput, DataTable } from 'react-native-paper';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import Icon from 'react-native-vector-icons/EvilIcons';

export default function Autos({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [autoName, setAutoName] = useState("");
    const [lower, setLower] = useState(0);
    const [upper, setUpper] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [deleteKey, setDeleteKey] = useState(null);


    const containerStyle = {backgroundColor: 'white', padding: 20, width: 350, alignSelf: "center", alignItems: "center", justifyContent: "center"};

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <Button title="Add Auto" onPress={() => setModalVisible(true)} />
          ),
        });
      }, [navigation]);

    useEffect(() => {
        getData();
    }, [])

    const decrementLower = () => {
        if (lower !== 0) {
            setLower(lower - 1);
        }
    }

    const incrementLower = () => {
        setLower(lower + 1);
    }

    const decrementUpper = () => {
        if (upper !== 0) {
            setUpper(upper - 1);
        }
    }

    const incrementUpper = () => {
        setUpper(upper + 1);
    }

    const submitData = () => {
        const reset = () => {
            setAutoName("")
            setLower(0);
            setUpper(0);
        }

        if (!autoName) {
            alert("Auto must have a name.");
            return;
        }

        const db = getDatabase();
        const reference = ref(db, `autos/${autoName}`);
        set(reference, {
            lower: lower,
            upper: upper,
        });

        reset();
        setModalVisible(false);
        alert("Auto has ben added.")
    }

    const getData = () => {
        const db = getDatabase();
        const reference = ref(db, "autos/");
        onValue(reference, (snapshot) => {
            const autos = snapshot.val();
            var autoObj;
            var autoArr = [];
            for (var auto in autos) {
                autoObj = {
                    name: auto,
                    lower: autos[auto].lower,
                    upper: autos[auto].upper,
                }
                autoArr.push(autoObj);
            }
            setTableData(autoArr);
        });
    }

    const deleteAuto = () => {
        var auto = tableData[deleteKey]["name"];
        const db = getDatabase();
        const reference = ref(db, `autos/${auto}`);
        remove(reference);
        setDeleteModalVisible(false);
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.container}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={{ flex : 15 }}>Name</DataTable.Title>
                        <DataTable.Title style={{ flex : 15 }}>Lower</DataTable.Title>
                        <DataTable.Title style={{ flex : 15 }}>Upper</DataTable.Title>
                        <DataTable.Title style={{ flex : 1 }}></DataTable.Title>
                    </DataTable.Header>
                    {
                        tableData.map((auto, key) => (
                            <DataTable.Row key={key}>
                                <DataTable.Cell style={{ flex : 15 }}>{auto["name"]}</DataTable.Cell>
                                <DataTable.Cell style={{ flex : 15 }}>{auto["lower"]}</DataTable.Cell>
                                <DataTable.Cell style={{ flex : 15 }}>{auto["upper"]}</DataTable.Cell>
                                <DataTable.Cell style={{ flex : 1, marginRight: 5, paddingTop: 6 }}>
                                    <TouchableOpacity style={[styles.container, styles.icon]} onPress={() => {setDeleteKey(key); setDeleteModalVisible(true) }}>
                                        <Text>
                                            <Icon name="trash" size={30} color="black" />
                                        </Text>
                                    </TouchableOpacity>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))
                    }
                </DataTable>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={containerStyle}>
                    <TextInput
                        selectionColor="#2196F3"
                        underlineColor="#2196F3"
                        activeUnderlineColor="#2196F3"
                        outlineColor="#2196F3"
                        style={{ width: "80%", height: 50 }}
                        label="Auto Name"
                        value={autoName}
                        onChangeText={text => setAutoName(text)}
                    />
                    <View style={[styles.row, { width: "30%", justifyContent: "space-between" }]}>
                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => decrementLower()}>
                            <Text style={{ fontSize: 30, color: "#2196F3" }}>-</Text>
                        </TouchableOpacity>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 30 }}>{lower}</Text>
                            <Text>Lower</Text>
                        </View>
                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => incrementLower()}>
                            <Text style={{ fontSize: 30, color: "#2196F3" }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.row, { width: "30%", justifyContent: "space-between" }]}>
                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => decrementUpper()}>
                            <Text style={{ fontSize: 30, color: "#2196F3" }}>-</Text>
                        </TouchableOpacity>
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 30 }}>{upper}</Text>
                            <Text>Upper</Text>
                        </View>
                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => incrementUpper()}>
                            <Text style={{ fontSize: 30, color: "#2196F3" }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                        <Button title="Add" onPress={() => submitData()}/>
                    </View>
                </Modal>
                <Modal visible={deleteModalVisible} onDismiss={() => setDeleteModalVisible(false)} contentContainerStyle={containerStyle}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Are you sure you want to submit the data?</Text>
                    <View style={styles.row}>
                        <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} />
                        <Button title="Confirm" onPress={() => deleteAuto()}/>
                    </View>
                </Modal>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    row: {
        flexDirection: "row", 
        width: "100%", 
        justifyContent: "center", 
        alignItems: "center",
        marginVertical: 5,
    },
    icon: {
        justifyContent: "center",
        paddingTop: 5,
        backgroundColor: "#CD1515",
        width: 40,
        height: 40,
        borderRadius: 10
    }
})