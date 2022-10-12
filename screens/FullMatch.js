import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native"
import { Button, Card, Title, Modal } from 'react-native-paper';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import DropDownPicker from 'react-native-dropdown-picker';
import app from "../firebase";
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { useIsFocused } from "@react-navigation/native";


export default function FullMatch() {
    const [autoLower, setAutoLower] = useState(0);
    const [autoUpper, setAutoUpper] = useState(0);
    const [teleLower, setTeleLower] = useState(0);
    const [teleUpper, setTeleUpper] = useState(0);
    const [climb, setClimb] = useState("");
    const [timerPlaying, setTimerPlaying] = useState(false);
    const [key, setKey] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [autoList, setAutoList] = useState([]);
    const [selectedAuto, setSelectedAuto] = useState("");
    const [open, setOpen] = useState(false);
    
    const containerStyle = {backgroundColor: 'white', padding: 20, width: 350, alignSelf: "center", alignItems: "center", justifyContent: "center", zIndex: 10};
    const db = getDatabase();

    const isFocused = useIsFocused();

    useEffect(() => {
        setAutoList([])
        get_autos();
    }, [isFocused]);

    useEffect(() => {
        get_autos();
    }, [])

    const get_autos = () => {
        const reference = ref(db, 'autos/');
        var lAutoList = [];
        onValue(reference, (snapshot) => {
            const autos = snapshot.val();

            for (var auto in autos) {
                lAutoList.push({ label: auto, value: auto });
            }

            setAutoList(lAutoList);
        })
    }
    
    const decrementAutoLower = () => {
        if (autoLower !== 0) {
            setAutoLower(autoLower - 1);
        }
    }

    const incrementAutoLower = () => {
        setAutoLower(autoLower + 1);       
    }

    const decrementAutoUpper = () => {
        if (autoUpper !== 0) {
            setAutoUpper(autoUpper - 1);
        }
    }

    const incrementAutoUpper = () => {
        setAutoUpper(autoUpper + 1);
    }

    const decrementTeleLower = () => {
        if (teleLower !== 0) {
            setTeleLower(teleLower - 1);
        }
    }

    const incrementTeleLower = () => {
        setTeleLower(teleLower + 1);
    }

    const decrementTeleUpper = () => {
        if (teleUpper !== 0) {
            setTeleUpper(teleUpper - 1);
        }
    }

    const incrementTeleUpper = () => {
        setTeleUpper(teleUpper + 1);
    }

    const calculateAccuracy = (actual, expected) => {
        if (expected === 0) {
            return 1;
        }

        return actual/expected
    }

    const uploadData = () => {
        if (!selectedAuto) {
            alert("Select auto");
            return;
        }

        const reset = () => {
            setAutoLower(0);
            setAutoUpper(0);
            setTeleLower(0);
            setTeleUpper(0);
            setClimb("");
            setSelectedAuto("");
            setTimerPlaying(false);
            setKey(0);
        }
        
        var date = new Date
        
        const autoRef = ref(db, `autos/${selectedAuto}`);
        var expectedAutoLower;
        var expectedAutoUpper;
        
        onValue(autoRef, (snapshot) => {
            const autoData = snapshot.val();
            expectedAutoLower = autoData["lower"];
            expectedAutoUpper = autoData["upper"];
        })

        const matchRef = ref(db, `full_match/${date.toString()}`);
        set(matchRef, {
            auto_lower: autoLower,
            auto_upper: autoUpper,
            expected_auto_lower: expectedAutoLower,
            expected_auto_upper: expectedAutoUpper,
            auto_lower_acc: calculateAccuracy(autoLower, expectedAutoLower),
            auto_upper_acc: calculateAccuracy(autoUpper, expectedAutoUpper), 
            tele_lower: teleLower,
            tele_upper: teleUpper,
            endgame: climb,
        });

        const eventRef = ref(db, `events/${date.toString()}`);
        set(eventRef, {
            type: "Full Match",
            date_string: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
        })
        
        reset();
        setModalVisible(false);
        alert("Data has been submitted.")
    }

    return (
        <View style={styles.container}>
            <View style={modalVisible ? styles.row : [styles.row, { zIndex: 2 }]}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Auto</Title>
                        <View style={[styles.container, {height: "80%"}]}>
                            <View style={styles.cardRow}>
                                <Button color="white" style={styles.button} onPress={() => decrementAutoLower()}>-</Button>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 30 }}>{autoLower}</Text>
                                    <Text>Lower</Text>
                                </View>
                                <Button color="white" style={styles.button} onPress={() => incrementAutoLower()}>+</Button>
                            </View>
                            <View style={styles.cardRow}>
                                <Button color="white" style={styles.button} onPress={() => decrementAutoUpper()}>-</Button>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 30 }}>{autoUpper}</Text>
                                    <Text>Upper</Text>
                                </View>
                                <Button color="white" style={styles.button} onPress={() => incrementAutoUpper()}>+</Button>
                            </View>
                        </View>
                        <View style={styles.dropdownView}>
                            <DropDownPicker
                                open={open}
                                value={selectedAuto}
                                items={autoList}
                                setOpen={setOpen}
                                setValue={setSelectedAuto}
                                placeholder="Select Auto"
                            />
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Teleop</Title>
                        <View style={[styles.container, { height: "80%" }]}>
                            <View style={styles.cardRow}>
                                <Button color="white" style={styles.button} onPress={() => decrementTeleLower()}>-</Button>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 30 }}>{teleLower}</Text>
                                    <Text>Lower</Text>
                                </View>
                                <Button color="white" style={styles.button} onPress={() => incrementTeleLower()}>+</Button>
                                </View>
                            <View style={styles.cardRow}>
                                <Button color="white" style={styles.button} onPress={() => decrementTeleUpper()}>-</Button>
                                <View style={{ alignItems: "center" }}>
                                    <Text style={{ fontSize: 30 }}>{teleUpper}</Text>
                                    <Text>Upper</Text>
                                </View>
                                <Button color="white" style={styles.button} onPress={() => incrementTeleUpper()}>+</Button>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>
            <View style={styles.row}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Endgame</Title>
                        <View style={[styles.container, {height: "80%", paddingTop: 50 }]}>
                            <Button color="white" style={[styles.button, climb === "No Climb" ? { width: "80%", marginBottom: 10, borderWidth: 5, borderColor: "yellow" } : { width: "80%", marginBottom: 10 }]} onPress={() => setClimb("No Climb")}>No Climb</Button>
                            <Button color="white" style={[styles.button, climb === "Low Climb" ? { width: "80%", marginBottom: 10, borderWidth: 5, borderColor: "yellow" } : { width: "80%", marginBottom: 10 }]} onPress={() => setClimb("Low Climb")}>Low Climb</Button>
                            <Button color="white" style={[styles.button, climb === "Mid Climb" ? { width: "80%", marginBottom: 10, borderWidth: 5, borderColor: "yellow" } : { width: "80%", marginBottom: 10 }]} onPress={() => setClimb("Mid Climb")}>Mid Climb</Button>
                            <Button color="white" style={[styles.button, climb === "High Climb" ? { width: "80%", marginBottom: 10, borderWidth: 5, borderColor: "yellow" } : { width: "80%", marginBottom: 10 }]} onPress={() => setClimb("High Climb")}>High Climb</Button>
                            <Button color="white" style={[styles.button, climb === "Traversal Climb" ? { width: "80%", marginBottom: 10, borderWidth: 5, borderColor: "yellow" } : { width: "80%", marginBottom: 10 }]} onPress={() => setClimb("Traversal Climb")}>Traversal Climb</Button>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Timer</Title>
                        <View style={[styles.container, {height: "80%" }]}>
                            <CountdownCircleTimer
                                key={key}
                                isPlaying={timerPlaying}
                                duration={150}
                                colors={['#01FF00', '#FFE800', '#FF9900', '#FF0000']}
                                colorsTime={[150, 30, 15, 0]}
                            >
                                {({ remainingTime }) => <Text>{remainingTime}</Text>}
                            </CountdownCircleTimer>
                            <View style={[styles.cardRow, { marginTop: 30, paddingHorizontal: 20 }]}>
                                <Button color="white" style={[styles.button, {width: "30%"}]} onPress={() => setTimerPlaying(!timerPlaying)}>{timerPlaying ? "Pause" : "Start"}</Button>
                                <Button color="white" style={[styles.button, {width: "30%"}]} onPress={() => {setTimerPlaying(false); setKey(key + 1);}}>Reset</Button>
                                <Button color="white" style={[styles.button, {width: "30%", backgroundColor: "#18CE42"}]} onPress={() => setModalVisible(true)}>Submit</Button>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={containerStyle}>
                <Text style={{ fontSize: 20, marginBottom: 10 }}>Are you sure you want to submit the data?</Text>
                <Button color="white" style={[styles.button, {width: "50%", backgroundColor: "#CE3318", marginBottom: 10 }]} onPress={() => setModalVisible(false)}>Cancel</Button>
                <Button color="white" style={[styles.button, {width: "50%", backgroundColor: "#18CE42"}]} onPress={() => uploadData()}>Confirm</Button>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    row: {
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
        height: "50%",
        paddingVertical: 10,
    },
    card: {
        width: "45%",
        margin: 10,
    },
    cardRow: {
        flexDirection: "row", 
        width: "100%", 
        justifyContent: "center", 
        alignItems: "center",
        marginVertical: 5,
    },
    button: {
        backgroundColor: "#9A14EC", 
        borderRadius: "30%",
        marginHorizontal: 20,
    },
    dropdownView: {
        position: "absolute", 
        bottom: 0, 
        left: 70, 
        width: "80%",
    }
})